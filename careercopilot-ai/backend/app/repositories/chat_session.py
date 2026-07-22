from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.repositories.base import BaseRepository
from app.models.chat import ChatSession, ChatMessage

class ChatSessionRepository(BaseRepository[ChatSession]):
    """
    ChatSessionRepository handling database operations for conversation sessions.
    """
    def list_by_user(self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100) -> List[ChatSession]:
        """
        List conversations created by a user, sorted by updated_at descending.
        """
        query = (
            select(self.model)
            .where(self.model.user_id == user_id)
            .order_by(self.model.updated_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(db.execute(query).scalars().all())

class ChatMessageRepository(BaseRepository[ChatMessage]):
    """
    ChatMessageRepository handling database operations for session logs messages.
    """
    def list_by_session(self, db: Session, *, session_id: int, skip: int = 0, limit: int = 100) -> List[ChatMessage]:
        """
        Fetch chat history messages within a conversation group, sorted by timestamp ascending.
        """
        query = (
            select(self.model)
            .where(self.model.session_id == session_id)
            .order_by(self.model.created_at.asc())
            .offset(skip)
            .limit(limit)
        )
        return list(db.execute(query).scalars().all())

chat_session_repo = ChatSessionRepository(ChatSession)
chat_message_repo = ChatMessageRepository(ChatMessage)
