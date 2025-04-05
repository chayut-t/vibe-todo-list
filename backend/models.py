from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime
# from sqlalchemy.sql import func # No longer needed for default
from datetime import datetime # Import datetime
from .database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True, index=True)
    # Use Python's utcnow for default and onupdate
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    completed = Column(Boolean, default=False) 