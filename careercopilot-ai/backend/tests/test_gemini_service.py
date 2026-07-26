import pytest
from unittest.mock import MagicMock, patch
from google.api_core import exceptions as google_exceptions

from app.models.chat import ChatMessage
from app.services.ai.prompt_builder import PromptBuilder
from app.services.ai.response_formatter import ResponseFormatter
from app.services.ai.gemini_service import GeminiService
from app.services.ai.ai_exceptions import (
    AIServiceError,
    AITimeoutError,
    AIRateLimitError,
    AIInvalidRequestError
)

# =====================================================================
# PromptBuilder Tests
# =====================================================================
def test_prompt_builder_system_instruction():
    instruction = PromptBuilder.get_system_instruction()
    assert "CareerCopilot AI" in instruction
    assert "Markdown" in instruction

def test_prompt_builder_build_history():
    msg1 = ChatMessage(id=1, session_id=101, role="user", content="Hello AI")
    msg2 = ChatMessage(id=2, session_id=101, role="assistant", content="Hello User")
    
    contents = PromptBuilder.build_history([msg1, msg2])
    assert len(contents) == 2
    assert contents[0]["role"] == "user"
    assert contents[0]["parts"] == ["Hello AI"]
    assert contents[1]["role"] == "model"  # mapped assistant -> model
    assert contents[1]["parts"] == ["Hello User"]

def test_prompt_builder_build_history_clamping():
    messages = [
        ChatMessage(id=i, session_id=101, role="user" if i % 2 == 0 else "assistant", content=f"Msg {i}")
        for i in range(10)
    ]
    contents = PromptBuilder.build_history(messages, max_messages=4)
    assert len(contents) == 4
    assert contents[0]["parts"] == ["Msg 6"]
    assert contents[3]["parts"] == ["Msg 9"]

@patch("app.services.ai.prompt_builder.settings")
def test_prompt_builder_build_history_trimming_from_settings(mock_settings):
    mock_settings.GEMINI_MAX_HISTORY_MESSAGES = 3
    messages = [
        ChatMessage(id=i, session_id=101, role="user", content=f"Msg {i}")
        for i in range(5)
    ]
    contents = PromptBuilder.build_history(messages)  # max_messages=None, uses settings
    assert len(contents) == 3
    assert contents[0]["parts"] == ["Msg 2"]
    assert contents[2]["parts"] == ["Msg 4"]

def test_prompt_builder_inject_rag_context():
    prompt = "Review my profile"
    context = ["Resume text", "Job details"]
    injected = PromptBuilder.inject_rag_context(prompt, context)
    assert "Resume text" in injected
    assert "Job details" in injected
    assert prompt in injected

# =====================================================================
# ResponseFormatter Tests
# =====================================================================
def test_response_formatter_clean():
    raw = "   Some generated text.   \n"
    assert ResponseFormatter.format_response(raw) == "Some generated text."

def test_response_formatter_fallback_empty():
    fallback_msg = "I apologize, but I was unable to generate a response. Please try asking again."
    assert ResponseFormatter.format_response("") == fallback_msg
    assert ResponseFormatter.format_response(None) == fallback_msg
    assert ResponseFormatter.format_response("   ") == fallback_msg

# =====================================================================
# GeminiService Tests
# =====================================================================
@pytest.fixture
def mock_settings():
    with patch("app.services.ai.gemini_service.settings") as mock:
        mock.GEMINI_API_KEY = "fake_key"
        mock.GEMINI_MODEL = "gemini-1.5-flash"
        mock.GEMINI_TIMEOUT_SECONDS = 15
        yield mock

@patch("google.generativeai.GenerativeModel")
@patch("google.generativeai.configure")
def test_gemini_service_success(mock_configure, mock_generative_model, mock_settings):
    mock_model_instance = MagicMock()
    mock_generative_model.return_value = mock_model_instance
    
    mock_response = MagicMock()
    mock_response.text = "Hello I am your CareerCopilot assistant"
    mock_model_instance.generate_content.return_value = mock_response
    
    # Run service
    response = GeminiService.generate_response("System instruction", [{"role": "user", "parts": ["hi"]}])
    
    assert response == "Hello I am your CareerCopilot assistant"
    mock_configure.assert_called_once_with(api_key="fake_key")
    mock_generative_model.assert_called_once_with(
        model_name="gemini-1.5-flash",
        system_instruction="System instruction"
    )

@patch("google.generativeai.GenerativeModel")
@patch("google.generativeai.configure")
def test_gemini_service_timeout(mock_configure, mock_generative_model, mock_settings):
    mock_model_instance = MagicMock()
    mock_generative_model.return_value = mock_model_instance
    
    mock_model_instance.generate_content.side_effect = google_exceptions.DeadlineExceeded("Request timed out")
    
    with pytest.raises(AITimeoutError) as exc_info:
        GeminiService.generate_response("System instruction", [])
    assert "timed out" in exc_info.value.message

@patch("google.generativeai.GenerativeModel")
@patch("google.generativeai.configure")
def test_gemini_service_rate_limit(mock_configure, mock_generative_model, mock_settings):
    mock_model_instance = MagicMock()
    mock_generative_model.return_value = mock_model_instance
    
    mock_model_instance.generate_content.side_effect = google_exceptions.ResourceExhausted("Quota exceeded")
    
    with pytest.raises(AIRateLimitError) as exc_info:
        GeminiService.generate_response("System instruction", [])
    assert "Rate limit exceeded" in exc_info.value.message

@patch("google.generativeai.GenerativeModel")
@patch("google.generativeai.configure")
def test_gemini_service_invalid_key(mock_configure, mock_generative_model, mock_settings):
    mock_model_instance = MagicMock()
    mock_generative_model.return_value = mock_model_instance
    
    mock_model_instance.generate_content.side_effect = google_exceptions.PermissionDenied("Invalid key")
    
    with pytest.raises(AIInvalidRequestError) as exc_info:
        GeminiService.generate_response("System instruction", [])
    assert "Invalid API key" in exc_info.value.message

@patch("google.generativeai.GenerativeModel")
@patch("google.generativeai.configure")
def test_gemini_service_invalid_args(mock_configure, mock_generative_model, mock_settings):
    mock_model_instance = MagicMock()
    mock_generative_model.return_value = mock_model_instance
    
    mock_model_instance.generate_content.side_effect = google_exceptions.InvalidArgument("Invalid argument")
    
    with pytest.raises(AIInvalidRequestError) as exc_info:
        GeminiService.generate_response("System instruction", [])
    assert "Invalid input parameters" in exc_info.value.message

@patch("google.generativeai.GenerativeModel")
@patch("google.generativeai.configure")
def test_gemini_service_general_failure(mock_configure, mock_generative_model, mock_settings):
    mock_model_instance = MagicMock()
    mock_generative_model.return_value = mock_model_instance
    
    mock_model_instance.generate_content.side_effect = google_exceptions.GoogleAPICallError("Unknown google API failure")
    
    with pytest.raises(AIServiceError) as exc_info:
        GeminiService.generate_response("System instruction", [])
    assert "AI Service error" in exc_info.value.message
