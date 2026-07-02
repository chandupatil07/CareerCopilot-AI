import os
import io
import pytest
from unittest.mock import MagicMock, patch
from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.services.resume import ResumeService
from app.repositories.resume import resume_repo
from app.models.resume import Resume
from app.models.user import User

# Sample mock variables
MOCK_USER_ID = 1
MOCK_OTHER_USER_ID = 2

@pytest.fixture
def mock_db():
    return MagicMock(spec=Session)

@pytest.fixture
def mock_user():
    user = MagicMock(spec=User)
    user.id = MOCK_USER_ID
    user.email = "jane@demo.com"
    return user

def test_validate_resume_file_success():
    """Verify that a valid PDF file under 10MB passes validation checks"""
    file = MagicMock(spec=UploadFile)
    file.filename = "my_cv.pdf"
    file.content_type = "application/pdf"
    # Create file stream mock representing 2MB content size
    file.file = io.BytesIO(b"dummy PDF content payload")
    
    # Run validation check (should not raise any exception)
    ResumeService.validate_resume_file(file)

def test_validate_resume_file_invalid_extension():
    """Verify that file formats other than PDF are rejected"""
    file = MagicMock(spec=UploadFile)
    file.filename = "my_cv.docx"
    file.content_type = "application/pdf"
    
    with pytest.raises(HTTPException) as exc_info:
        ResumeService.validate_resume_file(file)
    assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
    assert "Invalid file extension" in exc_info.value.detail

def test_validate_resume_file_invalid_mime():
    """Verify that files with PDF extension but non-PDF MIME type are rejected"""
    file = MagicMock(spec=UploadFile)
    file.filename = "my_cv.pdf"
    file.content_type = "image/png"
    file.file = io.BytesIO(b"dummy image data")
    
    with pytest.raises(HTTPException) as exc_info:
        ResumeService.validate_resume_file(file)
    assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
    assert "Invalid MIME type" in exc_info.value.detail

def test_validate_resume_file_oversized():
    """Verify that PDF files exceeding 10MB are rejected"""
    file = MagicMock(spec=UploadFile)
    file.filename = "my_cv.pdf"
    file.content_type = "application/pdf"
    
    # Mock size tell to simulate 11MB file size
    file.file = MagicMock()
    file.file.tell.return_value = 11 * 1024 * 1024
    
    with pytest.raises(HTTPException) as exc_info:
        ResumeService.validate_resume_file(file)
    assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
    assert "exceeds 10MB limit" in exc_info.value.detail

@patch("app.services.resume.os.makedirs")
@patch("app.services.resume.open")
@patch("app.services.resume.shutil.copyfileobj")
@patch("app.services.resume.resume_repo")
def test_save_resume_success(mock_repo, mock_copy, mock_open, mock_makedirs, mock_db):
    """Verify successful upload, file write, version increment, and metadata saving"""
    # 1. Setup mocks
    file = MagicMock(spec=UploadFile)
    file.filename = "jane_cv.pdf"
    file.content_type = "application/pdf"
    file.file = io.BytesIO(b"dummy pdf")
    
    mock_repo.get_max_version.return_value = 2
    
    mock_new_resume = MagicMock(spec=Resume)
    mock_new_resume.id = 10
    mock_new_resume.version = 3
    mock_new_resume.is_active = True
    mock_repo.create_resume.return_value = mock_new_resume

    # 2. Run service call
    result = ResumeService.save_resume(mock_db, user_id=MOCK_USER_ID, file=file)

    # 3. Assertions
    mock_makedirs.assert_called_once()
    mock_repo.deactivate_all_resumes.assert_called_once_with(mock_db, user_id=MOCK_USER_ID)
    mock_repo.create_resume.assert_called_once()
    assert result.version == 3
    assert result.is_active is True

@patch("app.services.resume.resume_repo")
def test_delete_resume_unauthorized(mock_repo, mock_db):
    """Verify that a user is forbidden from deleting another user's resume (IDOR protection)"""
    mock_resume = MagicMock(spec=Resume)
    mock_resume.user_id = MOCK_OTHER_USER_ID  # Belongs to user 2
    mock_repo.get.return_value = mock_resume
    
    with pytest.raises(HTTPException) as exc_info:
        # Authenticated as user 1
        ResumeService.delete_resume(mock_db, resume_id=10, user_id=MOCK_USER_ID)
        
    assert exc_info.value.status_code == status.HTTP_403_FORBIDDEN
    assert "do not possess permissions" in exc_info.value.detail
    mock_repo.delete_resume.assert_not_called()

@patch("app.services.resume.resume_repo")
@patch("app.services.resume.os.path.exists")
@patch("app.services.resume.os.remove")
def test_delete_resume_success(mock_remove, mock_exists, mock_repo, mock_db):
    """Verify successful deletion of DB metadata record and local disk file cleanup"""
    mock_resume = MagicMock(spec=Resume)
    mock_resume.user_id = MOCK_USER_ID
    mock_resume.storage_path = "/storage/resume_v1.pdf"
    mock_repo.get.return_value = mock_resume
    mock_exists.return_value = True

    # Run delete service
    ResumeService.delete_resume(mock_db, resume_id=10, user_id=MOCK_USER_ID)

    # Assertions
    mock_repo.delete_resume.assert_called_once_with(mock_db, resume_id=10)
    mock_exists.assert_called_once_with("/storage/resume_v1.pdf")
    mock_remove.assert_called_once_with("/storage/resume_v1.pdf")
