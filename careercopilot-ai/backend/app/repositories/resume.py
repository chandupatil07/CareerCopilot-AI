from app.repositories.base import BaseRepository
from app.models.resume import Resume

class ResumeRepository(BaseRepository[Resume]):
    """
    ResumeRepository handling queries for Resume models.
    """
    pass

resume_repo = ResumeRepository(Resume)
