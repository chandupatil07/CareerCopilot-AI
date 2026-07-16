from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, update, and_, or_, delete
from datetime import datetime

from app.repositories.base import BaseRepository
from app.models.notification import Notification

class NotificationRepository(BaseRepository[Notification]):
    """
    NotificationRepository managing database query transactions for user notifications,
    including listings filters, marking all read states, and cleaning expired records.
    """
    def list_notifications(
        self,
        db: Session,
        *,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        is_read: Optional[bool] = None,
        priority: Optional[str] = None,
        notification_type: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Notification]:
        """Fetch filtered and paginated list of notifications for a user, sorted newest first"""
        query = select(self.model).where(self.model.user_id == user_id)

        # Filters
        if is_read is not None:
            query = query.where(self.model.is_read == is_read)
        if priority:
            query = query.where(self.model.priority == priority)
        if notification_type:
            query = query.where(self.model.notification_type == notification_type)

        if search:
            search_filter = or_(
                self.model.title.ilike(f"%{search}%"),
                self.model.message.ilike(f"%{search}%")
            )
            query = query.where(search_filter)

        # Sort: Newest first
        query = query.order_by(self.model.created_at.desc()).offset(skip).limit(limit)
        return list(db.execute(query).scalars().all())

    def mark_all_as_read(self, db: Session, *, user_id: int) -> int:
        """Mark all unread notifications for a user as read, returning the count of modified records"""
        stmt = (
            update(self.model)
            .where(and_(self.model.user_id == user_id, self.model.is_read == False))
            .values(is_read=True)
        )
        result = db.execute(stmt)
        db.commit()
        return result.rowcount

    def delete_expired_notifications(self, db: Session) -> int:
        """Purge notifications whose expiration date is past, returning the count of deleted records"""
        now = datetime.utcnow()
        stmt = delete(self.model).where(
            and_(self.model.expires_at.is_not(None), self.model.expires_at < now)
        )
        result = db.execute(stmt)
        db.commit()
        return result.rowcount

notification_repo = NotificationRepository(Notification)
