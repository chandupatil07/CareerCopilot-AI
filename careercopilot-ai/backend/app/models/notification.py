from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base_class import Base

class Notification(Base):
    """
    Notification model recording scheduled reminders or status update alerts.
    Includes rich context like severity priorities, routing action links, and custom metadata.
    """
    __tablename__ = "notification"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="info", nullable=False) # e.g. success, warning, info, error
    notification_type = Column(String(50), default="system", nullable=False, index=True) # e.g. welcome, resume_uploaded, ats_score
    priority = Column(String(20), default="medium", nullable=False, index=True) # e.g. high, medium, low
    icon = Column(String(50), nullable=True) # Icon styling details
    is_read = Column(Boolean, default=False, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=True)
    metadata_json = Column(JSON, nullable=True)
    action_url = Column(String(255), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)

    # Relationships
    user = relationship("User", back_populates="notifications")
