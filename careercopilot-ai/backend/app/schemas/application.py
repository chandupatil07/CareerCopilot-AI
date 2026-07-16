from pydantic import BaseModel, EmailStr, HttpUrl
from typing import Optional, List, Dict, Any
from datetime import date, datetime

class ApplicationTimelineBase(BaseModel):
    from_stage: str
    to_stage: str
    notes: Optional[str] = None

class ApplicationTimeline(ApplicationTimelineBase):
    id: int
    application_id: int
    changed_at: datetime

    class Config:
        from_attributes = True

class ApplicationBase(BaseModel):
    company_name: str
    job_role: str
    source: Optional[str] = None
    applied_date: Optional[date] = None
    current_stage: Optional[str] = "Interested"
    location: Optional[str] = None
    employment_type: Optional[str] = None
    salary_range: Optional[str] = None
    job_description: Optional[str] = None
    application_url: Optional[str] = None
    recruiter_name: Optional[str] = None
    recruiter_email: Optional[EmailStr] = None
    resume_version_used: Optional[int] = None
    priority: Optional[str] = "Medium"
    expected_salary: Optional[str] = None
    offer_amount: Optional[str] = None
    joining_date: Optional[date] = None
    notes: Optional[str] = None
    favorite: Optional[bool] = False
    archived: Optional[bool] = False

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    company_name: Optional[str] = None
    job_role: Optional[str] = None
    source: Optional[str] = None
    applied_date: Optional[date] = None
    current_stage: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    salary_range: Optional[str] = None
    job_description: Optional[str] = None
    application_url: Optional[str] = None
    recruiter_name: Optional[str] = None
    recruiter_email: Optional[EmailStr] = None
    resume_version_used: Optional[int] = None
    priority: Optional[str] = None
    expected_salary: Optional[str] = None
    offer_amount: Optional[str] = None
    joining_date: Optional[date] = None
    notes: Optional[str] = None
    favorite: Optional[bool] = None
    archived: Optional[bool] = None

class Application(ApplicationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    timeline: List[ApplicationTimeline] = []

    class Config:
        from_attributes = True

# Statistics Schema
class MonthlyCount(BaseModel):
    month: str
    count: int

class ApplicationStatistics(BaseModel):
    total_applications: int
    applied_count: int
    interviewing_count: int
    offers_count: int
    rejected_count: int
    acceptance_rate: float
    response_rate: float
    status_distribution: Dict[str, int]
    monthly_trends: List[MonthlyCount]
