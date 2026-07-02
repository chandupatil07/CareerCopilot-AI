from pydantic import BaseModel
from typing import Optional
from datetime import date

class ApplicationBase(BaseModel):
    company_name: str
    job_role: str
    source: Optional[str] = None
    applied_date: Optional[date] = None
    current_stage: Optional[str] = "Applied"
    location: Optional[str] = None
    salary_range: Optional[str] = None
    notes: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    company_name: Optional[str] = None
    job_role: Optional[str] = None
    source: Optional[str] = None
    applied_date: Optional[date] = None
    current_stage: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    notes: Optional[str] = None

class Application(ApplicationBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
