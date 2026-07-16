from typing import List, Any
from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.deps import get_current_user
from app.services.interview import InterviewService
from app.repositories.interview import interview_repo
from app.schemas.interview import (
    Interview,
    InterviewCreate,
    InterviewUpdate
)
from app.models.user import User as UserModel

router = APIRouter()

@router.post("", response_model=Interview, status_code=status.HTTP_201_CREATED, summary="Schedule Interview Slot")
def create_interview(
    payload: InterviewCreate,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Schedule a new interview slot associated with a job application."""
    return InterviewService.create_interview(db, user_id=current_user.id, obj_in=payload)

@router.get("", response_model=List[Interview], summary="List Scheduled Interviews")
def list_interviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Retrieve all scheduled interviews across all applications, sorted by upcoming dates."""
    return interview_repo.list_by_user(db, user_id=current_user.id, skip=skip, limit=limit)

@router.get("/{id}", response_model=Interview, summary="Get Interview Details")
def get_interview(
    id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Retrieve detailed schedule information for a specific interview slot."""
    return InterviewService.get_interview(db, user_id=current_user.id, interview_id=id)

@router.put("/{id}", response_model=Interview, summary="Update Interview Details")
def update_interview(
    id: int,
    payload: InterviewUpdate,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Edit scheduling, mode, meeting links, or notes for an interview slot."""
    return InterviewService.update_interview(db, user_id=current_user.id, interview_id=id, obj_in=payload)

@router.delete("/{id}", status_code=status.HTTP_200_OK, summary="Delete Scheduled Interview")
def delete_interview(
    id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Delete a scheduled interview slot."""
    InterviewService.delete_interview(db, user_id=current_user.id, interview_id=id)
    return {"message": "Scheduled interview slot successfully deleted."}
