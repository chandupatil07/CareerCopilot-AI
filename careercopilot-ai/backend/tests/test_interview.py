import pytest
from unittest.mock import MagicMock, patch
from datetime import date
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.services.interview import InterviewService
from app.repositories.interview import interview_repo
from app.repositories.application import application_repo
from app.models.interview import Interview
from app.models.application import Application
from app.schemas.interview import InterviewCreate, InterviewUpdate

MOCK_USER_ID = 1
MOCK_OTHER_USER_ID = 2

@pytest.fixture
def mock_db():
    return MagicMock(spec=Session)

@patch("app.services.interview.Interview")
@patch.object(application_repo, "get")
@patch.object(interview_repo, "update")
def test_create_interview_success_stage_transition(mock_update, mock_get_app, mock_interview, mock_db):
    """Verify successful interview creation and automatic application stage transition from Interested to Technical Interview"""
    # 1. Setup mock application details
    mock_app = MagicMock(spec=Application)
    mock_app.id = 15
    mock_app.user_id = MOCK_USER_ID
    mock_app.current_stage = "Interested"
    mock_get_app.return_value = mock_app

    # 2. Configure mock save behaviour
    mock_interview.return_value = MagicMock(spec=Interview, id=8, application_id=15)

    payload = InterviewCreate(
        application_id=15,
        interview_date=date(2026, 7, 15),
        interview_time="14:30",
        mode="Google Meet",
        meeting_link="https://meet.google.com/abc-xyz",
        interviewer_name="Sarah Connor"
    )

    with patch("app.services.application.ApplicationService.update_application_status") as mock_status_update:
        # Run service method
        db_obj = InterviewService.create_interview(mock_db, user_id=MOCK_USER_ID, obj_in=payload)
        
        # Verify db insert
        mock_db.add.assert_called_once()
        mock_db.commit.assert_called_once()
        
        # Assert automatic transitions were triggered:
        # 1. Transition to Applied
        # 2. Transition to Technical Interview
        assert mock_status_update.call_count == 2
        mock_status_update.assert_any_call(
            mock_db, application_id=15, user_id=MOCK_USER_ID, new_stage="Applied", notes="Automatically moved stage to Applied as part of scheduling an interview."
        )
        mock_status_update.assert_any_call(
            mock_db, application_id=15, user_id=MOCK_USER_ID, new_stage="Technical Interview", notes="Automatically moved stage to Technical Interview because an interview slot was scheduled."
        )

@patch.object(application_repo, "get", return_value=None)
def test_create_interview_application_not_found(mock_get_app, mock_db):
    """Verify that scheduling an interview with a non-existent application ID fails with 404"""
    payload = InterviewCreate(
        application_id=999,
        interview_date=date(2026, 7, 15)
    )
    with pytest.raises(HTTPException) as exc_info:
        InterviewService.create_interview(mock_db, user_id=MOCK_USER_ID, obj_in=payload)
        
    assert exc_info.value.status_code == status.HTTP_404_NOT_FOUND
    assert "application not found" in exc_info.value.detail.lower()

@patch.object(application_repo, "get")
def test_create_interview_unauthorized_idor(mock_get_app, mock_db):
    """Verify that a user cannot schedule an interview for another user's job application card (IDOR guard)"""
    mock_app = MagicMock(spec=Application)
    mock_app.id = 15
    mock_app.user_id = MOCK_OTHER_USER_ID # belongs to another user
    mock_get_app.return_value = mock_app

    payload = InterviewCreate(
        application_id=15,
        interview_date=date(2026, 7, 15)
    )

    with pytest.raises(HTTPException) as exc_info:
        # Authenticated user is MOCK_USER_ID
        InterviewService.create_interview(mock_db, user_id=MOCK_USER_ID, obj_in=payload)
        
    assert exc_info.value.status_code == status.HTTP_403_FORBIDDEN
    assert "access denied" in exc_info.value.detail.lower()

@patch.object(interview_repo, "get")
@patch.object(application_repo, "get")
def test_get_interview_unauthorized_idor(mock_get_app, mock_get_interview, mock_db):
    """Verify that a user cannot access interview details belonging to another user (IDOR guard)"""
    mock_interview = MagicMock(spec=Interview)
    mock_interview.id = 8
    mock_interview.application_id = 15
    mock_get_interview.return_value = mock_interview

    mock_app = MagicMock(spec=Application)
    mock_app.user_id = MOCK_OTHER_USER_ID # belongs to other user
    mock_get_app.return_value = mock_app

    with pytest.raises(HTTPException) as exc_info:
        InterviewService.get_interview(mock_db, user_id=MOCK_USER_ID, interview_id=8)
        
    assert exc_info.value.status_code == status.HTTP_403_FORBIDDEN
    assert "access denied" in exc_info.value.detail.lower()

@patch.object(interview_repo, "get")
@patch.object(application_repo, "get")
@patch.object(interview_repo, "update")
def test_update_interview_success(mock_update, mock_get_app, mock_get_interview, mock_db):
    """Verify successful interview details updates when ownership passes validation"""
    mock_interview = MagicMock(spec=Interview)
    mock_interview.id = 8
    mock_interview.application_id = 15
    mock_get_interview.return_value = mock_interview

    mock_app = MagicMock(spec=Application)
    mock_app.user_id = MOCK_USER_ID
    mock_get_app.return_value = mock_app

    payload = InterviewUpdate(
        notes="Prepare algorithms questions.",
        mode="Zoom"
    )

    InterviewService.update_interview(mock_db, user_id=MOCK_USER_ID, interview_id=8, obj_in=payload)
    mock_update.assert_called_once_with(mock_db, db_obj=mock_interview, obj_in=payload)

@patch.object(interview_repo, "get")
@patch.object(application_repo, "get")
@patch.object(interview_repo, "remove")
def test_delete_interview_success(mock_remove, mock_get_app, mock_get_interview, mock_db):
    """Verify successful interview cancellation and purging from DB"""
    mock_interview = MagicMock(spec=Interview)
    mock_interview.id = 8
    mock_interview.application_id = 15
    mock_get_interview.return_value = mock_interview

    mock_app = MagicMock(spec=Application)
    mock_app.user_id = MOCK_USER_ID
    mock_get_app.return_value = mock_app

    InterviewService.delete_interview(mock_db, user_id=MOCK_USER_ID, interview_id=8)
    mock_remove.assert_called_once_with(mock_db, id=8)
