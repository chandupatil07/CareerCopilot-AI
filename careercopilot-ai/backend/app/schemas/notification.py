from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class NotificationBase(BaseModel):
    title: str
    message: str
    type: Optional[str] = "info" # severity class: info, success, warning, error
    notification_type: Optional[str] = "system" # event class: welcome, resume_uploaded, ats_score, etc.
    priority: Optional[str] = "medium" # urgency: high, medium, low
    icon: Optional[str] = None
    is_read: Optional[bool] = False
    expires_at: Optional[datetime] = None
    metadata_json: Optional[Dict[str, Any]] = None
    action_url: Optional[str] = None

class NotificationCreate(NotificationBase):
    user_id: int

class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None

class Notification(NotificationBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
