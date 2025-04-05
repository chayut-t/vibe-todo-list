from fastapi import FastAPI # Removed Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware # Import CORS middleware
# Removed Session, List imports as they are no longer used directly here

# Use relative imports within the backend package
from . import crud 
from . import models
from . import schemas
from .database import SessionLocal, engine, create_db_tables
from .routers import tasks # Import the tasks router

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

# Removed get_db dependency function

# Include the tasks router
app.include_router(tasks.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo List API"}

# --- Task Endpoints Removed --- 

# Moved create_db_tables call to the end to ensure app/routers are defined
create_db_tables() 