import httpx
import sys

API_URL = "http://localhost:8000/tasks/"

def clear_all_tasks():
    print("Attempting to fetch all tasks...")
    try:
        # Fetch all tasks
        response_get = httpx.get(API_URL)
        response_get.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)
        tasks = response_get.json()
        
        if not tasks:
            print("No tasks found in the database.")
            return

        print(f"Found {len(tasks)} tasks. Proceeding with deletion...")
        
        deleted_count = 0
        failed_count = 0
        
        # Loop through tasks and delete each one
        for task in tasks:
            task_id = task.get('id')
            if task_id is None:
                print(f"Skipping task with missing ID: {task}")
                failed_count += 1
                continue
                
            delete_url = f"{API_URL}{task_id}"
            try:
                print(f"Deleting task ID: {task_id}...")
                response_delete = httpx.delete(delete_url)
                response_delete.raise_for_status()
                deleted_count += 1
            except httpx.HTTPStatusError as e:
                print(f"Error deleting task ID {task_id}: {e.response.status_code} - {e.response.text}")
                failed_count += 1
            except httpx.RequestError as e:
                print(f"Request error deleting task ID {task_id}: {e}")
                failed_count += 1

        print("\n--- Deletion Summary ---")
        print(f"Successfully deleted: {deleted_count}")
        print(f"Failed to delete:     {failed_count}")

    except httpx.HTTPStatusError as e:
        print(f"Error fetching tasks: {e.response.status_code} - {e.response.text}")
        print("Please ensure the backend server is running at http://localhost:8000")
        sys.exit(1)
    except httpx.RequestError as e:
        print(f"Error connecting to the backend: {e}")
        print("Please ensure the backend server is running at http://localhost:8000")
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    clear_all_tasks() 