import pytest
from unittest.mock import MagicMock, patch
from datetime import date
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.services.application import ApplicationService, ALLOWED_STAGES
from app.repositories.application import application_repo
from app.models.application import Application
from app.models.application_timeline import ApplicationTimeline
from app.schemas.application import ApplicationCreate

MOCK_USER_ID = 1
MOCK_OTHER_USER_ID = 2

@pytest.fixture
def mock_db():
    return MagicMock(spec=Session)

def test_create_application_duplicate(mock_db):
    """Verify that creating duplicate application cards is blocked with HTTP 400"""
    payload = ApplicationCreate(
        company_name="Google",
        job_role="Software Engineer",
        applied_date=date(2026, 7, 1),
        current_stage="Applied"
    )
    
    with patch.object(application_repo, "check_duplicate", return_value=True):
        with pytest.raises(HTTPException) as exc_info:
            ApplicationService.create_application(mock_db, user_id=MOCK_USER_ID, obj_in=payload)
            
        assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
        assert "already been registered" in exc_info.value.detail

def test_create_application_invalid_initial_stage(mock_db):
    """Verify that initial stages outside ALLOWED_STAGES are blocked"""
    payload = ApplicationCreate(
        company_name="Google",
        job_role="Software Engineer",
        applied_date=date(2026, 7, 1),
        current_stage="InvalidStage"
    )
    
    with patch.object(application_repo, "check_duplicate", return_value=False):
        with pytest.raises(HTTPException) as exc_info:
            ApplicationService.create_application(mock_db, user_id=MOCK_USER_ID, obj_in=payload)
            
        assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
        assert "Invalid initial stage" in exc_info.value.detail

@patch("app.services.application.Application")
@patch.object(application_repo, "check_duplicate", return_value=False)
@patch.object(application_repo, "add_timeline_entry")
def test_create_application_success(mock_timeline, mock_dup, mock_app, mock_db):
    """Verify successful application registration and initial timeline log entry mapping"""
    payload = ApplicationCreate(
        company_name="Google",
        job_role="Software Engineer",
        applied_date=date(2026, 7, 1),
        current_stage="Applied"
    )
    
    # Run creation
    db_app = ApplicationService.create_application(mock_db, user_id=MOCK_USER_ID, obj_in=payload)
    
    # Assertions
    mock_dup.assert_called_once()
    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()
    mock_timeline.assert_called_once_with(
        mock_db,
        application_id=db_app.id,
        from_stage="None",
        to_stage="Applied",
        notes="Initial application logged."
    )

def test_status_transition_invalid_jumps(mock_db):
    """Verify that jumping stages outside state machine transition rules is blocked with HTTP 400"""
    mock_app = MagicMock(spec=Application)
    mock_app.user_id = MOCK_USER_ID
    mock_app.current_stage = "Interested" # Source stage
    
    with patch.object(application_repo, "get", return_value=mock_app):
        with pytest.raises(HTTPException) as exc_info:
            # Try jumping from Interested directly to Offer Accepted (blocked by rules)
            ApplicationService.update_application_status(
                mock_db,
                application_id=10,
                user_id=MOCK_USER_ID,
                new_stage="Accepted"
            )
            
        assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
        assert "Workflow transition blocked" in exc_info.value.detail

def test_status_transition_unauthorized(mock_db):
    """Verify that a user cannot transition stages on another user's application card (IDOR guard)"""
    mock_app = MagicMock(spec=Application)
    mock_app.user_id = MOCK_OTHER_USER_ID # Belongs to user 2
    mock_app.current_stage = "Applied"
    
    with patch.object(application_repo, "get", return_value=mock_app):
        with pytest.raises(HTTPException) as exc_info:
            # Authenticated as user 1
            ApplicationService.update_application_status(
                mock_db,
                application_id=10,
                user_id=MOCK_USER_ID,
                new_stage="Technical Interview"
            )
            
        assert exc_info.value.status_code == status.HTTP_403_FORBIDDEN
        assert "do not possess permissions" in exc_info.value.detail

@patch.object(application_repo, "add_timeline_entry")
def test_status_transition_success(mock_timeline, mock_db):
    """Verify that a valid status jump applies status shifts and appends logs to timeline history"""
    mock_app = MagicMock(spec=Application)
    mock_app.id = 10
    mock_app.user_id = MOCK_USER_ID
    mock_app.current_stage = "Offer" # Source stage
    
    with patch.object(application_repo, "get", return_value=mock_app):
        # Run transition
        result = ApplicationService.update_application_status(
            mock_db,
            application_id=10,
            user_id=MOCK_USER_ID,
            new_stage="Accepted",
            notes="Signed the offer letter!"
        )
        
        # Assertions
        assert result.current_stage == "Accepted"
        mock_db.commit.assert_called_once()
        mock_timeline.assert_called_once_with(
            mock_db,
            application_id=10,
            from_stage="Offer",
            to_stage="Accepted",
            notes="Signed the offer letter!"
        )

def test_calculate_statistics():
    """Verify dashboard metrics mathematics and monthly trend parser extractions"""
    # 1. Setup mock application logs
    app1 = MagicMock(spec=Application)
    app1.current_stage = "Technical Interview"
    app1.applied_date = date(2026, 7, 15)
    
    app2 = MagicMock(spec=Application)
    app2.current_stage = "Accepted"
    app2.applied_date = date(2026, 7, 20)
    
    app3 = MagicMock(spec=Application)
    app3.current_stage = "Rejected"
    app3.applied_date = date(2026, 6, 10)
    
    app4 = MagicMock(spec=Application)
    app4.current_stage = "Interested"
    app4.applied_date = None
    app4.created_at = MagicMock()
    app4.created_at.date.return_value = date(2026, 5, 5)

    mock_db = MagicMock(spec=Session)
    mock_db.execute.return_value.scalars.return_value.all.return_value = [app1, app2, app3, app4]
    
    # Execute stats calculator
    stats = application_repo.get_statistics(mock_db, user_id=MOCK_USER_ID)
            
    # Assertions:
    # Total apps = 4
    # Applied (stage != Interested) = 3 (app1, app2, app3)
    # Interviewing = 1 (app1)
    # Offers = 1 (app2)
    # Rejected = 1 (app3)
    # Responded = 3 (interviewing + offers + rejected)
    # Response rate = 3 / 3 = 100%
    # Acceptance rate = 1 / 1 = 100%
    assert stats["total_applications"] == 4
    assert stats["applied_count"] == 3
    assert stats["interviewing_count"] == 1
    assert stats["offers_count"] == 1
    assert stats["rejected_count"] == 1
    assert stats["response_rate"] == 100.0
    assert stats["acceptance_rate"] == 100.0
    
    # Distribution checks
    assert stats["status_distribution"]["Technical Interview"] == 1
    assert stats["status_distribution"]["Accepted"] == 1
    assert stats["status_distribution"]["Interested"] == 1
    
    # Monthly trends checking:
    # 2026-07 -> 2 (app1, app2)
    # 2026-06 -> 1 (app3)
    # 2026-05 -> 1 (app4)
    assert len(stats["monthly_trends"]) == 3
    assert stats["monthly_trends"][0] == {"month": "2026-05", "count": 1}
    assert stats["monthly_trends"][1] == {"month": "2026-06", "count": 1}
    assert stats["monthly_trends"][2] == {"month": "2026-07", "count": 2}
