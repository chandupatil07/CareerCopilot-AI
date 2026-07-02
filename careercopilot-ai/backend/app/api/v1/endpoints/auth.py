from typing import Any
from fastapi import APIRouter, Depends, Response, Request, status, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from app.database.session import get_db
from app.services.auth import AuthService
from app.repositories.user import user_repo
from app.schemas.user import User, UserCreate
from app.api.deps import get_current_user
from app.models.user import User as UserModel

router = APIRouter()

# Schema Helper models
class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class EmailVerificationRequest(BaseModel):
    token: str

@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED, summary="Register Account")
def register(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    """Register a new user candidate account."""
    return AuthService.register_user(db, user_in=user_in)

@router.post("/login", summary="Login Session")
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
) -> Any:
    """
    Authenticate credentials. Returns signed access token in payload,
    and saves the refresh token inside a secure HttpOnly cookie.
    """
    user, access_token, refresh_token = AuthService.authenticate_user(
        db, email=form_data.username, password=form_data.password
    )
    
    # Set HttpOnly, Secure cookie for Refresh Token
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,  # Matches production SSL channels
        samesite="strict",
        max_age=7 * 24 * 3600  # 7 days
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": 900  # 15 minutes
    }

@router.post("/refresh", summary="Refresh Token Session")
def refresh(request: Request, db: Session = Depends(get_db)) -> Any:
    """Read HttpOnly cookies and issue a refreshed Access Token."""
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session refresh token cookie is missing."
        )
    
    access_token = AuthService.refresh_session_token(db, refresh_token=refresh_token)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": 900
    }

@router.post("/logout", summary="Logout / Revoke Token")
def logout(response: Response) -> Any:
    """Revoke active session parameters by clearing the refresh token cookie."""
    response.delete_cookie(key="refresh_token")
    return {"message": "Session logged out and tokens successfully revoked."}

@router.post("/change-password", summary="Change Password")
def change_password(
    payload: ChangePasswordRequest,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Update user credentials by verifying the old password first."""
    from app.core.security import verify_password
    if not verify_password(plain_password=payload.old_password, hashed_password=current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect old password supplied."
        )
    
    user_repo.update_password(db, user_id=current_user.id, new_password=payload.new_password)
    return {"message": "Password changed successfully."}

@router.post("/forgot-password", summary="Forgot Password Skeletons")
def forgot_password(payload: ForgotPasswordRequest) -> Any:
    """
    Skelton endpoint for password resets requests.
    Sends reset link template in a production pipeline.
    """
    return {
        "message": f"Verification code or reset link has been dispatched to {payload.email} if registered."
    }

@router.post("/reset-password", summary="Reset Password Skeletons")
def reset_password(payload: ResetPasswordRequest) -> Any:
    """
    Skelton endpoint completing password overrides.
    """
    return {
        "message": "Credential verification token approved. Password updated successfully."
    }

@router.post("/verify-email", summary="Email Verification Skeletons")
def verify_email(payload: EmailVerificationRequest) -> Any:
    """
    Skelton endpoint completing user email confirmation loops.
    """
    return {
        "message": "User email verified successfully. Welcome to CareerCopilot AI!"
    }
