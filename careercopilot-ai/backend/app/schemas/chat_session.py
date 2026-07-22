from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# =====================================================================
# Chat Message Schemas
# =====================================================================
class ChatMessageBase(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessage(ChatMessageBase):
    id: int
    session_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# =====================================================================
# Chat Session (Conversation) Schemas
# =====================================================================
class ChatSessionBase(BaseModel):
    title: str

class ChatSessionCreate(ChatSessionBase):
    pass

class ChatSession(ChatSessionBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ChatSessionWithMessages(ChatSession):
    messages: List[ChatMessage] = []
