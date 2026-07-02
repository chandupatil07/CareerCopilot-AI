from app.repositories.base import BaseRepository
from app.models.user import User

class UserRepository(BaseRepository[User]):
    """
    UserRepository handling query transactions for User models.
    Extends generic BaseRepository; no custom CRUD logic is implemented yet.
    """
    pass

user_repo = UserRepository(User)
