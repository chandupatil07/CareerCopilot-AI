import secrets
import logging
from datetime import datetime, timedelta
from typing import Any, Union
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

logger = logging.getLogger("app.core.security")

# Initialize passlib CryptContext using bcrypt work factor
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

jwt_secret = settings.JWT_SECRET
if not jwt_secret:
    logger.warning("JWT_SECRET is not configured in settings. Generating transient secret key for this process cycle.")
    jwt_secret = secrets.token_hex(32)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compare plain text credentials with database password hash using bcrypt"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate bcrypt password hash with auto-generated salt"""
    return pwd_context.hash(password)

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    """
    Generate signed JWT access token.
    Defaults to ACCESS_TOKEN_EXPIRE_MINUTES configuration.
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject), "type": "access"}
    encoded_jwt = jwt.encode(to_encode, jwt_secret, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    """
    Generate signed JWT refresh token.
    Defaults to REFRESH_TOKEN_EXPIRE_DAYS configuration.
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode = {"exp": expire, "sub": str(subject), "type": "refresh"}
    encoded_jwt = jwt.encode(to_encode, jwt_secret, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    """Decode JWT token claims, validating signature and expiration tags"""
    try:
        decoded_payload = jwt.decode(token, jwt_secret, algorithms=[settings.ALGORITHM])
        return decoded_payload
    except jwt.ExpiredSignatureError:
        logger.error("JWT token verification failed: expired signature.")
        raise
    except jwt.JWTError as e:
        logger.error(f"JWT token decode exception: {str(e)}")
        raise
