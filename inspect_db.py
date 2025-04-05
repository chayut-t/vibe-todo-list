from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
# Import directly from the backend package
from backend.database import DATABASE_URL, create_db_tables
from backend import models

# Create engine (need check_same_thread for SQLite)
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create a session maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def main():
    print("--- Inspecting Database --- ")
    
    # Ensure tables exist before querying
    # print("Ensuring database tables exist...")
    # create_db_tables() # Usually not needed if backend creates tables
    # print("Tables should exist now.")

    db = SessionLocal()
    try:
        tasks = db.query(models.Task).order_by(models.Task.id).all()
        
        if not tasks:
            print("No tasks found in the database.")
        else:
            print(f"Found {len(tasks)} task(s):")
            for task in tasks:
                # Assign parts to variables for cleaner f-string
                updated_str = f", Updated: {task.updated_at}" if task.updated_at else ""
                desc_str = f", Desc: \"{task.description}\"" if task.description else ""
                cat_str = f", Cat: {task.category}" if task.category else ""

                print(
                    f"- ID: {task.id}, Title: \"{task.title}\", Completed: {task.completed}, "
                    f"Created: {task.created_at}{updated_str}{desc_str}{cat_str}"
                )
                
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        db.close()
        print("--- Database Inspection Complete ---")

if __name__ == "__main__":
    main() 