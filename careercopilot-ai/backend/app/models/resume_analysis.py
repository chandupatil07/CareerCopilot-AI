from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.base_class import Base

class ResumeAnalysis(Base):
    """
    ResumeAnalysis model storing rule-based text extraction details,
    contact coordinates, section lists, and transparent ATS scores.
    """
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resume.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    parsed_text = Column(Text, nullable=True)
    contact_info = Column(JSON, nullable=True)     # Schema: {"email": str, "phone": str, "urls": [str]}
    education = Column(JSON, nullable=True)        # Schema: [str]
    experience = Column(JSON, nullable=True)       # Schema: [str]
    skills = Column(JSON, nullable=True)           # Schema: [str]
    projects = Column(JSON, nullable=True)         # Schema: [str]
    certificates = Column(JSON, nullable=True)     # Schema: [str]
    languages = Column(JSON, nullable=True)        # Schema: [str]
    ats_score = Column(Integer, default=0, nullable=False)
    score_breakdown = Column(JSON, nullable=True)   # Schema: {"formatting_score": int, "keyword_score": int, "missing_sections": [str], "suggestions": [str]}
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    resume = relationship("Resume", back_populates="analysis")
