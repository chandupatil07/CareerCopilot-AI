import pytest
from unittest.mock import MagicMock, patch
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.services.notification import NotificationService
from app.repositories.notification import notification_repo
from app.models.notification import Notification
from app.models.application import Application
from app.models.interview import Interview
from app.services.interview import InterviewService
from app.services.application import ApplicationService
from app.services.resume import ResumeService

MOCK_USER_ID = 1
MOCK_OTHER_USER_ID = 2

@pytest.fixture
def mock_db():
    return MagicMock(spec=Session)

@patch("app.services.notification.notification_repo.create")
def test_create_notification_success(mock_repo_create, mock_db):
    """Verify that a notification is successfully created with default expiration and retention properties"""
    mock_repo_create.return_value = MagicMock(spec=Notification, id=101, user_id=MOCK_USER_ID)
    
    notif = NotificationService.create_notification(
        mock_db,
        user_id=MOCK_USER_ID,
        title="Welcome Candidate",
        message="Thank you for joining CareerCopilot AI.",
        type="success",
        notification_type="welcome",
        priority="high"
    )
    
    assert notif.id == 101
    mock_repo_create.assert_called_once()

@patch("app.services.notification.notification_repo.create")
def test_create_bulk_notifications(mock_repo_create, mock_db):
    """Verify bulk notification distribution handles loops correctly"""
    mock_repo_create.return_value = MagicMock(spec=Notification)
    
    users_list = [10, 20, 30]
    notifs = NotificationService.create_bulk_notifications(
        mock_db,
        user_ids=users_list,
        title="System Maintenance",
        message="Server maintenance in 2 hours.",
        type="warning"
    )
    
    assert len(notifs) == 3
    assert mock_repo_create.call_count == 3

@patch.object(notification_repo, "get")
@patch.object(notification_repo, "update")
def test_mark_read_success(mock_repo_update, mock_repo_get, mock_db):
    """Verify marking notification as read resolves correctly after ownership checks"""
    mock_notif = MagicMock(spec=Notification, id=101, user_id=MOCK_USER_ID, is_read=False)
    mock_repo_get.return_value = mock_notif
    
    NotificationService.mark_read(mock_db, user_id=MOCK_USER_ID, notification_id=101)
    mock_repo_update.assert_called_once_with(mock_db, db_obj=mock_notif, obj_in={"is_read": True})

@patch.object(notification_repo, "get")
def test_mark_read_unauthorized_idor(mock_repo_get, mock_db):
    """Verify that user cannot mark another candidate's notification as read (IDOR guard)"""
    mock_notif = MagicMock(spec=Notification, id=101, user_id=MOCK_OTHER_USER_ID, is_read=False)
    mock_repo_get.return_value = mock_notif
    
    with pytest.raises(HTTPException) as exc_info:
        NotificationService.mark_read(mock_db, user_id=MOCK_USER_ID, notification_id=101)
        
    assert exc_info.value.status_code == status.HTTP_403_FORBIDDEN
    assert "access denied" in exc_info.value.detail.lower()

@patch.object(notification_repo, "mark_all_as_read", return_value=5)
def test_mark_all_read_success(mock_mark_all, mock_db):
    """Verify that mark all read routes transactions correctly"""
    count = NotificationService.mark_all_read(mock_db, user_id=MOCK_USER_ID)
    assert count == 5
    mock_mark_all.assert_called_once_with(mock_db, user_id=MOCK_USER_ID)

@patch.object(notification_repo, "delete_expired_notifications", return_value=12)
def test_delete_expired_notifications_success(mock_delete, mock_db):
    """Verify expired logs cleanups execute correctly"""
    count = NotificationService.delete_expired(mock_db)
    assert count == 12
    mock_delete.assert_called_once_with(mock_db)

def test_get_unread_count_success(mock_db):
    """Verify that unread notifications query counts calculations are accurate"""
    mock_db.execute.return_value.scalar.return_value = 7
    count = NotificationService.get_unread_count(mock_db, user_id=MOCK_USER_ID)
    assert count == 7


@patch("app.services.interview.NotificationService.create_notification")
@patch("app.services.interview.Interview")
@patch("app.repositories.application.application_repo.get")
@patch("app.services.application.ApplicationService.update_application_status")
def test_event_trigger_interview_scheduled(mock_status_update, mock_get_app, mock_interview, mock_notif, mock_db):
    """Verify that scheduling an interview triggers Interview Scheduled notifications automatically"""
    mock_app = MagicMock(spec=Application, id=15, user_id=MOCK_USER_ID, current_stage="Applied")
    mock_get_app.return_value = mock_app
    
    mock_interview_obj = MagicMock(spec=Interview, id=8, application_id=15, interview_date="2026-07-15", interview_time="14:30")
    mock_interview.return_value = mock_interview_obj
    
    payload = MagicMock(application_id=15, interview_date="2026-07-15", interview_time="14:30", mode="Google Meet", meeting_link=None, interviewer_name=None, reminder_sent=False)
    
    # Run interview scheduler
    InterviewService.create_interview(mock_db, user_id=MOCK_USER_ID, obj_in=payload)
    
    # Assert alert was triggered
    mock_notif.assert_called_once()
    assert mock_notif.call_args[1]["notification_type"] == "interview_scheduled"
