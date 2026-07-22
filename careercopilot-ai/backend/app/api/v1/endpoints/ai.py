from typing import List, Any
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.deps import get_current_user
from app.models.user import User as UserModel
from app.schemas.chat_session import (
    ChatSession,
    ChatSessionCreate,
    ChatMessage,
    ChatMessageCreate
)
from app.services.ai_assistant import AIAssistantService

router = APIRouter()

@router.post("/conversations", response_model=ChatSession, status_code=status.HTTP_201_CREATED, summary="Create Conversation")
def create_conversation(
    payload: ChatSessionCreate,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Start a new chat session conversation with the AI Assistant.
    """
    return AIAssistantService.create_conversation(db, user_id=current_user.id, obj_in=payload)

@router.get("/conversations", response_model=List[ChatSession], summary="List Conversations")
def list_conversations(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve all conversation history list for the active logged-in candidate.
    """
    return AIAssistantService.list_conversations(db, user_id=current_user.id)

@router.get("/conversations/{id}/messages", response_model=List[ChatMessage], summary="Get Conversation Messages")
def get_conversation_messages(
    id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Fetch all chat messages inside a target conversation session.
    """
    return AIAssistantService.get_conversation_messages(db, user_id=current_user.id, session_id=id)

@router.post("/conversations/{id}/messages", response_model=ChatMessage, status_code=status.HTTP_201_CREATED, summary="Save Message")
def save_message(
    id: int,
    payload: ChatMessageCreate,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Append and save a new user or assistant prompt log turn to a conversation.
    """
    return AIAssistantService.save_message(db, user_id=current_user.id, session_id=id, obj_in=payload)

@router.delete("/conversations/{id}", response_model=ChatSession, summary="Delete Conversation")
def delete_conversation(
    id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Permanently delete a conversation chat session and all nested message history log lines.
    """
    return AIAssistantService.delete_conversation(db, user_id=current_user.id, session_id=id)
