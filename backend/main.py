from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware # Import CORS middleware
from sqlalchemy.orm import Session
from typing import List

# Use relative imports within the backend package
from . import crud 
from . import models
from . import schemas
from .database import SessionLocal, engine, create_db_tables

# Create DB tables if they don't exist (moved after imports)
# models.Base.metadata.create_all(bind=engine) # <<< Comment this out for now

# CORS Configuration
origins = [
    "http://localhost:3000", # React default port
    # Add any other origins if needed, e.g., deployed frontend URL
]

app = FastAPI(title="Todo List API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"], # Allow all headers
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        pass # db.close() # Let FastAPI handle closing?

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo List API"}

# --- Task Endpoints --- 

@app.post("/tasks/", response_model=schemas.Task)
def create_new_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    """Create a new task."""
    db_task = crud.create_task(db=db, task=task)
    return db_task

@app.get("/tasks/", response_model=List[schemas.Task])
def read_all_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve all tasks."""
    tasks = crud.get_tasks(db, skip=skip, limit=limit)
    return tasks

@app.get("/tasks/{task_id}", response_model=schemas.Task)
def read_single_task(task_id: int, db: Session = Depends(get_db)):
    """Retrieve a single task by ID."""
    db_task = crud.get_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.put("/tasks/{task_id}", response_model=schemas.Task)
def update_existing_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    """Update an existing task."""
    db_task = crud.update_task(db, task_id=task_id, task_update=task)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.delete("/tasks/{task_id}", response_model=schemas.Task)
def delete_existing_task(task_id: int, db: Session = Depends(get_db)):
    """Delete a task."""
    db_task = crud.delete_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task # Return the deleted task data

create_db_tables() 