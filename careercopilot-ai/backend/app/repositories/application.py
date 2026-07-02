from app.repositories.base import BaseRepository
from app.models.application import Application

class ApplicationRepository(BaseRepository[Application]):
    """
    ApplicationRepository handling queries for Application models.
    """
    pass

application_repo = ApplicationRepository(Application)
