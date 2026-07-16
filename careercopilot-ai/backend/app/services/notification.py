from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from fastapi import HTTPException, status
from datetime import datetime, timedelta

from app.repositories.notification import notification_repo
from app.schemas.notification import NotificationCreate
from app.models.notification import Notification

class NotificationService:
    """
    NotificationService coordinates creation, status transformations, unread count queries,
    and automatic purging of expired logs.
    """

    @classmethod
    def create_notification(
        cls,
        db: Session,
        *,
        user_id: int,
        title: str,
        message: str,
        type: str = "info",
        notification_type: str = "system",
        priority: str = "medium",
        icon: Optional[str] = None,
        ttl_days: Optional[int] = 30, # Default retention of 30 days
        metadata_json: Optional[Dict[str, Any]] = None,
        action_url: Optional[str] = None
    ) -> Notification:
        """Create a single notification record, scheduling an optional expiration window"""
        expires_at = None
        if ttl_days is not None:
            expires_at = datetime.utcnow() + timedelta(days=ttl_days)

        payload = NotificationCreate(
            user_id=user_id,
            title=title,
            message=message,
            type=type,
            notification_type=notification_type,
            priority=priority,
            icon=icon,
            expires_at=expires_at,
            metadata_json=metadata_json,
            action_url=action_url
        )
        # Using the BaseRepository generic create method we implemented
        return notification_repo.create(db, obj_in=payload)

    @classmethod
    def create_bulk_notifications(
        cls,
        db: Session,
        *,
        user_ids: List[int],
        title: str,
        message: str,
        type: str = "info",
        notification_type: str = "system",
        priority: str = "medium",
        icon: Optional[str] = None,
        ttl_days: Optional[int] = 30,
        metadata_json: Optional[Dict[str, Any]] = None,
        action_url: Optional[str] = None
    ) -> List[Notification]:
        """Create identical notification records across a batch of target user accounts"""
        notifications = []
        for uid in user_ids:
            notif = cls.create_notification(
                db,
                user_id=uid,
                title=title,
                message=message,
                type=type,
                notification_type=notification_type,
                priority=priority,
                icon=icon,
                ttl_days=ttl_days,
                metadata_json=metadata_json,
                action_url=action_url
            )
            notifications.append(notif)
        return notifications

    @classmethod
    def mark_read(cls, db: Session, *, user_id: int, notification_id: int) -> Notification:
        """Mark a single notification as read, validating candidate IDOR ownership gates"""
        notif = notification_repo.get(db, id=notification_id)
        if not notif:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification alert not found."
            )

        # IDOR Guard: Verify ownership
        if notif.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to requested notification resource."
            )

        return notification_repo.update(db, db_obj=notif, obj_in={"is_read": True})

    @classmethod
    def mark_all_read(cls, db: Session, *, user_id: int) -> int:
        """Mark all unread alerts of a candidate as read"""
        return notification_repo.mark_all_as_read(db, user_id=user_id)

    @classmethod
    def get_unread_count(cls, db: Session, *, user_id: int) -> int:
        """Get the count of unread notifications for a candidate"""
        query = (
            select(func.count())
            .select_from(Notification)
            .where(Notification.user_id == user_id, Notification.is_read == False)
        )
        return db.execute(query).scalar() or 0

    @classmethod
    def delete_expired(cls, db: Session) -> int:
        """Purge expired alerts from database storage"""
        return notification_repo.delete_expired_notifications(db)

    @classmethod
    def delete_notification(cls, db: Session, *, user_id: int, notification_id: int) -> None:
        """Purge a specific notification alert, validating candidate IDOR ownership gates"""
        notif = notification_repo.get(db, id=notification_id)
        if not notif:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification alert not found."
            )

        # IDOR Guard: Verify ownership
        if notif.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to delete requested notification."
            )

        notification_repo.remove(db, id=notification_id)
