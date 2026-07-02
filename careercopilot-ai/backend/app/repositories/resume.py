from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, update, func
from app.repositories.base import BaseRepository
from app.models.resume import Resume

class ResumeRepository(BaseRepository[Resume]):
    """
    ResumeRepository managing database query transactions for the Resume table.
    """
    def list_by_user(self, db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Resume]:
        """Fetch list of uploaded resumes for a user ordered by version history descending"""
        query = select(self.model).where(self.model.user_id == user_id).offset(skip).limit(limit).order_by(self.model.version.desc())
        return list(db.execute(query).scalars().all())

    def get_active_resume(self, db: Session, user_id: int) -> Optional[Resume]:
        """Fetch the active resume parsing context for a user"""
        query = select(self.model).where(self.model.user_id == user_id, self.model.is_active == True)
        return db.execute(query).scalar_one_or_none()

    def get_max_version(self, db: Session, user_id: int) -> int:
        """Fetch the maximum uploaded version number for a user to calculate next version increment"""
        query = select(func.max(self.model.version)).where(self.model.user_id == user_id)
        max_val = db.execute(query).scalar()
        return max_val if max_val is not None else 0

    def deactivate_all_resumes(self, db: Session, user_id: int) -> None:
        """Set all resumes of a specific user to inactive status"""
        stmt = update(self.model).where(self.model.user_id == user_id).values(is_active=False)
        db.execute(stmt)
        db.commit()

    def set_active_resume(self, db: Session, user_id: int, resume_id: int) -> Optional[Resume]:
        """Deactivate all resumes and set a specific target resume as active"""
        self.deactivate_all_resumes(db, user_id=user_id)
        
        resume = self.get(db, id=resume_id)
        if resume:
            resume.is_active = True
            db.add(resume)
            db.commit()
            db.refresh(resume)
        return resume

    def create_resume(
        self, db: Session, *, user_id: int, filename: str, storage_path: str, version: int, is_active: bool
    ) -> Resume:
        """Insert a new resume record into the database metadata logs"""
        db_obj = Resume(
            user_id=user_id,
            filename=filename,
            storage_path=storage_path,
            version=version,
            is_active=is_active
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete_resume(self, db: Session, resume_id: int) -> bool:
        """Remove a resume record from the database metadata logs"""
        resume = self.get(db, id=resume_id)
        if not resume:
            return False
        db.delete(resume)
        db.commit()
        return True

resume_repo = ResumeRepository(Resume)
