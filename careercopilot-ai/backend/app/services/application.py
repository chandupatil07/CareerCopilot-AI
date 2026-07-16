from typing import Dict, List, Any, Optional
from datetime import date
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.repositories.application import application_repo
from app.schemas.application import ApplicationCreate, ApplicationUpdate
from app.models.application import Application
from app.services.notification import NotificationService

# Allowed stages in the workflow
ALLOWED_STAGES = {
    "Interested", "Applied", "Online Assessment", "Technical Interview", 
    "HR Interview", "Manager Round", "Offer", "Accepted", "Rejected", "Withdrawn"
}

# Transition rules dictionary: maps target stage to allowed source stages
TRANSITION_RULES = {
    "Interested": {"Interested", "Withdrawn", "Rejected"},
    "Applied": {"Interested", "Applied"},
    "Online Assessment": {"Applied", "Interested"},
    "Technical Interview": {"Applied", "Online Assessment", "Technical Interview", "HR Interview", "Manager Round"},
    "HR Interview": {"Applied", "Online Assessment", "Technical Interview", "HR Interview", "Manager Round"},
    "Manager Round": {"Applied", "Online Assessment", "Technical Interview", "HR Interview", "Manager Round"},
    "Offer": {"Technical Interview", "HR Interview", "Manager Round", "Online Assessment", "Applied"},
    "Accepted": {"Offer"},
    "Rejected": {"Interested", "Applied", "Online Assessment", "Technical Interview", "HR Interview", "Manager Round", "Offer"},
    "Withdrawn": {"Interested", "Applied", "Online Assessment", "Technical Interview", "HR Interview", "Manager Round", "Offer"}
}

class ApplicationService:
    """
    ApplicationService handles business validations (workflow state machines,
    duplication constraints) and schedules timeline logging.
    """

    @classmethod
    def create_application(cls, db: Session, *, user_id: int, obj_in: ApplicationCreate) -> Application:
        """Create a new job tracker card, checking for duplicates and saving initial timeline event"""
        # Validate duplicate check
        is_dup = application_repo.check_duplicate(
            db,
            user_id=user_id,
            company_name=obj_in.company_name,
            job_role=obj_in.job_role,
            applied_date=obj_in.applied_date
        )
        if is_dup:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A job application for this company, role, and date has already been registered."
            )

        # Enforce initial stage validation
        stage = obj_in.current_stage or "Interested"
        if stage not in ALLOWED_STAGES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid initial stage '{stage}'. Must be one of {ALLOWED_STAGES}"
            )

        # Create base database record
        db_app = Application(
            user_id=user_id,
            company_name=obj_in.company_name,
            job_role=obj_in.job_role,
            source=obj_in.source,
            applied_date=obj_in.applied_date,
            current_stage=stage,
            location=obj_in.location,
            employment_type=obj_in.employment_type,
            salary_range=obj_in.salary_range,
            job_description=obj_in.job_description,
            application_url=obj_in.application_url,
            recruiter_name=obj_in.recruiter_name,
            recruiter_email=obj_in.recruiter_email,
            resume_version_used=obj_in.resume_version_used,
            priority=obj_in.priority or "Medium",
            expected_salary=obj_in.expected_salary,
            offer_amount=obj_in.offer_amount,
            joining_date=obj_in.joining_date,
            notes=obj_in.notes,
            favorite=obj_in.favorite,
            archived=obj_in.archived
        )
        db.add(db_app)
        db.commit()
        db.refresh(db_app)

        # Log initial timeline history event
        application_repo.add_timeline_entry(
            db,
            application_id=db_app.id,
            from_stage="None",
            to_stage=stage,
            notes="Initial application logged."
        )

        # Trigger automated notification
        NotificationService.create_notification(
            db,
            user_id=user_id,
            title="Application Created",
            message=f"Job application for {db_app.company_name} ({db_app.job_role}) was successfully registered.",
            type="info",
            notification_type="application_created",
            icon="briefcase"
        )

        return db_app

    @classmethod
    def update_application_status(
        self, db: Session, *, application_id: int, user_id: int, new_stage: str, notes: Optional[str] = None
    ) -> Application:
        """Validate state machine flow transitions and log events to timeline history"""
        app = application_repo.get(db, id=application_id)
        if not app:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job application card not found."
            )

        # IDOR Guard: Check ownership
        if app.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not possess permissions to update this application status."
            )

        # Validate stage parameters
        if new_stage not in ALLOWED_STAGES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Target stage '{new_stage}' is not a valid workflow status. Permitted values: {ALLOWED_STAGES}"
            )

        old_stage = app.current_stage
        if old_stage == new_stage:
            return app

        # Validate workflow transitions rules
        allowed_sources = TRANSITION_RULES.get(new_stage, set())
        if old_stage not in allowed_sources:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Workflow transition blocked: Cannot transition status directly from '{old_stage}' to '{new_stage}'."
            )

        # Apply stage update
        app.current_stage = new_stage
        db.add(app)
        db.commit()
        db.refresh(app)

        # Record timeline event history
        application_repo.add_timeline_entry(
            db,
            application_id=app.id,
            from_stage=old_stage,
            to_stage=new_stage,
            notes=notes or f"Status updated from {old_stage} to {new_stage}."
        )

        # Trigger automated notification
        NotificationService.create_notification(
            db,
            user_id=user_id,
            title="Application Status Updated",
            message=f"Job application for {app.company_name} was moved to stage '{new_stage}'.",
            type="info",
            notification_type="application_status_updated",
            icon="sync-alt"
        )

        return app
