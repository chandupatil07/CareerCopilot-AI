from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.repositories.base import BaseRepository
from app.models.interview import Interview
from app.models.application import Application

class InterviewRepository(BaseRepository[Interview]):
    """
    InterviewRepository handling queries for Interview models,
    including joining applications to enforce strict user ownership.
    """
    def list_by_user(self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100) -> List[Interview]:
        """Fetch all interviews scheduled across a user's applications, sorted by date upcoming first"""
        query = (
            select(self.model)
            .join(Application, self.model.application_id == Application.id)
            .where(Application.user_id == user_id)
            .order_by(self.model.interview_date.asc(), self.model.interview_time.asc().nullslast())
            .offset(skip)
            .limit(limit)
        )
        return list(db.execute(query).scalars().all())

interview_repo = InterviewRepository(Interview)
