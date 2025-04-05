from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import argparse # Import argparse
# Import directly from the backend package
from backend.database import DATABASE_URL, create_db_tables
from backend import models

# Create engine (need check_same_thread for SQLite)
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create a session maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def print_task_details(task, show_timestamps=False):
    """Helper function to print task details with optional timestamps."""
    base_info = (
        f"- ID: {task.id}, Title: \"{task.title}\", Completed: {task.completed}"
    )
    desc_str = f", Desc: \"{task.description}\"" if task.description else ""
    cat_str = f", Cat: {task.category}" if task.category else ""
    
    timestamp_info = ""
    if show_timestamps:
        # Access raw values directly if using ORM object, or via index if using raw query tuple
        created_at = getattr(task, 'created_at', 'N/A') 
        updated_at = getattr(task, 'updated_at', 'N/A')
        updated_str = f", Updated: {updated_at}" if updated_at else ""
        timestamp_info = f", Created: {created_at}{updated_str}"
        
    print(f"{base_info}{desc_str}{cat_str}{timestamp_info}")

def main():
    parser = argparse.ArgumentParser(description="Inspect tasks in the database.")
    parser.add_argument("--id", type=int, help="Show details for a specific task ID (includes timestamps).")
    parser.add_argument("--latest", action="store_true", help="Show the latest task (includes timestamps).")
    parser.add_argument("--timestamps", action="store_true", help="Include timestamps in the output for all tasks.")
    args = parser.parse_args()

    print("--- Inspecting Database --- ")
    
    # Ensure tables exist before querying
    # print("Ensuring database tables exist...")
    # create_db_tables() # Usually not needed if backend creates tables
    # print("Tables should exist now.")

    db = SessionLocal()
    try:
        query = db.query(models.Task)
        show_timestamps_flag = args.timestamps

        if args.id:
            task = query.filter(models.Task.id == args.id).first()
            if task:
                print(f"Task with ID {args.id}:")
                print_task_details(task, show_timestamps=True) # Always show timestamps for specific ID
            else:
                print(f"Task with ID {args.id} not found.")
        elif args.latest:
            task = query.order_by(models.Task.id.desc()).first()
            if task:
                print("Latest Task:")
                print_task_details(task, show_timestamps=True) # Always show timestamps for latest
            else:
                print("No tasks found in the database.")
        else:
            # Default: show all tasks
            tasks = query.order_by(models.Task.id).all()
            if not tasks:
                print("No tasks found in the database.")
            else:
                print(f"Found {len(tasks)} task(s):")
                for task in tasks:
                    print_task_details(task, show_timestamps=show_timestamps_flag)
                
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        db.close()
        print("--- Database Inspection Complete ---")

if __name__ == "__main__":
    main() 