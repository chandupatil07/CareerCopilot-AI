from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import date

from app.repositories.interview import interview_repo
from app.repositories.application import application_repo
from app.schemas.interview import InterviewCreate, InterviewUpdate
from app.models.interview import Interview
from app.services.application import ApplicationService
from app.services.notification import NotificationService

class InterviewService:
    """
    InterviewService manages backend business rules relating to scheduling
    job interviews, managing dates/times, and automating application state updates.
    """

    @classmethod
    def create_interview(cls, db: Session, *, user_id: int, obj_in: InterviewCreate) -> Interview:
        """Create a new interview slot, enforcing user ownership and transitioning application stage if appropriate"""
        # Fetch target job application
        app = application_repo.get(db, id=obj_in.application_id)
        if not app:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Target job application not found."
            )

        # IDOR Guard: Verify ownership of application
        if app.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to requested application record."
            )

        # Save interview record
        db_obj = Interview(
            application_id=obj_in.application_id,
            interview_date=obj_in.interview_date,
            interview_time=obj_in.interview_time,
            mode=obj_in.mode or "Google Meet",
            meeting_link=obj_in.meeting_link,
            interviewer_name=obj_in.interviewer_name,
            notes=obj_in.notes,
            reminder_sent=obj_in.reminder_sent or False
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        # Apply Automatic Stage Transition Policy if application is in initial stages
        if app.current_stage == "Interested":
            # Transition Interested -> Applied first, then to Technical Interview
            ApplicationService.update_application_status(
                db,
                application_id=app.id,
                user_id=user_id,
                new_stage="Applied",
                notes="Automatically moved stage to Applied as part of scheduling an interview."
            )
            ApplicationService.update_application_status(
                db,
                application_id=app.id,
                user_id=user_id,
                new_stage="Technical Interview",
                notes="Automatically moved stage to Technical Interview because an interview slot was scheduled."
            )
        elif app.current_stage == "Applied":
            # Transition Applied -> Technical Interview
            ApplicationService.update_application_status(
                db,
                application_id=app.id,
                user_id=user_id,
                new_stage="Technical Interview",
                notes="Automatically moved stage to Technical Interview because an interview slot was scheduled."
            )

        # Trigger automated notification
        NotificationService.create_notification(
            db,
            user_id=user_id,
            title="Interview Scheduled",
            message=f"An interview with {app.company_name} for the '{app.job_role}' role has been scheduled on {db_obj.interview_date} at {db_obj.interview_time or 'TBD'}.",
            type="success",
            notification_type="interview_scheduled",
            icon="calendar-check",
            action_url="/interviews"
        )

        return db_obj

    @classmethod
    def get_interview(cls, db: Session, *, user_id: int, interview_id: int) -> Interview:
        """Fetch details of an interview, validating that the parent application belongs to the active user"""
        interview = interview_repo.get(db, id=interview_id)
        if not interview:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Interview slot not found."
            )

        # Fetch parent application
        app = application_repo.get(db, id=interview.application_id)
        if not app or app.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to requested interview record."
            )

        return interview

    @classmethod
    def update_interview(cls, db: Session, *, user_id: int, interview_id: int, obj_in: InterviewUpdate) -> Interview:
        """Update interview details after confirming candidate ownership controls"""
        interview = cls.get_interview(db, user_id=user_id, interview_id=interview_id)
        updated = interview_repo.update(db, db_obj=interview, obj_in=obj_in)

        # Fetch parent application
        app = application_repo.get(db, id=updated.application_id)
        app_name = app.company_name if app else "Unknown Company"

        # Trigger automated notification
        NotificationService.create_notification(
            db,
            user_id=user_id,
            title="Interview Updated",
            message=f"Interview schedule details for {app_name} were successfully updated.",
            type="info",
            notification_type="interview_updated",
            icon="calendar-edit",
            action_url="/interviews"
        )
        return updated

    @classmethod
    def delete_interview(cls, db: Session, *, user_id: int, interview_id: int) -> None:
        """Purge interview details after confirming candidate ownership controls"""
        interview = cls.get_interview(db, user_id=user_id, interview_id=interview_id)
        
        # Fetch parent application
        app = application_repo.get(db, id=interview.application_id)
        app_name = app.company_name if app else "Unknown Company"
        
        interview_repo.remove(db, id=interview_id)

        # Trigger automated notification
        NotificationService.create_notification(
            db,
            user_id=user_id,
            title="Interview Cancelled",
            message=f"Scheduled interview for {app_name} on {interview.interview_date} was cancelled and removed.",
            type="warning",
            notification_type="interview_cancelled",
            icon="calendar-times"
        )
