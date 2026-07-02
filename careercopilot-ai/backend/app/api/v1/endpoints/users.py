from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.schemas.user import User
from app.models.user import User as UserModel

router = APIRouter()

@router.get("/me", response_model=User, summary="Get Current User Profile")
def get_me(current_user: UserModel = Depends(get_current_user)) -> User:
    """
    Retrieve authenticated details of the current candidate session.
    """
    return current_user
