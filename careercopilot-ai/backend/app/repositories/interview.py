from app.repositories.base import BaseRepository
from app.models.interview import Interview

class InterviewRepository(BaseRepository[Interview]):
    """
    InterviewRepository handling queries for Interview models.
    """
    pass

interview_repo = InterviewRepository(Interview)
