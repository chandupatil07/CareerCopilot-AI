import time
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.errors import (
    http_exception_handler,
    validation_exception_handler,
    global_exception_handler
)
from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.users import router as users_router

# Configure system-wide basic logging details
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("app.main")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description=settings.PROJECT_DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Apply CORS middleware policies
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Register global exception handlers
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# Custom telemetry middleware to audit API request performance
@app.middleware("http")
async def audit_requests_middleware(request: Request, call_next):
    start_time = time.perf_counter()
    logger.info(f"HTTP REQUEST START: {request.method} {request.url.path}")
    
    try:
        response = await call_next(request)
        duration = (time.perf_counter() - start_time) * 1000
        logger.info(
            f"HTTP REQUEST END: {request.method} {request.url.path} | "
            f"STATUS: {response.status_code} | "
            f"DURATION: {duration:.2f}ms"
        )
        return response
    except Exception as e:
        duration = (time.perf_counter() - start_time) * 1000
        logger.error(
            f"HTTP REQUEST EXCEPTION: {request.method} {request.url.path} | "
            f"ERROR: {str(e)} | "
            f"DURATION: {duration:.2f}ms"
        )
        raise e

# Mount API routers
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=settings.API_V1_STR + "/auth", tags=["Authentication"])
app.include_router(users_router, prefix=settings.API_V1_STR + "/users", tags=["Users"])

@app.get("/", include_in_schema=False)
def get_root():
    """Redirect default endpoint root to standard Swagger UI page"""
    return RedirectResponse(url="/docs")

@app.on_event("startup")
def log_startup():
    logger.info(f"System booting... Initialized {settings.PROJECT_NAME} version {settings.PROJECT_VERSION} ASGI server.")
