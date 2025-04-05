# Vibe Todo List

Welcome to Vibe Todo List! A clean, intuitive, and aesthetically pleasing to-do list application inspired by the Apple Notes app. Our goal is to provide a minimalistic yet powerful tool for managing your tasks effectively.

## ✨ Key Features

*   **Simple Task Management:** Easily create, read, update, and delete your tasks.
*   **Mark Completion:** Track your progress by marking tasks as complete or incomplete.
*   **Organization:** Categorize or tag your tasks to keep them organized.
*   **Quick Search:** Find tasks instantly by searching through titles, descriptions, or categories.
*   **Notes Style:** Enjoy basic text formatting similar to Apple Notes for richer task details.
*   **Responsive Design:** Use the app seamlessly on both desktop and mobile devices.

## 🚀 Technology

*   **Frontend:** Built with React for a smooth and interactive user experience.
*   **Backend:** Powered by Python with FastAPI for fast and reliable performance.

## 📦 Backend Deployment

To deploy the backend server, follow these steps:

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment (optional but recommended):**
    ```bash
    python -m venv venv
    # On Windows
    # venv\\Scripts\\activate
    # On macOS/Linux
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the FastAPI application using Uvicorn:**
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ```
    The backend API will be available at `http://localhost:8000`.

## ⚛️ Frontend Deployment

To run the frontend application, follow these steps:

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the React development server:**
    ```bash
    npm start
    ```
    The frontend application will be available at `http://localhost:3000`.

    For a production build, use:
    ```bash
    npm run build
    ```

We hope Vibe Todo List helps you stay organized and focused! 