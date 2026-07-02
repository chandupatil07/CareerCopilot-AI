from app.repositories.base import BaseRepository
from app.models.chat import AIChat

class AIChatRepository(BaseRepository[AIChat]):
    """
    AIChatRepository handling queries for AIChat logs.
    """
    pass

ai_chat_repo = AIChatRepository(AIChat)
