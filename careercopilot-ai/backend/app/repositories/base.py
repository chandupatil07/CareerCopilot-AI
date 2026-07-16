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

    def create(self, db: Session, *, obj_in: Any) -> ModelType:
        """Create a new database record using Pydantic schema or dictionary mappings"""
        if isinstance(obj_in, dict):
            db_obj_data = obj_in
        else:
            db_obj_data = obj_in.model_dump(exclude_unset=True)
            
        db_obj = self.model(**db_obj_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: ModelType, obj_in: Any) -> ModelType:
        """Update a database record with new field key-value mappings"""
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
            
        for field in update_data:
            if hasattr(db_obj, field):
                setattr(db_obj, field, update_data[field])
                
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: Any) -> Optional[ModelType]:
        """Purge a database record from the system by ID"""
        query = select(self.model).where(self.model.id == id)
        db_obj = db.execute(query).scalar_one_or_none()
        if db_obj:
            db.delete(db_obj)
            db.commit()
        return db_obj

