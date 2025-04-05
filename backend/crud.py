from sqlalchemy.orm import Session
from . import models
from . import schemas
from typing import List, Optional
import logging # Import logging

# Configure basic logging
logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

def get_task(db: Session, task_id: int) -> Optional[models.Task]:
    """Gets a single task by ID."""
    return db.query(models.Task).filter(models.Task.id == task_id).first()

def get_tasks(db: Session, skip: int = 0, limit: int = 100) -> List[models.Task]:
    """Gets all tasks with optional pagination."""
    return db.query(models.Task).offset(skip).limit(limit).all()

def create_task(db: Session, task: schemas.TaskCreate) -> models.Task:
    """Creates a new task in the database."""
    log.info(f"Attempting to create task with title: {task.title}")
    db_task = models.Task(**task.model_dump())
    try:
        db.add(db_task)
        log.info("Task added to session.")
        db.commit()
        log.info("Session committed.")
        db.refresh(db_task)
        log.info(f"Task created with ID: {db_task.id}")
        return db_task
    except Exception as e:
        log.error(f"Error during task creation: {e}")
        db.rollback() # Rollback session on error
        raise # Re-raise the exception for FastAPI to handle

def update_task(db: Session, task_id: int, task_update: schemas.TaskUpdate) -> Optional[models.Task]:
    """Updates an existing task."""
    db_task = get_task(db, task_id)
    if not db_task:
        return None

    # Get update data, excluding unset values
    update_data = task_update.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_task, key, value)

    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int) -> Optional[models.Task]:
    """Deletes a task."""
    db_task = get_task(db, task_id)
    if not db_task:
        return None
    db.delete(db_task)
    db.commit()
    return db_task 