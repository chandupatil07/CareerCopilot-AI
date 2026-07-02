from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.repositories.base import BaseRepository
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

class UserRepository(BaseRepository[User]):
    """
    UserRepository managing database query operations for the User table.
    """
    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        """Fetch user by unique email address"""
        query = select(self.model).where(self.model.email == email)
        return db.execute(query).scalar_one_or_none()

    def create_user(self, db: Session, *, obj_in: UserCreate) -> User:
        """Create a new User record, applying bcrypt password hashing before inserting"""
        db_obj = User(
            full_name=obj_in.full_name,
            email=obj_in.email,
            password_hash=get_password_hash(obj_in.password),
            phone=obj_in.phone,
            profile_image=obj_in.profile_image,
            college=obj_in.college,
            degree=obj_in.degree,
            branch=obj_in.branch,
            graduation_year=obj_in.graduation_year,
            linkedin_url=obj_in.linkedin_url,
            github_url=obj_in.github_url,
            portfolio_url=obj_in.portfolio_url
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_password(self, db: Session, *, user_id: int, new_password: str) -> Optional[User]:
        """Update user credentials by applying a new hashed password"""
        user = self.get(db, user_id)
        if not user:
            return None
        user.password_hash = get_password_hash(new_password)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

user_repo = UserRepository(User)
