from typing import Generic, TypeVar, Type, Optional, List, Any
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.database.base_class import Base

# Declare generic type variables bound to SQLAlchemy base model
ModelType = TypeVar("ModelType", bound=Base)

class BaseRepository(Generic[ModelType]):
    """
    Generic Base Repository encapsulating standard database select structures.
    Uses SQLAlchemy 2.x select() statement execution patterns.
    """
    def __init__(self, model: Type[ModelType]):
        self.model = model

    def get(self, db: Session, id: Any) -> Optional[ModelType]:
        """Fetch a single record by primary key id"""
        query = select(self.model).where(self.model.id == id)
        return db.execute(query).scalar_one_or_none()

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """Fetch list of records with offset and limit parameters"""
        query = select(self.model).offset(skip).limit(limit)
        return list(db.execute(query).scalars().all())
