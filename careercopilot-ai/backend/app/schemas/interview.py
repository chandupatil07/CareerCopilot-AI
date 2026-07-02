from pydantic import BaseModel
from typing import Optional
from datetime import date

class InterviewBase(BaseModel):
    interview_date: date
    interview_time: Optional[str] = None
    mode: Optional[str] = "Google Meet"
    meeting_link: Optional[str] = None
    interviewer_name: Optional[str] = None
    notes: Optional[str] = None
    reminder_sent: Optional[bool] = False

class InterviewCreate(InterviewBase):
    application_id: int

class InterviewUpdate(BaseModel):
    interview_date: Optional[date] = None
    interview_time: Optional[str] = None
    mode: Optional[str] = None
    meeting_link: Optional[str] = None
    interviewer_name: Optional[str] = None
    notes: Optional[str] = None
    reminder_sent: Optional[bool] = None

class Interview(InterviewBase):
    id: int
    application_id: int

    class Config:
        from_attributes = True
