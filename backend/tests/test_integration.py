from fastapi.testclient import TestClient

def test_full_task_lifecycle(client: TestClient):
    """ Tests creating, reading, updating, and deleting a task. """
    # 1. Create a task
    create_response = client.post(
        "/tasks/",
        json={"title": "Integration Test Task", "description": "Lifecycle test"}
    )
    assert create_response.status_code == 200
    task_data = create_response.json()
    task_id = task_data["id"]
    assert task_data["title"] == "Integration Test Task"
    assert task_data["completed"] is False

    # 2. Read the created task by ID
    read_response = client.get(f"/tasks/{task_id}")
    assert read_response.status_code == 200
    read_data = read_response.json()
    assert read_data["id"] == task_id
    assert read_data["title"] == "Integration Test Task"
    assert read_data["description"] == "Lifecycle test"
    assert read_data["completed"] is False

    # 3. Update the task (e.g., change title and mark as complete)
    update_response = client.put(
        f"/tasks/{task_id}",
        json={"title": "Updated Integration Task", "completed": True}
    )
    assert update_response.status_code == 200
    update_data = update_response.json()
    assert update_data["id"] == task_id
    assert update_data["title"] == "Updated Integration Task"
    assert update_data["description"] == "Lifecycle test" # Description should persist
    assert update_data["completed"] is True

    # 4. Read the updated task again to verify persistence
    read_again_response = client.get(f"/tasks/{task_id}")
    assert read_again_response.status_code == 200
    read_again_data = read_again_response.json()
    assert read_again_data["title"] == "Updated Integration Task"
    assert read_again_data["completed"] is True

    # 5. Read all tasks to ensure our updated task is there
    get_all_response = client.get("/tasks/")
    assert get_all_response.status_code == 200
    all_tasks = get_all_response.json()
    assert len(all_tasks) == 1
    assert all_tasks[0]["id"] == task_id
    assert all_tasks[0]["title"] == "Updated Integration Task"

    # 6. Delete the task
    delete_response = client.delete(f"/tasks/{task_id}")
    assert delete_response.status_code == 200
    deleted_data = delete_response.json()
    assert deleted_data["id"] == task_id # Verify the correct task was returned

    # 7. Try to read the deleted task (should be 404)
    read_deleted_response = client.get(f"/tasks/{task_id}")
    assert read_deleted_response.status_code == 404
    assert read_deleted_response.json() == {"detail": "Task not found"}

    # 8. Read all tasks again (should be empty)
    get_all_empty_response = client.get("/tasks/")
    assert get_all_empty_response.status_code == 200
    assert get_all_empty_response.json() == [] 