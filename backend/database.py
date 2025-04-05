from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Use relative path, assuming server/script runs from project root
DATABASE_URL = "sqlite:///todo.db"

# include check_same_thread: False for SQLite only
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def create_db_tables():
    # Create tables based on models that inherit from Base
    Base.metadata.create_all(bind=engine) 