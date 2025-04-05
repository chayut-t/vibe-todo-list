from fastapi.testclient import TestClient

# No need to import db_session directly if not used in tests, 
# but it's available via conftest.py
# from .conftest import client, db_session 


def test_read_root(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Todo List API"}


def test_create_todo(client: TestClient):
    response = client.post(
        "/tasks/",
        json={"title": "Test Todo", "description": "Test Description"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["description"] == "Test Description"
    assert "id" in data
    assert "created_at" in data
    assert data["completed"] is False


def test_create_todo_missing_title(client: TestClient):
    response = client.post("/tasks/", json={"description": "Test Description"})
    assert response.status_code == 422 # Unprocessable Entity


def test_read_todos_empty(client: TestClient):
    response = client.get("/tasks/")
    assert response.status_code == 200
    assert response.json() == []


def test_read_todos_with_data(client: TestClient):
    # Create a todo first
    client.post("/tasks/", json={"title": "First Todo", "description": "First Desc"})
    client.post("/tasks/", json={"title": "Second Todo"})

    response = client.get("/tasks/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["title"] == "First Todo"
    assert data[1]["title"] == "Second Todo"


def test_read_todo_by_id(client: TestClient):
    # Create a todo
    create_response = client.post("/tasks/", json={"title": "Specific Todo"})
    todo_id = create_response.json()["id"]

    response = client.get(f"/tasks/{todo_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Specific Todo"
    assert data["id"] == todo_id


def test_read_todo_not_found(client: TestClient):
    response = client.get("/tasks/99999") # Use an ID that likely doesn't exist
    assert response.status_code == 404
    assert response.json() == {"detail": "Task not found"}

# Add more tests here for update, delete, etc. 