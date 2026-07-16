from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.base_class import Base

class ApplicationTimeline(Base):
    """
    ApplicationTimeline model logging historical stage migrations
    (e.g., Applied -> Assessment -> Technical Interview).
    """
    __tablename__ = "application_timelines"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("application.id", ondelete="CASCADE"), nullable=False, index=True)
    from_stage = Column(String(50), nullable=False)
    to_stage = Column(String(50), nullable=False)
    changed_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    notes = Column(Text, nullable=True)

    # Relationships
    application = relationship("Application", back_populates="timeline")
