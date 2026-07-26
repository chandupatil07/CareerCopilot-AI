import logging
from typing import List, AsyncGenerator
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.repositories.chat_session import chat_session_repo, chat_message_repo
from app.models.chat import ChatSession, ChatMessage
from app.schemas.chat_session import ChatSessionCreate, ChatMessageCreate
from app.services.ai.prompt_builder import PromptBuilder
from app.services.ai.gemini_service import GeminiService
from app.services.ai.response_formatter import ResponseFormatter

logger = logging.getLogger("app.services.ai_assistant")

class AIAssistantService:
    """
    Service layer coordinating conversational transactions for the AI Assistant.
    Enforces ownership validation, IDOR checks, and timestamp updates.
    """
    @staticmethod
    def create_conversation(db: Session, *, user_id: int, obj_in: ChatSessionCreate) -> ChatSession:
        """
        Start a new chat session conversation window.
        """
        obj_data = {
            "user_id": user_id,
            "title": obj_in.title
        }
        return chat_session_repo.create(db, obj_in=obj_data)

    @staticmethod
    def list_conversations(db: Session, *, user_id: int) -> List[ChatSession]:
        """
        List all chat sessions for the logged-in candidate.
        """
        return chat_session_repo.list_by_user(db, user_id=user_id)

    @staticmethod
    def get_conversation_messages(db: Session, *, user_id: int, session_id: int) -> List[ChatMessage]:
        """
        Retrieve all chat turns history inside a conversation.
        Includes strict user ownership verification (IDOR protection).
        """
        session = chat_session_repo.get(db, id=session_id)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversational chat session not found."
            )
        if session.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. You do not own this chat session."
            )
        return chat_message_repo.list_by_session(db, session_id=session_id)

    @staticmethod
    def save_message(db: Session, *, user_id: int, session_id: int, obj_in: ChatMessageCreate) -> ChatMessage:
        """
        Persist a message log turn (role: user or assistant).
        If the role is 'user', runs the full 9-step flow to call Gemini
        and returns the created assistant response message.
        """
        session = chat_session_repo.get(db, id=session_id)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversational chat session not found."
            )
        if session.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. You cannot post to this chat session."
            )
        
        if obj_in.role not in ["user", "assistant"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid message role. Must be 'user' or 'assistant'."
            )

        # Direct assistant save bypass (for testing/mocks configuration support)
        if obj_in.role == "assistant":
            msg_data = {
                "session_id": session_id,
                "role": "assistant",
                "content": obj_in.content
            }
            msg = chat_message_repo.create(db, obj_in=msg_data)
            session.updated_at = func.now()
            db.add(session)
            db.commit()
            return msg

        # Otherwise, orchestrate the full 9-step Gemini prompt & execution loop
        # Step 3: Save user message
        user_msg_data = {
            "session_id": session_id,
            "role": "user",
            "content": obj_in.content
        }
        user_msg = chat_message_repo.create(db, obj_in=user_msg_data)

        # Update parent session timestamp
        session.updated_at = func.now()
        db.add(session)
        db.commit()

        # Step 4: Load previous conversation history (including the saved user message)
        history = chat_message_repo.list_by_session(db, session_id=session_id)

        # Step 5: Build prompt
        system_instruction = PromptBuilder.get_system_instruction()
        contents = PromptBuilder.build_history(history)

        # Step 6 & 7: Call Gemini & Receive response
        try:
            raw_response = GeminiService.generate_response(system_instruction, contents)
            # Step 8: Parse/Format response
            assistant_content = ResponseFormatter.format_response(raw_response)
        except Exception as e:
            # If Gemini fails, delete the user's message to maintain DB transaction integrity
            chat_message_repo.remove(db, id=user_msg.id)
            
            # Map exception details to a user-friendly message
            error_detail = "The AI Assistant is currently experiencing connection issues. Please try again."
            if hasattr(e, "message"):
                error_detail = e.message
            
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=error_detail
            )

        # Save assistant response
        assistant_msg_data = {
            "session_id": session_id,
            "role": "assistant",
            "content": assistant_content
        }
        assistant_msg = chat_message_repo.create(db, obj_in=assistant_msg_data)

        # Update parent session timestamp again
        session.updated_at = func.now()
        db.add(session)
        db.commit()

        # Step 9: Return response (the assistant message) to frontend
        return assistant_msg

    @staticmethod
    async def stream_message(
        db: Session,
        *,
        user_id: int,
        session_id: int,
        obj_in: ChatMessageCreate
    ) -> AsyncGenerator[str, None]:
        """
        Verify access, save user prompt, load history, and stream reply tokens.
        Enforces ownership validations and IDOR checks.
        """
        session = chat_session_repo.get(db, id=session_id)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversational chat session not found."
            )
        if session.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. You cannot post to this chat session."
            )

        if obj_in.role != "user":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid message role for streaming. Must be 'user'."
            )

        # Save user message
        user_msg_data = {
            "session_id": session_id,
            "role": "user",
            "content": obj_in.content
        }
        user_msg = chat_message_repo.create(db, obj_in=user_msg_data)

        # Update parent session timestamp
        session.updated_at = func.now()
        db.add(session)
        db.commit()

        # Load history
        history = chat_message_repo.list_by_session(db, session_id=session_id)

        # Build prompt
        system_instruction = PromptBuilder.get_system_instruction()
        contents = PromptBuilder.build_history(history)

        from app.services.ai.streaming_service import GeminiStreamingService
        return GeminiStreamingService.stream_chat_response(
            db=db,
            session_id=session_id,
            user_message_id=user_msg.id,
            system_instruction=system_instruction,
            contents=contents
        )

    @staticmethod
    def update_conversation(db: Session, *, user_id: int, session_id: int, obj_in: ChatSessionCreate) -> ChatSession:
        """
        Rename or update a chat session's title.
        Enforces user ownership check (IDOR protection).
        """
        session = chat_session_repo.get(db, id=session_id)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversational chat session not found."
            )
        if session.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. You cannot modify this chat session."
            )
        return chat_session_repo.update(db, db_obj=session, obj_in=obj_in)

    @staticmethod
    def delete_conversation(db: Session, *, user_id: int, session_id: int) -> ChatSession:
        """
        Delete a conversation session. All linked message elements are cascading-purged.
        """
        session = chat_session_repo.get(db, id=session_id)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversational chat session not found."
            )
        if session.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. You cannot delete this chat session."
            )
        
        return chat_session_repo.remove(db, id=session_id)
