import logging
import asyncio
import json
from typing import AsyncGenerator
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
import google.generativeai as genai
from google.api_core import exceptions as google_exceptions

from app.core.config import settings
from app.repositories.chat_session import chat_message_repo, chat_session_repo
from app.services.ai.gemini_service import GeminiService
from app.services.ai.response_formatter import ResponseFormatter
from app.services.ai.ai_exceptions import (
    AIServiceError,
    AITimeoutError,
    AIRateLimitError,
    AIConnectionError,
    AIInvalidRequestError
)

logger = logging.getLogger("app.services.ai.streaming_service")

class GeminiStreamingService:
    """
    Dedicated service for handling real-time streaming AI responses.
    Iterates over the Gemini generator, handles disconnections,
    and commits the completed transaction to the database.
    """

    @classmethod
    async def stream_chat_response(
        cls,
        db: Session,
        session_id: int,
        user_message_id: int,
        system_instruction: str,
        contents: list
    ) -> AsyncGenerator[str, None]:
        model_name = settings.GEMINI_MODEL or "gemini-2.0-flash"
        timeout = float(settings.GEMINI_TIMEOUT_SECONDS)
        accumulated_text = ""

        try:
            # Initialize Gemini API client configurations via parent service
            GeminiService._initialize_client()

            model = genai.GenerativeModel(
                model_name=model_name,
                system_instruction=system_instruction
            )

            # Initiate async generative stream with timeout parameters
            response = await model.generate_content_async(
                contents,
                stream=True,
                request_options={"timeout": timeout}
            )

            async for chunk in response:
                chunk_text = chunk.text or ""
                accumulated_text += chunk_text
                # Yield text tokens instantly in standard SSE envelope
                yield f"data: {json.dumps({'content': chunk_text})}\n\n"

            # Stream completed successfully. Formulate clean final content
            assistant_content = ResponseFormatter.format_response(accumulated_text)

            # Persist the final assistant message record to the database
            assistant_msg_data = {
                "session_id": session_id,
                "role": "assistant",
                "content": assistant_content
            }
            assistant_msg = chat_message_repo.create(db, obj_in=assistant_msg_data)

            # Update parent session timestamps
            session = chat_session_repo.get(db, id=session_id)
            if session:
                session.updated_at = func.now()
                db.add(session)
            db.commit()

            # Yield final done message with database record ID
            yield f"data: {json.dumps({'content': '', 'done': True, 'message_id': assistant_msg.id})}\n\n"

        except (GeneratorExit, asyncio.CancelledError):
            logger.warning(f"Connection aborted mid-stream for message {user_message_id}. Committing database rollback.")
            # Rollback user's prompt to maintain strict visual consistency (ADR-055)
            chat_message_repo.remove(db, id=user_message_id)
            db.commit()
            raise

        except Exception as e:
            logger.error(f"Error occurred during streaming, falling back to mock: {e}")
            
            # Extract user message prompt to display in mock response
            user_prompt = "your query"
            try:
                user_msg = chat_message_repo.get(db, id=user_message_id)
                if user_msg:
                    user_prompt = user_msg.content
            except Exception:
                pass
                
            mock_text = (
                f"### 🤖 [Local Fail-Safe Mode] Gemini API Connection Status\n\n"
                f"Your Google Gemini API quota or rate-limit was exceeded: *{str(e)}*\n\n"
                f"To help you verify that the chat layout, messaging system, and SQLite database are working, "
                f"here is a mock career coach response to your prompt: **\"{user_prompt}\"**\n\n"
                f"#### General Career Guidelines:\n"
                f"1. **Resume Customization:** Audit your bullet points against target job keywords.\n"
                f"2. **Mock Interviews Prep:** Draft STAR-method stories emphasizing metric impacts.\n"
                f"3. **Outbound Outreach:** Keep templates short and personalize the opening hook.\n\n"
                f"*To enable live AI generation, please wait for Google to reset your free tier limit (usually resets daily).*"
            )
            
            # Stream mock text chunk by chunk with delay
            for chunk_text in [mock_text[i:i+8] for i in range(0, len(mock_text), 8)]:
                yield f"data: {json.dumps({'content': chunk_text})}\n\n"
                await asyncio.sleep(0.01)
                
            # Save mock message to DB
            try:
                assistant_msg_data = {
                    "session_id": session_id,
                    "role": "assistant",
                    "content": mock_text
                }
                assistant_msg = chat_message_repo.create(db, obj_in=assistant_msg_data)
                
                session = chat_session_repo.get(db, id=session_id)
                if session:
                    session.updated_at = func.now()
                    db.add(session)
                db.commit()
                yield f"data: {json.dumps({'content': '', 'done': True, 'message_id': assistant_msg.id})}\n\n"
            except Exception as db_err:
                logger.error(f"Failed to save mock response to database: {db_err}")
                yield f"data: {json.dumps({'error': 'Failed to save dialogue.'})}\n\n"
