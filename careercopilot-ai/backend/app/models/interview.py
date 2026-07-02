from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database.base_class import Base

class Interview(Base):
    """
    Interview model tracking meeting schedules linked directly to job applications.
    """
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("application.id", ondelete="CASCADE"), nullable=False, index=True)
    interview_date = Column(Date, nullable=False, index=True)
    interview_time = Column(String(50), nullable=True) # String time formatted e.g. "14:00"
    mode = Column(String(50), default="Google Meet", nullable=False) # e.g. Zoom, Slack Huddle, In-person
    meeting_link = Column(String(255), nullable=True)
    interviewer_name = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    reminder_sent = Column(Boolean, default=False, nullable=False)

    # Relationships
    application = relationship("Application", back_populates="interviews")
