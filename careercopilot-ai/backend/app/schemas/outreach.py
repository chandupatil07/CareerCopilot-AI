from pydantic import BaseModel
from datetime import datetime

class ColdEmailHistoryBase(BaseModel):
    generated_email: str
    company: str
    role: str

class ColdEmailHistoryCreate(ColdEmailHistoryBase):
    user_id: int

class ColdEmailHistory(ColdEmailHistoryBase):
    id: int
    user_id: int
    created_date: datetime

    class Config:
        from_attributes = True


class LinkedInHistoryBase(BaseModel):
    generated_message: str
    target_company: str

class LinkedInHistoryCreate(LinkedInHistoryBase):
    user_id: int

class LinkedInHistory(LinkedInHistoryBase):
    id: int
    user_id: int
    created_date: datetime

    class Config:
        from_attributes = True
