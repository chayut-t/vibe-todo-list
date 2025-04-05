from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

# Base model for common task attributes
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    completed: bool = False

# Schema for creating a task (inherits from Base, adds specific fields if needed)
class TaskCreate(TaskBase):
    pass # No additional fields needed for creation currently

# Schema for updating a task (all fields optional)
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    completed: Optional[bool] = None

# Schema for reading/returning a task (includes DB-generated fields)
class Task(TaskBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None # updated_at might be null initially

    # Pydantic V2 config for ORM mode
    model_config = ConfigDict(
        from_attributes=True 
    ) 