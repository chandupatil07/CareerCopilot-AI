import pytest
from unittest.mock import MagicMock, patch
from datetime import datetime
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.services.ai_assistant import AIAssistantService
from app.repositories.chat_session import chat_session_repo, chat_message_repo
from app.models.chat import ChatSession, ChatMessage
from app.schemas.chat_session import ChatSessionCreate, ChatMessageCreate

MOCK_USER_ID = 1
MOCK_OTHER_USER_ID = 2
MOCK_SESSION_ID = 101

@pytest.fixture
def mock_db():
    return MagicMock(spec=Session)

@patch("app.services.ai_assistant.chat_session_repo.create")
def test_create_conversation_success(mock_repo_create, mock_db):
    """Verify that a conversation session is successfully created and persisted"""
    mock_repo_create.return_value = MagicMock(spec=ChatSession, id=MOCK_SESSION_ID, user_id=MOCK_USER_ID, title="Resume Review")
    
    payload = ChatSessionCreate(title="Resume Review")
    session = AIAssistantService.create_conversation(mock_db, user_id=MOCK_USER_ID, obj_in=payload)
    
    assert session.id == MOCK_SESSION_ID
    assert session.title == "Resume Review"
    mock_repo_create.assert_called_once()

@patch("app.services.ai_assistant.chat_session_repo.list_by_user")
def test_list_conversations_success(mock_repo_list, mock_db):
    """Verify list conversation logs returns sessions created by the user"""
    mock_sessions = [
        MagicMock(spec=ChatSession, id=1, user_id=MOCK_USER_ID, title="Chat 1"),
        MagicMock(spec=ChatSession, id=2, user_id=MOCK_USER_ID, title="Chat 2")
    ]
    mock_repo_list.return_value = mock_sessions
    
    conversations = AIAssistantService.list_conversations(mock_db, user_id=MOCK_USER_ID)
    
    assert len(conversations) == 2
    assert conversations[0].title == "Chat 1"
    mock_repo_list.assert_called_once_with(mock_db, user_id=MOCK_USER_ID)

@patch.object(chat_session_repo, "get")
@patch.object(chat_message_repo, "list_by_session")
def test_get_conversation_messages_success(mock_repo_list_msg, mock_repo_get, mock_db):
    """Verify retrieval of conversation messages succeeds for the session owner"""
    mock_session = MagicMock(spec=ChatSession, id=MOCK_SESSION_ID, user_id=MOCK_USER_ID)
    mock_repo_get.return_value = mock_session
    
    mock_messages = [
        MagicMock(spec=ChatMessage, id=1, session_id=MOCK_SESSION_ID, role="user", content="Hello"),
        MagicMock(spec=ChatMessage, id=2, session_id=MOCK_SESSION_ID, role="assistant", content="Hi")
    ]
    mock_repo_list_msg.return_value = mock_messages
    
    messages = AIAssistantService.get_conversation_messages(mock_db, user_id=MOCK_USER_ID, session_id=MOCK_SESSION_ID)
    
    assert len(messages) == 2
    assert messages[0].content == "Hello"
    mock_repo_get.assert_called_once_with(mock_db, id=MOCK_SESSION_ID)
    mock_repo_list_msg.assert_called_once_with(mock_db, session_id=MOCK_SESSION_ID)

@patch.object(chat_session_repo, "get")
def test_get_conversation_messages_idor_protection(mock_repo_get, mock_db):
    """Verify that accessing another user's session messages is blocked with HTTP 403 Forbidden"""
    mock_session = MagicMock(spec=ChatSession, id=MOCK_SESSION_ID, user_id=MOCK_OTHER_USER_ID)
    mock_repo_get.return_value = mock_session
    
    with pytest.raises(HTTPException) as exc_info:
        AIAssistantService.get_conversation_messages(mock_db, user_id=MOCK_USER_ID, session_id=MOCK_SESSION_ID)
        
    assert exc_info.value.status_code == status.HTTP_403_FORBIDDEN
    assert "Access denied" in exc_info.value.detail

@patch.object(chat_session_repo, "get")
@patch.object(chat_message_repo, "create")
def test_save_message_success(mock_repo_create_msg, mock_repo_get, mock_db):
    """Verify message persistence handles valid roles and updates updated_at on parent session"""
    mock_session = MagicMock(spec=ChatSession, id=MOCK_SESSION_ID, user_id=MOCK_USER_ID)
    mock_repo_get.return_value = mock_session
    
    mock_msg = MagicMock(spec=ChatMessage, id=1, session_id=MOCK_SESSION_ID, role="user", content="How is it?")
    mock_repo_create_msg.return_value = mock_msg
    
    payload = ChatMessageCreate(role="user", content="How is it?")
    msg = AIAssistantService.save_message(mock_db, user_id=MOCK_USER_ID, session_id=MOCK_SESSION_ID, obj_in=payload)
    
    assert msg.content == "How is it?"
    mock_repo_get.assert_called_once_with(mock_db, id=MOCK_SESSION_ID)
    mock_repo_create_msg.assert_called_once()
    mock_db.commit.assert_called()

@patch.object(chat_session_repo, "get")
def test_save_message_invalid_role(mock_repo_get, mock_db):
    """Verify that posting messages with invalid roles (neither user nor assistant) is blocked with HTTP 400"""
    mock_session = MagicMock(spec=ChatSession, id=MOCK_SESSION_ID, user_id=MOCK_USER_ID)
    mock_repo_get.return_value = mock_session
    
    payload = ChatMessageCreate(role="system", content="Admin prompt")
    with pytest.raises(HTTPException) as exc_info:
        AIAssistantService.save_message(mock_db, user_id=MOCK_USER_ID, session_id=MOCK_SESSION_ID, obj_in=payload)
        
    assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
    assert "Invalid message role" in exc_info.value.detail

@patch.object(chat_session_repo, "get")
@patch.object(chat_session_repo, "remove")
def test_delete_conversation_success(mock_repo_remove, mock_repo_get, mock_db):
    """Verify deletion of chat session removes the conversation and nested messages"""
    mock_session = MagicMock(spec=ChatSession, id=MOCK_SESSION_ID, user_id=MOCK_USER_ID)
    mock_repo_get.return_value = mock_session
    mock_repo_remove.return_value = mock_session
    
    deleted = AIAssistantService.delete_conversation(mock_db, user_id=MOCK_USER_ID, session_id=MOCK_SESSION_ID)
    
    assert deleted.id == MOCK_SESSION_ID
    mock_repo_get.assert_called_once_with(mock_db, id=MOCK_SESSION_ID)
    mock_repo_remove.assert_called_once_with(mock_db, id=MOCK_SESSION_ID)

@patch.object(chat_session_repo, "get")
def test_delete_conversation_idor_protection(mock_repo_get, mock_db):
    """Verify that deleting another user's session is blocked with HTTP 403 Forbidden"""
    mock_session = MagicMock(spec=ChatSession, id=MOCK_SESSION_ID, user_id=MOCK_OTHER_USER_ID)
    mock_repo_get.return_value = mock_session
    
    with pytest.raises(HTTPException) as exc_info:
        AIAssistantService.delete_conversation(mock_db, user_id=MOCK_USER_ID, session_id=MOCK_SESSION_ID)
        
    assert exc_info.value.status_code == status.HTTP_403_FORBIDDEN
    assert "Access denied" in exc_info.value.detail
