from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ResumeBase(BaseModel):
    filename: str
    storage_path: str
    version: Optional[int] = 1
    is_active: Optional[bool] = True

class ResumeCreate(ResumeBase):
    user_id: int

class ResumeUpdate(BaseModel):
    filename: Optional[str] = None
    storage_path: Optional[str] = None
    version: Optional[int] = None
    is_active: Optional[bool] = None

class Resume(ResumeBase):
    id: int
    user_id: int
    upload_date: datetime

    class Config:
        from_attributes = True
