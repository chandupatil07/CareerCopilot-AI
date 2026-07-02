from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ResumeAnalysisBase(BaseModel):
    parsed_text: Optional[str] = None
    contact_info: Optional[Dict[str, Any]] = None
    education: Optional[List[str]] = None
    experience: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    projects: Optional[List[str]] = None
    certificates: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    ats_score: Optional[int] = 0
    score_breakdown: Optional[Dict[str, Any]] = None

class ResumeAnalysisCreate(ResumeAnalysisBase):
    resume_id: int

class ResumeAnalysis(ResumeAnalysisBase):
    id: int
    resume_id: int
    created_at: datetime

    class Config:
        from_attributes = True
