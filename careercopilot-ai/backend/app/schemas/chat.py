from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AIChatBase(BaseModel):
    conversation_id: Optional[str] = None
    prompt: str
    response: str

class AIChatCreate(AIChatBase):
    user_id: int

class AIChat(AIChatBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
