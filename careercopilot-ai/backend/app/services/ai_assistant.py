from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.repositories.chat_session import chat_session_repo, chat_message_repo
from app.models.chat import ChatSession, ChatMessage
from app.schemas.chat_session import ChatSessionCreate, ChatMessageCreate

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
        Validates session ownership and updates the session updated_at timestamp.
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

        # Create message record
        msg_data = {
            "session_id": session_id,
            "role": obj_in.role,
            "content": obj_in.content
        }
        msg = chat_message_repo.create(db, obj_in=msg_data)

        # Update parent session timestamp to sort active conversations first
        session.updated_at = func.now()
        db.add(session)
        db.commit()

        return msg

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
