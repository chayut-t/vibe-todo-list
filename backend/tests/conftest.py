import pytest
import os # Import os module for file operations
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.main import app
from backend.dependencies import get_db # Import get_db from its new location
from backend.database import Base

# Use a file-based SQLite database for integration testing
TEST_DATABASE_FILE = "./test_todo.db"
SQLALCHEMY_DATABASE_URL = f"sqlite:///{TEST_DATABASE_FILE}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    # poolclass=StaticPool, # StaticPool is mainly for :memory:
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Override the get_db dependency to use the test database
def override_get_db():
    database = TestingSessionLocal()
    try:
        yield database
    finally:
        database.close()


# Apply the override to the FastAPI app
app.dependency_overrides[get_db] = override_get_db # Use the imported get_db


# Remove db_session fixture if not strictly needed for integration tests,
# the client fixture handles DB setup/teardown per function.
# @pytest.fixture(scope="function")
# def db_session():
#     Base.metadata.create_all(bind=engine)
#     yield TestingSessionLocal()
#     Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client():
    # Create the database tables before each test
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    # Drop the database tables after each test
    Base.metadata.drop_all(bind=engine)


def pytest_sessionfinish(session, exitstatus):
    """ Clean up the test database file after the session. """
    if os.path.exists(TEST_DATABASE_FILE):
        os.remove(TEST_DATABASE_FILE)
        print(f"\nRemoved test database: {TEST_DATABASE_FILE}") 