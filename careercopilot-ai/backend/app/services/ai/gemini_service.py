import logging
import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from app.core.config import settings
from app.services.ai.ai_exceptions import (
    AIServiceError,
    AITimeoutError,
    AIRateLimitError,
    AIConnectionError,
    AIInvalidRequestError
)

logger = logging.getLogger("app.services.ai.gemini_service")

class GeminiService:
    """
    Service wrapper for Google Gemini API execution.
    Handles client initialization, timeouts, rate-limiting, backoffs, and exception mapping.
    """
    _initialized = False

    @classmethod
    def _initialize_client(cls):
        """
        Verify presence of API key and configure standard Gemini client.
        """
        if cls._initialized:
            return

        api_key = settings.GEMINI_API_KEY
        if not api_key:
            logger.error("GEMINI_API_KEY is not set in settings or environment variables.")
            raise AIInvalidRequestError("Gemini API key is missing. Please set the GEMINI_API_KEY environment variable.")
        
        genai.configure(api_key=api_key)
        cls._initialized = True

    @classmethod
    @retry(
        reraise=True,
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((
            google_exceptions.ResourceExhausted,
            google_exceptions.ServiceUnavailable,
            google_exceptions.InternalServerError
        ))
    )
    def _call_gemini_api(cls, model_name: str, system_instruction: str, contents: list) -> str:
        """
        Executes raw generative model call with tenacity retry wrappers on transient Google errors.
        """
        cls._initialize_client()
        
        try:
            model = genai.GenerativeModel(
                model_name=model_name,
                system_instruction=system_instruction
            )
            
            # Setup timeout request options
            timeout = float(settings.GEMINI_TIMEOUT_SECONDS)
            response = model.generate_content(
                contents,
                request_options={"timeout": timeout}
            )
            
            if not response or not response.text:
                return ""
            return response.text

        except google_exceptions.DeadlineExceeded as e:
            logger.error(f"Gemini API request timed out: {e}")
            raise AITimeoutError("The connection to the AI service timed out.") from e

        except google_exceptions.ResourceExhausted as e:
            logger.warning(f"Gemini API rate limit exceeded: {e}")
            raise AIRateLimitError("Rate limit exceeded for the AI assistant. Please try again in a few moments.") from e

        except google_exceptions.PermissionDenied as e:
            logger.error(f"Gemini API key or access denied: {e}")
            raise AIInvalidRequestError("Invalid API key or access permission denied.") from e

        except google_exceptions.InvalidArgument as e:
            logger.error(f"Gemini API invalid argument error: {e}")
            raise AIInvalidRequestError(f"Invalid input parameters sent to Gemini: {e}") from e

        except (google_exceptions.ServiceUnavailable, google_exceptions.InternalServerError) as e:
            logger.error(f"Gemini API server side error: {e}")
            raise AIConnectionError("The AI service is temporarily unavailable.") from e

        except google_exceptions.GoogleAPICallError as e:
            logger.error(f"Gemini API general call error: {e}")
            raise AIServiceError(f"AI Service error encountered: {e}") from e

        except Exception as e:
            logger.error(f"Unexpected error communicating with Gemini API: {e}")
            raise AIServiceError("An unexpected error occurred while communicating with the AI service.") from e

    @classmethod
    def generate_response(cls, system_instruction: str, contents: list) -> str:
        """
        Public endpoint wrapper to run generative queries on Gemini.
        Catches mapped exceptions to cleanly return errors or log diagnostics.
        """
        model_name = settings.GEMINI_MODEL or "gemini-1.5-flash"
        
        try:
            return cls._call_gemini_api(
                model_name=model_name,
                system_instruction=system_instruction,
                contents=contents
            )
        except (AITimeoutError, AIRateLimitError, AIConnectionError, AIInvalidRequestError, AIServiceError):
            # Already mapped, reraise to let caller service layers handle
            raise
        except Exception as e:
            logger.error(f"Unhandled error mapped in gemini service layer: {e}")
            raise AIServiceError("An unexpected error occurred in the AI service layer.") from e
