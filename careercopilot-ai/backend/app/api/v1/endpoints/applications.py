from typing import List, Any, Optional
from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.session import get_db
from app.api.deps import get_current_user
from app.services.application import ApplicationService
from app.repositories.application import application_repo
from app.schemas.application import (
    Application,
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationStatistics
)
from app.models.user import User as UserModel

router = APIRouter()

# Schema Helper for Status update body
class StatusUpdatePayload(BaseModel):
    status: str
    notes: Optional[str] = None

@router.post("", response_model=Application, status_code=status.HTTP_201_CREATED, summary="Create Application")
def create_application(
    payload: ApplicationCreate,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Create a new job application tracker card details."""
    return ApplicationService.create_application(db, user_id=current_user.id, obj_in=payload)

@router.get("/statistics", response_model=ApplicationStatistics, summary="Get Applications Statistics")
def get_statistics(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Retrieve compiled metrics cards coordinates and monthly timelines counts."""
    return application_repo.get_statistics(db, user_id=current_user.id)

@router.get("", response_model=List[Application], summary="List / Search / Filter Applications")
def list_applications(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    location: Optional[str] = None,
    priority: Optional[str] = None,
    favorite: Optional[bool] = None,
    archived: Optional[bool] = False,
    sort_by: Optional[str] = "newest",
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Search, filter, paginate, and sort user application cards logs.
    Supports querying by status, location, priorities, favorite flags, and free-text company/roles.
    """
    return application_repo.list_applications(
        db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        search=search,
        status=status,
        location=location,
        priority=priority,
        favorite=favorite,
        archived=archived,
        sort_by=sort_by
    )

@router.get("/{id}", response_model=Application, summary="Get Application Details")
def get_application(
    id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Retrieve full details of a specific job application card."""
    app = application_repo.get(db, id=id)
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job application card not found."
        )
    
    # IDOR Guard: Verify ownership
    if app.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to requested application record."
        )
    return app

@router.put("/{id}", response_model=Application, summary="Update Application Details")
def update_application(
    id: int,
    payload: ApplicationUpdate,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Modify details of an application record."""
    app = application_repo.get(db, id=id)
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job application card not found."
        )
        
    # IDOR Guard: Verify ownership
    if app.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to modify requested application."
        )
        
    # Apply modifications
    update_data = payload.model_dump(exclude_unset=True)
    
    # Check if stage is changing to apply workflow validations and timeline logging
    if "current_stage" in update_data and update_data["current_stage"] != app.current_stage:
        ApplicationService.update_application_status(
            db,
            application_id=id,
            user_id=current_user.id,
            new_stage=update_data["current_stage"],
            notes="Stage updated during bulk edit."
        )
        # Exclude from dictionary updates to prevent double writes
        del update_data["current_stage"]

    return application_repo.update(db, db_obj=app, obj_in=update_data)

@router.patch("/{id}/status", response_model=Application, summary="Transition Application Status")
def update_status(
    id: int,
    payload: StatusUpdatePayload,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Transition application status and log details into timeline logs."""
    return ApplicationService.update_application_status(
        db,
        application_id=id,
        user_id=current_user.id,
        new_stage=payload.status,
        notes=payload.notes
    )

@router.delete("/{id}", status_code=status.HTTP_200_OK, summary="Delete Application")
def delete_application(
    id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Delete an application card and clear all cascading timeline transition logs."""
    app = application_repo.get(db, id=id)
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job application card not found."
        )
        
    # IDOR Guard: Verify ownership
    if app.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to delete requested application."
        )
        
    application_repo.remove(db, id=id)
    return {"message": "Job application card and historical timeline logs successfully deleted."}
