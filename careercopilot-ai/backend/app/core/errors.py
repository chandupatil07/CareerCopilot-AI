import logging
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("app.core.errors")

async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Intercept and standardize standard HTTPExceptions"""
    logger.error(f"HTTP exception on {request.method} {request.url.path}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "error_code": f"HTTP_{exc.status_code}"
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Intercept and standardize schema payload validation failures"""
    logger.error(f"Validation error on {request.method} {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "Request payload schema validation failed",
            "errors": exc.errors(),
            "error_code": "SCHEMA_VALIDATION_FAILED"
        }
    )

async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all for unhandled system runtimes returning consistent JSON response"""
    logger.exception(f"Unhandled system runtime exception on {request.method} {request.url.path}: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An internal system runtime error occurred. Please consult backend logs.",
            "error_code": "INTERNAL_SYSTEM_ERROR"
        }
    )
