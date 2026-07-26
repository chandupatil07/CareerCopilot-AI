from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "CareerCopilot AI"
    PROJECT_VERSION: str = "1.0.0"
    PROJECT_DESCRIPTION: str = "Scalable backend API foundation for career progression acceleration and SaaS dashboard tracking."

    # CORS configurations allowing React frontend origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "https://career-copilot-ai-cyan.vercel.app",
         "https://career-copilot-ai-t5xa.vercel.app"  #this is added due to issue at frontend using tools
    ]

    # Database connection parameters parsed dynamically from environment
    DATABASE_URL: str = ""

    # JWT Authentication Parameters
    JWT_SECRET: str = "" # Fail-safe dynamic environment variable, empty default to avoid checking in credentials
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # File Upload Directory
    UPLOAD_DIR: str = "uploads"

    # Gemini API configurations
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.0-flash"
    GEMINI_TIMEOUT_SECONDS: int = 15
    GEMINI_MAX_HISTORY_MESSAGES: int = 20


    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
