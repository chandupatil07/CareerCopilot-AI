from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base_class import Base

class AIChat(Base):
    """
    AIChat model mapping conversational dialogues with our AI assistant.
    Stores prompts, responses, conversation keys, and user details.
    """
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False, index=True)
    conversation_id = Column(String(100), nullable=True, index=True) # Enables grouping chat history sessions
    prompt = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="ai_chats")
