from app.repositories.base import BaseRepository
from app.models.outreach import ColdEmailHistory, LinkedInHistory

class ColdEmailHistoryRepository(BaseRepository[ColdEmailHistory]):
    """
    ColdEmailHistoryRepository handling query templates logs.
    """
    pass

class LinkedInHistoryRepository(BaseRepository[LinkedInHistory]):
    """
    LinkedInHistoryRepository handling query template logs.
    """
    pass

cold_email_repo = ColdEmailHistoryRepository(ColdEmailHistory)
linkedin_repo = LinkedInHistoryRepository(LinkedInHistory)
