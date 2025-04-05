from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

# Change back to relative imports for simpler structure
from .. import crud
from .. import schemas
# from ..database import SessionLocal # No longer needed directly
from ..dependencies import get_db # Import from dependencies module

# Dependency to get DB session (can be defined here or imported from main/dependencies)
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

router = APIRouter(
    prefix="/tasks", # Prefix for all routes in this router
    tags=["tasks"], # Tag for OpenAPI documentation
    # dependencies=[Depends(get_db)], # Can add dependencies for the whole router
    responses={404: {"description": "Not found"}}, # Default responses
)


@router.post("/", response_model=schemas.Task)
def create_new_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    """Create a new task."""
    return crud.create_task(db=db, task=task)


@router.get("/", response_model=List[schemas.Task])
def read_all_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve all tasks."""
    tasks = crud.get_tasks(db, skip=skip, limit=limit)
    return tasks


@router.get("/{task_id}", response_model=schemas.Task)
def read_single_task(task_id: int, db: Session = Depends(get_db)):
    """Retrieve a single task by ID."""
    db_task = crud.get_task(db, task_id=task_id)
    if db_task is None:
        # Use the router's default 404 or raise specific one
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


@router.put("/{task_id}", response_model=schemas.Task)
def update_existing_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    """Update an existing task."""
    db_task = crud.update_task(db, task_id=task_id, task_update=task)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


@router.delete("/{task_id}", response_model=schemas.Task)
def delete_existing_task(task_id: int, db: Session = Depends(get_db)):
    """Delete a task."""
    db_task = crud.delete_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task # Return the deleted task data 