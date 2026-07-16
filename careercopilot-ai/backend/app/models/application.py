from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base_class import Base

class Application(Base):
    """
    Application model representing job application tracker cards.
    Tracks structural metrics, recruiter contacts, target priorities, and timeline steps.
    """

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False, index=True)
    company_name = Column(String(100), nullable=False, index=True)
    job_role = Column(String(100), nullable=False, index=True)
    source = Column(String(100), nullable=True) # e.g. LinkedIn, Referral, Glassdoor
    applied_date = Column(Date, nullable=True)
    current_stage = Column(String(50), default="Interested", nullable=False, index=True)
    location = Column(String(100), nullable=True) # e.g. San Francisco, CA / Remote
    employment_type = Column(String(50), nullable=True) # e.g. Full-time, Part-time, Contract, Internship
    salary_range = Column(String(50), nullable=True) # e.g. $120k - $150k
    job_description = Column(Text, nullable=True)
    application_url = Column(String(255), nullable=True)
    recruiter_name = Column(String(100), nullable=True)
    recruiter_email = Column(String(100), nullable=True)
    resume_version_used = Column(Integer, nullable=True)
    priority = Column(String(20), default="Medium", nullable=False) # e.g. High, Medium, Low
    expected_salary = Column(String(50), nullable=True)
    offer_amount = Column(String(50), nullable=True)
    joining_date = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)
    favorite = Column(Boolean, default=False, nullable=False, index=True)
    archived = Column(Boolean, default=False, nullable=False, index=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    # Relationships
    user = relationship("User", back_populates="applications")
    interviews = relationship("Interview", back_populates="application", cascade="all, delete-orphan")
    timeline = relationship("ApplicationTimeline", back_populates="application", cascade="all, delete-orphan")
