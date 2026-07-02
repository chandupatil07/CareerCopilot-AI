from typing import List, Any
from fastapi import APIRouter, Depends, UploadFile, File, status, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.deps import get_current_user
from app.services.resume import ResumeService
from app.repositories.resume import resume_repo
from app.schemas.resume import Resume
from app.models.user import User as UserModel

router = APIRouter()

@router.post("/upload", response_model=Resume, status_code=status.HTTP_201_CREATED, summary="Upload Resume")
def upload_resume(
    file: UploadFile = File(...),
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Validate, version, upload, and save a PDF resume file.
    The new resume automatically becomes the active resume version.
    """
    return ResumeService.save_resume(db, user_id=current_user.id, file=file)

@router.get("", response_model=List[Resume], summary="List User Resumes")
def list_resumes(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Retrieve the logged-in candidate's uploaded resume version history."""
    return resume_repo.list_by_user(db, user_id=current_user.id)

@router.get("/{id}", response_model=Resume, summary="Get Resume By ID")
def get_resume(
    id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Retrieve metadata logs for a specific resume by ID."""
    resume = resume_repo.get(db, id=id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume record not found."
        )
    
    # IDOR Guard: Verify ownership
    if resume.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to requested resume resource."
        )
    return resume

@router.get("/{id}/download", summary="Download Resume File")
def download_resume(
    id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Download the physical PDF resume file."""
    resume = resume_repo.get(db, id=id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume record not found."
        )
    
    # IDOR Guard: Verify ownership
    if resume.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to download requested resume."
        )
    
    import os
    if not os.path.exists(resume.storage_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Physical PDF file is missing from local disk storage."
        )
        
    return FileResponse(
        path=resume.storage_path,
        media_type="application/pdf",
        filename=resume.filename
    )

@router.put("/{id}/activate", response_model=Resume, summary="Set Active Resume")
def activate_resume(
    id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Toggle a specific resume version as the active target for ATS parsing scans."""
    resume = resume_repo.get(db, id=id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume record not found."
        )
    
    # IDOR Guard: Verify ownership
    if resume.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to modify requested resume status."
        )
        
    return resume_repo.set_active_resume(db, user_id=current_user.id, resume_id=id)

@router.delete("/{id}", status_code=status.HTTP_200_OK, summary="Delete Resume")
def delete_resume(
    id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Delete a resume's database metadata record and clear its PDF file from local disk."""
    ResumeService.delete_resume(db, resume_id=id, user_id=current_user.id)
    return {"message": "Resume record and physical file successfully deleted."}

# New imports for parsing and scoring
from app.schemas.resume_analysis import ResumeAnalysis as ResumeAnalysisSchema
from app.services.parser import ResumeParserService
from app.services.ats_scorer import ATSScoringService
from app.repositories.resume_analysis import analysis_repo

@router.post("/{id}/parse", response_model=ResumeAnalysisSchema, status_code=status.HTTP_200_OK, summary="Parse Resume")
def parse_resume(
    id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Extract raw text, contact information, education, skills, and projects,
    running a rule-based ATS scoring algorithm on findings.
    """
    resume = resume_repo.get(db, id=id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume record not found."
        )
    
    # IDOR Guard: Verify ownership
    if resume.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to parse requested resume."
        )
        
    # Extract plain text content and parse metadata elements
    parsed_data = ResumeParserService.parse_resume(resume.storage_path)
    
    # Perform rule-based ATS scoring
    score_data = ATSScoringService.calculate_ats_score(parsed_data)
    
    # Persist analysis details in database
    return analysis_repo.save_analysis(db, resume_id=id, parsed_data=parsed_data, score_data=score_data)

@router.get("/{id}/analysis", response_model=ResumeAnalysisSchema, summary="Get Resume Analysis")
def get_resume_analysis(
    id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Retrieve compiled parsing logs and extracted metadata blocks."""
    resume = resume_repo.get(db, id=id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume record not found."
        )
        
    # IDOR Guard: Verify ownership
    if resume.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to requested resume analysis."
        )
        
    analysis = analysis_repo.get_by_resume_id(db, resume_id=id)
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume has not been parsed yet. Please run parse endpoint first."
        )
    return analysis

@router.get("/{id}/ats-score", summary="Get ATS Score Report")
def get_resume_ats_score(
    id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Retrieve overall ATS score and segment metrics report."""
    resume = resume_repo.get(db, id=id)
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume record not found."
        )
        
    # IDOR Guard: Verify ownership
    if resume.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to requested resume score."
        )
        
    analysis = analysis_repo.get_by_resume_id(db, resume_id=id)
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume has not been parsed yet. Please run parse endpoint first."
        )
        
    return {
        "resume_id": analysis.resume_id,
        "ats_score": analysis.ats_score,
        "score_breakdown": analysis.score_breakdown
    }

