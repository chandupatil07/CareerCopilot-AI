import os
import shutil
import logging
from typing import Any
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException, status
from app.repositories.resume import resume_repo
from app.models.resume import Resume
from app.core.config import settings

logger = logging.getLogger("app.services.resume")
from app.services.notification import NotificationService

class ResumeService:
    """
    ResumeService handles validating uploaded files, calculating version indexes,
    saving PDFs to disk, and removing files during deletion processes.
    """

    @staticmethod
    def validate_resume_file(file: UploadFile) -> None:
        """Enforce strict validation limits: PDF format only and <10MB size limits"""
        # 1. Validate File Extension
        filename = file.filename or ""
        ext = os.path.splitext(filename)[1].lower()
        if ext != ".pdf":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file extension '{ext}'. Only PDF files are permitted."
            )

        # 2. Validate MIME Content-Type
        if file.content_type != "application/pdf":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid MIME type '{file.content_type}'. File must be a valid PDF document."
            )

        # 3. Validate File Size (< 10MB)
        # Seek to the end of file to read size, then restore pointer position
        file.file.seek(0, os.SEEK_END)
        size = file.file.tell()
        file.file.seek(0)
        
        max_size = 10 * 1024 * 1024  # 10 MB
        if size > max_size:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File size exceeds 10MB limit (Uploaded size: {size / (1024 * 1024):.2f}MB)."
            )

    @classmethod
    def save_resume(cls, db: Session, *, user_id: int, file: UploadFile) -> Resume:
        """Validate, version, write to disk, and save database metadata records"""
        cls.validate_resume_file(file)

        # Calculate incremental version index
        max_ver = resume_repo.get_max_version(db, user_id=user_id)
        version = max_ver + 1

        # Create target directory layout: uploads/user_id/
        user_dir = os.path.join(settings.UPLOAD_DIR, str(user_id))
        os.makedirs(user_dir, exist_ok=True)

        # Define storage path: uploads/user_id/resume_v{version}.pdf
        filename = f"resume_v{version}.pdf"
        storage_path = os.path.join(user_dir, filename)

        # Write binary chunk coordinates to disk
        try:
            with open(storage_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            logger.error(f"Failed to write file to disk path {storage_path}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save uploaded resume file to local disk."
            )

        # Deactivate previous resumes so the new upload becomes the active parsing target
        resume_repo.deactivate_all_resumes(db, user_id=user_id)

        # Save metadata record in DB
        db_resume = resume_repo.create_resume(
            db,
            user_id=user_id,
            filename=file.filename or filename,
            storage_path=storage_path,
            version=version,
            is_active=True
        )
        
        # Trigger automated notification
        NotificationService.create_notification(
            db,
            user_id=user_id,
            title="Resume Uploaded",
            message=f"Resume file '{db_resume.filename}' (Version {db_resume.version}) was successfully uploaded.",
            type="success",
            notification_type="resume_uploaded",
            icon="file-upload"
        )
        
        return db_resume

    @staticmethod
    def delete_resume(db: Session, *, resume_id: int, user_id: int) -> None:
        """Verify ownership, delete database record, and delete physical file from local disk"""
        resume = resume_repo.get(db, id=resume_id)
        if not resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume record not found."
            )

        # Guard: Enforce IDOR security boundary
        if resume.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not possess permissions to delete this resume."
            )

        # Cache file path location before database delete operation
        path = resume.storage_path

        # Delete database metadata record
        resume_repo.delete_resume(db, resume_id=resume_id)

        # Trigger automated notification
        NotificationService.create_notification(
            db,
            user_id=user_id,
            title="Resume Deleted",
            message="Resume version history details and local disk cache files were successfully removed.",
            type="warning",
            notification_type="resume_deleted",
            icon="trash-alt"
        )

        # Remove physical file from local disk
        if os.path.exists(path):
            try:
                os.remove(path)
            except Exception as e:
                logger.error(f"Failed to delete local disk file {path}: {str(e)}")
                # We do not raise here as the DB record is already successfully deleted

    @classmethod
    def activate_resume(cls, db: Session, *, user_id: int, resume_id: int) -> Resume:
        """Toggle a specific resume version as active and trigger notifications"""
        resume = resume_repo.get(db, id=resume_id)
        if not resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume record not found."
            )

        # IDOR Guard: Verify ownership
        if resume.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to modify requested resume status."
            )

        activated = resume_repo.set_active_resume(db, user_id=user_id, resume_id=resume_id)

        # Trigger automated notification
        NotificationService.create_notification(
            db,
            user_id=user_id,
            title="Resume Activated",
            message=f"Resume '{activated.filename}' (Version {activated.version}) was successfully set as your active profile.",
            type="success",
            notification_type="resume_activated",
            icon="check-circle"
        )
        return activated

    @classmethod
    def parse_and_score_resume(cls, db: Session, *, user_id: int, resume_id: int) -> Any:
        """Parse resume content, generate ATS score, trigger notifications, and persist details"""
        resume = resume_repo.get(db, id=resume_id)
        if not resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume record not found."
            )

        # IDOR Guard: Verify ownership
        if resume.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to parse requested resume."
            )

        # Local imports inside method to prevent circular loading loops
        from app.services.parser import ResumeParserService
        from app.services.ats_scorer import ATSScoringService
        from app.repositories.resume_analysis import analysis_repo

        parsed_data = ResumeParserService.parse_resume(resume.storage_path)
        score_data = ATSScoringService.calculate_ats_score(parsed_data)

        analysis = analysis_repo.save_analysis(db, resume_id=resume_id, parsed_data=parsed_data, score_data=score_data)

        # Trigger automated notification based on ATS score performance thresholds
        ats_score = score_data.get("ats_score", 0)
        if ats_score < 50:
            NotificationService.create_notification(
                db,
                user_id=user_id,
                title="Low ATS Score Warning",
                message=f"Your resume '{resume.filename}' received a low ATS score of {ats_score}/100. Consider optimizing keywords.",
                type="warning",
                notification_type="low_ats_score",
                icon="exclamation-triangle",
                action_url="/resumes"
            )
        else:
            NotificationService.create_notification(
                db,
                user_id=user_id,
                title="ATS Analysis Completed",
                message=f"Your resume '{resume.filename}' was successfully parsed. Calculated ATS Score: {ats_score}/100.",
                type="success",
                notification_type="ats_score_generated",
                icon="chart-bar",
                action_url="/resumes"
            )

        return analysis

