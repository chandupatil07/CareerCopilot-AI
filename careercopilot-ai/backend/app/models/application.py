from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base_class import Base

class Application(Base):
    """
    Application model representing job application tracker card logs.
    Includes stage logs, company coordinates, and links to scheduled interviews.
    """
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False, index=True)
    company_name = Column(String(100), nullable=False, index=True)
    job_role = Column(String(100), nullable=False)
    source = Column(String(50), nullable=True) # e.g. LinkedIn, Referral, Glassdoor
    applied_date = Column(Date, nullable=True)
    current_stage = Column(String(50), default="Applied", nullable=False) # e.g. Phone Screen, Onsite
    location = Column(String(100), nullable=True) # e.g. San Francisco, CA / Remote
    salary_range = Column(String(50), nullable=True) # e.g. $120k - $150k
    notes = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", back_populates="applications")
    interviews = relationship("Interview", back_populates="application", cascade="all, delete-orphan")
