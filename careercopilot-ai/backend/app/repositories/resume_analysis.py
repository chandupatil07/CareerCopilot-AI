from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.repositories.base import BaseRepository
from app.models.resume_analysis import ResumeAnalysis

class ResumeAnalysisRepository(BaseRepository[ResumeAnalysis]):
    """
    ResumeAnalysisRepository managing database transactions for parsed resume reports.
    """
    def get_by_resume_id(self, db: Session, resume_id: int) -> Optional[ResumeAnalysis]:
        """Fetch analysis records mapped to a specific resume ID"""
        query = select(self.model).where(self.model.resume_id == resume_id)
        return db.execute(query).scalar_one_or_none()

    def save_analysis(
        self, db: Session, *, resume_id: int, parsed_data: dict, score_data: dict
    ) -> ResumeAnalysis:
        """Insert or update parser outputs and score cards mapping a specific resume"""
        existing = self.get_by_resume_id(db, resume_id=resume_id)
        
        # Merge dictionaries
        payload = {
            "resume_id": resume_id,
            "parsed_text": parsed_data.get("parsed_text"),
            "contact_info": parsed_data.get("contact_info"),
            "education": parsed_data.get("education"),
            "experience": parsed_data.get("experience"),
            "skills": parsed_data.get("skills"),
            "projects": parsed_data.get("projects"),
            "certificates": parsed_data.get("certificates"),
            "languages": parsed_data.get("languages"),
            "ats_score": score_data.get("ats_score", 0),
            "score_breakdown": score_data.get("score_breakdown")
        }

        if existing:
            # Update attributes
            for key, val in payload.items():
                setattr(existing, key, val)
            db.add(existing)
            db.commit()
            db.refresh(existing)
            return existing
        
        # Create new record
        db_obj = ResumeAnalysis(**payload)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

analysis_repo = ResumeAnalysisRepository(ResumeAnalysis)
