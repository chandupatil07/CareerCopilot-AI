from app.repositories.base import BaseRepository
from app.models.notification import Notification

class NotificationRepository(BaseRepository[Notification]):
    """
    NotificationRepository handling queries for Notification models.
    """
    pass

notification_repo = NotificationRepository(Notification)
