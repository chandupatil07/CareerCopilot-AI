from typing import List, Any, Optional
from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.deps import get_current_user
from app.services.notification import NotificationService
from app.repositories.notification import notification_repo
from app.schemas.notification import Notification
from app.models.user import User as UserModel

router = APIRouter()

@router.get("", response_model=List[Notification], summary="List User Notifications")
def list_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    is_read: Optional[bool] = None,
    priority: Optional[str] = None,
    notification_type: Optional[str] = None,
    search: Optional[str] = None,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve all notification alerts for the candidate.
    Supports filtering by read states, priorities, categories, and searching keywords.
    """
    return notification_repo.list_notifications(
        db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        is_read=is_read,
        priority=priority,
        notification_type=notification_type,
        search=search
    )

@router.get("/unread-count", summary="Get Unread Notifications Count")
def get_unread_count(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Get the total count of unread notification alerts for the candidate."""
    count = NotificationService.get_unread_count(db, user_id=current_user.id)
    return {"unread_count": count}

@router.get("/{id}", response_model=Notification, summary="Get Notification Details")
def get_notification(
    id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Retrieve detailed information for a specific notification alert."""
    notif = notification_repo.get(db, id=id)
    if not notif:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification alert not found."
        )

    # IDOR Guard: Verify ownership
    if notif.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to requested notification record."
        )
    return notif

@router.patch("/{id}/read", response_model=Notification, summary="Mark Notification as Read")
def mark_read(
    id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Mark a single notification alert as read."""
    return NotificationService.mark_read(db, user_id=current_user.id, notification_id=id)

@router.patch("/read-all", summary="Mark All Notifications as Read")
def mark_all_read(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Mark all unread notification alerts for the candidate as read."""
    modified_count = NotificationService.mark_all_read(db, user_id=current_user.id)
    return {
        "message": "All notifications marked as read successfully.",
        "modified_count": modified_count
    }

@router.delete("/expired", summary="Clean Up Expired Notifications")
def delete_expired_notifications(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """System cleaning endpoint to delete all expired notification logs."""
    deleted_count = NotificationService.delete_expired(db)
    return {
        "message": "Expired notifications successfully cleaned up.",
        "deleted_count": deleted_count
    }

@router.delete("/{id}", summary="Delete Notification Alert")
def delete_notification(
    id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Permanently delete a specific notification alert."""
    NotificationService.delete_notification(db, user_id=current_user.id, notification_id=id)
    return {"message": "Notification alert successfully deleted."}
