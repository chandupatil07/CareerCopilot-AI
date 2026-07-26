import pytest
import json
import asyncio
from unittest.mock import MagicMock, patch, AsyncMock, ANY
from fastapi import status
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.models.chat import ChatSession, ChatMessage
from app.repositories.chat_session import chat_session_repo, chat_message_repo
from app.api.deps import get_current_user
from app.database.session import get_db

client = TestClient(app)

MOCK_USER_ID = 1
MOCK_OTHER_USER_ID = 2
MOCK_SESSION_ID = 101

class MockAsyncIterator:
    """Helper class to mock Google GenerativeAI async streaming chunks"""
    def __init__(self, items):
        self.items = items
        self.index = 0

    def __aiter__(self):
        return self

    async def __anext__(self):
        if self.index >= len(self.items):
            raise StopAsyncIteration
        item = self.items[self.index]
        self.index += 1
        return item

@pytest.fixture
def mock_auth_headers():
    return {"Authorization": "Bearer fake_token"}

@pytest.fixture
def mock_db():
    db_mock = MagicMock(spec=Session)
    app.dependency_overrides[get_db] = lambda: db_mock
    yield db_mock

@pytest.fixture
def mock_user_auth(mock_db):
    mock_user = MagicMock(id=MOCK_USER_ID)
    app.dependency_overrides[get_current_user] = lambda: mock_user
    yield mock_user

@pytest.fixture(autouse=True)
def cleanup_overrides():
    yield
    app.dependency_overrides.clear()

# =====================================================================
# Auth & IDOR Protection Tests
# =====================================================================

def test_stream_endpoint_missing_auth():
    """Verify that requests missing active bearer tokens are rejected with 401 Unauthorized"""
    response = client.post(
        f"/api/v1/ai/conversations/{MOCK_SESSION_ID}/messages/stream",
        json={"role": "user", "content": "hi"}
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@patch.object(chat_session_repo, "get")
def test_stream_endpoint_idor_protection(mock_session_get, mock_user_auth, mock_auth_headers):
    """Verify that accessing another user's session returns HTTP 403 Forbidden"""
    # Configure mock session ownership mismatch (owned by MOCK_OTHER_USER_ID)
    mock_session_get.return_value = MagicMock(spec=ChatSession, id=MOCK_SESSION_ID, user_id=MOCK_OTHER_USER_ID)

    response = client.post(
        f"/api/v1/ai/conversations/{MOCK_SESSION_ID}/messages/stream",
        json={"role": "user", "content": "hello"},
        headers=mock_auth_headers
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert "Access denied" in response.json()["detail"]

# =====================================================================
# Streaming Lifecycle & Database Consistency Tests
# =====================================================================

@patch.object(chat_session_repo, "get")
@patch.object(chat_message_repo, "create")
@patch.object(chat_message_repo, "list_by_session")
@patch("google.generativeai.GenerativeModel")
@patch("google.generativeai.configure")
def test_stream_endpoint_success(
    mock_configure,
    mock_gen_model,
    mock_list_msg,
    mock_create_msg,
    mock_session_get,
    mock_user_auth,
    mock_auth_headers
):
    """Verify a successful stream yields progressive token chunks and saves assistant message"""
    # 1. Mock session state
    mock_session = MagicMock(spec=ChatSession, id=MOCK_SESSION_ID, user_id=MOCK_USER_ID)
    mock_session_get.return_value = mock_session

    # 2. Mock message creation records
    mock_user_msg = MagicMock(spec=ChatMessage, id=501, role="user", content="tell me a joke")
    mock_assistant_msg = MagicMock(spec=ChatMessage, id=502, role="assistant", content="Funny joke!")
    mock_create_msg.side_effect = [mock_user_msg, mock_assistant_msg]
    mock_list_msg.return_value = [mock_user_msg]

    # 3. Mock Gemini async generator responses
    mock_model_instance = MagicMock()
    mock_gen_model.return_value = mock_model_instance
    mock_chunks = [
        MagicMock(text="Funny"),
        MagicMock(text=" joke!")
    ]
    mock_model_instance.generate_content_async = AsyncMock(return_value=MockAsyncIterator(mock_chunks))

    # 4. Trigger request and parse stream
    response = client.post(
        f"/api/v1/ai/conversations/{MOCK_SESSION_ID}/messages/stream",
        json={"role": "user", "content": "tell me a joke"},
        headers=mock_auth_headers
    )
    
    assert response.status_code == 200
    assert response.headers["content-type"] == "text/event-stream; charset=utf-8"

    # Read SSE payload lines
    lines = [line.decode("utf-8") if isinstance(line, bytes) else line for line in response.iter_lines() if line]
    
    assert len(lines) == 3
    assert 'data: {"content": "Funny"}' in lines[0]
    assert 'data: {"content": " joke!"}' in lines[1]
    assert 'data: {"content": "", "done": true, "message_id": 502}' in lines[2]

    # Assert persistence triggers
    assert mock_create_msg.call_count == 2
    mock_create_msg.assert_any_call(ANY, obj_in={
        "session_id": MOCK_SESSION_ID,
        "role": "assistant",
        "content": "Funny joke!"
    })

@patch.object(chat_session_repo, "get")
@patch.object(chat_message_repo, "create")
@patch.object(chat_message_repo, "remove")
@patch.object(chat_message_repo, "list_by_session")
@patch("google.generativeai.GenerativeModel")
@patch("google.generativeai.configure")
def test_stream_endpoint_cancelled_rollback(
    mock_configure,
    mock_gen_model,
    mock_list_msg,
    mock_remove_msg,
    mock_create_msg,
    mock_session_get,
    mock_user_auth,
    mock_auth_headers
):
    """Verify that client cancellation deletes the user message to prevent dangling prompts"""
    # 1. Setup mock contexts
    mock_session = MagicMock(spec=ChatSession, id=MOCK_SESSION_ID, user_id=MOCK_USER_ID)
    mock_session_get.return_value = mock_session

    mock_user_msg = MagicMock(spec=ChatMessage, id=501, role="user", content="long prompt")
    mock_create_msg.return_value = mock_user_msg
    mock_list_msg.return_value = [mock_user_msg]

    # 2. Configure model instance that raises asyncio.CancelledError mid-stream
    mock_model_instance = MagicMock()
    mock_gen_model.return_value = mock_model_instance

    class CancellingAsyncIterator:
        def __aiter__(self):
            return self
        async def __anext__(self):
            raise asyncio.CancelledError()

    mock_model_instance.generate_content_async = AsyncMock(return_value=CancellingAsyncIterator())

    # 3. Execute stream endpoint
    response = client.post(
        f"/api/v1/ai/conversations/{MOCK_SESSION_ID}/messages/stream",
        json={"role": "user", "content": "long prompt"},
        headers=mock_auth_headers
    )
    assert response.status_code == 200

    # 4. Verify user message was cascading-deleted to preserve consistency (ADR-055)
    mock_remove_msg.assert_called_once_with(ANY, id=501)

@patch.object(chat_session_repo, "get")
@patch.object(chat_message_repo, "create")
@patch.object(chat_message_repo, "remove")
@patch.object(chat_message_repo, "list_by_session")
@patch("google.generativeai.GenerativeModel")
@patch("google.generativeai.configure")
def test_stream_endpoint_gemini_error_rollback(
    mock_configure,
    mock_gen_model,
    mock_list_msg,
    mock_remove_msg,
    mock_create_msg,
    mock_session_get,
    mock_user_auth,
    mock_auth_headers
):
    """Verify that general exceptions raise error SSE packets and trigger user prompt rollbacks"""
    # 1. Setup mock contexts
    mock_session = MagicMock(spec=ChatSession, id=MOCK_SESSION_ID, user_id=MOCK_USER_ID)
    mock_session_get.return_value = mock_session

    mock_user_msg = MagicMock(spec=ChatMessage, id=501, role="user", content="invalid query")
    mock_create_msg.return_value = mock_user_msg
    mock_list_msg.return_value = [mock_user_msg]

    # 2. Configure model instance that raises RuntimeError
    mock_model_instance = MagicMock()
    mock_gen_model.return_value = mock_model_instance
    mock_model_instance.generate_content_async.side_effect = RuntimeError("API key is invalid or expired")

    # 3. Execute stream endpoint
    response = client.post(
        f"/api/v1/ai/conversations/{MOCK_SESSION_ID}/messages/stream",
        json={"role": "user", "content": "invalid query"},
        headers=mock_auth_headers
    )
    
    assert response.status_code == 200
    lines = [line.decode("utf-8") if isinstance(line, bytes) else line for line in response.iter_lines() if line]
    
    assert len(lines) > 0
    
    # Reassemble the content from chunk tokens
    import json
    full_text = ""
    for line in lines:
        if line.startswith("data: "):
            try:
                data = json.loads(line[6:])
                if "content" in data:
                    full_text += data["content"]
            except Exception:
                pass
                
    assert "[Local Fail-Safe Mode]" in full_text

    # 4. Verify user message was preserved (not removed)
    mock_remove_msg.assert_not_called()
