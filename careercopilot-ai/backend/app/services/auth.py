from typing import Optional, Tuple
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from jose import jwt

from app.repositories.user import user_repo
from app.schemas.user import UserCreate
from app.models.user import User
from app.core.security import (
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token
)

class AuthService:
    """
    AuthService encapsulating registration validation gates, password checking,
    and token refreshing business processes.
    """
    
    @staticmethod
    def register_user(db: Session, user_in: UserCreate) -> User:
        """Validate email uniqueness and register a new candidate account"""
        existing_user = user_repo.get_by_email(db, email=user_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email address already exists.",
            )
        return user_repo.create_user(db, obj_in=user_in)

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Tuple[User, str, str]:
        """Verify user login credentials and return user details and session tokens"""
        user = user_repo.get_by_email(db, email=email)
        if not user or not verify_password(plain_password=password, hashed_password=user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email address or password.",
            )
        
        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(subject=user.id)
        return user, access_token, refresh_token

    @staticmethod
    def refresh_session_token(db: Session, refresh_token: str) -> str:
        """Decode and validate a refresh token to issue a new access token"""
        try:
            payload = decode_token(refresh_token)
            if payload.get("type") != "refresh":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid refresh token claims.",
                )
            user_id = payload.get("sub")
            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid refresh token identity subject.",
                )
        except jwt.JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token validation failed or has expired.",
            )
            
        user = user_repo.get(db, id=int(user_id))
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Target session user not found.",
            )
            
        # Return new access token
        return create_access_token(subject=user.id)
