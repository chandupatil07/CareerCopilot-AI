class AIServiceError(Exception):
    """Base exception class for all AI service errors."""
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


class AITimeoutError(AIServiceError):
    """Exception raised when the Gemini API request times out."""
    pass


class AIRateLimitError(AIServiceError):
    """Exception raised when hitting Gemini API rate limits."""
    pass


class AIConnectionError(AIServiceError):
    """Exception raised for network connectivity errors connecting to Gemini."""
    pass


class AIInvalidRequestError(AIServiceError):
    """Exception raised for invalid parameters or bad prompts."""
    pass
