from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base_class import Base

class ColdEmailHistory(Base):
    """
    ColdEmailHistory model recording compiled outreach letters.
    """
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False, index=True)
    generated_email = Column(Text, nullable=False)
    company = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    created_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    user = relationship("User")

class LinkedInHistory(Base):
    """
    LinkedInHistory model recording compiled recruiter connection pitches.
    """
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False, index=True)
    generated_message = Column(Text, nullable=False)
    target_company = Column(String(100), nullable=False)
    created_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    user = relationship("User")
