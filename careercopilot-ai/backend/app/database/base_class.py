from typing import Any
from sqlalchemy.orm import as_declarative, declared_attr

@as_declarative()
class Base:
    """
    Custom declarative base class for all SQLAlchemy database models.
    Automatically generates table names dynamically from class names.
    """
    id: Any
    __name__: str

    @declared_attr
    def __tablename__(cls) -> str:
        # Converts CamelCase model name to lowercase tablename
        return cls.__name__.lower()
