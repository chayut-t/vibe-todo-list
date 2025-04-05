import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Import axios
import './App.css';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';

// Define the backend API base URL
const API_URL = 'http://localhost:8000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState(null); // Add error state
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Fetch tasks from backend on component mount
  const fetchTasks = useCallback(async () => {
    // Only set loading true on initial fetch potentially
    // setError(null); // Clear errors before fetch
    // setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/tasks/`);
      // Ensure createdAt is a Date object (JSON doesn't preserve type)
      const tasksWithDate = response.data.map(task => ({
        ...task,
        createdAt: new Date(task.created_at) // Convert string back to Date
      }));
      setTasks(tasksWithDate);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please ensure the backend is running.");
    } finally {
      setIsLoading(false); // Stop loading indicator regardless of success/fail
    }
  }, []); // Dependency array includes things fetchTasks depends on (none here)

  // Initial fetch on mount
  useEffect(() => {
    setIsLoading(true); // Set loading true for initial fetch
    setError(null);
    fetchTasks();
  }, [fetchTasks]);

  // --- API Interaction Functions --- 

  const addTask = async (taskTitle) => {
    setError(null);
    try {
      await axios.post(`${API_URL}/tasks/`, { title: taskTitle });
      await fetchTasks(); // Refetch the list after successful add
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Failed to add task.");
    }
  };

  const toggleComplete = async (taskId) => {
    if (editingTaskId === taskId) return;
    setError(null);
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      await axios.put(`${API_URL}/tasks/${taskId}`, { completed: !task.completed });
      await fetchTasks(); // Refetch the list after successful update
    } catch (err) {
      console.error("Error updating task completion:", err);
      setError("Failed to update task status.");
    }
  };

  const deleteTask = async (taskId) => {
    if (editingTaskId === taskId) return;
    setError(null);
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      await fetchTasks(); // Refetch the list after successful delete
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task.");
    }
  };

  const startEdit = (task) => {
    // This is purely UI state, no API call needed
    setEditingTaskId(task.id);
    setEditText(task.title);
  };

  const saveEdit = async (taskId) => {
    if (editText.trim() === '') return;
    setError(null);
    try {
      await axios.put(`${API_URL}/tasks/${taskId}`, { title: editText });
      setEditingTaskId(null); // Exit editing mode first
      setEditText('');
      await fetchTasks(); // Refetch the list after successful save
    } catch (err) {
      console.error("Error saving task edit:", err);
      setError("Failed to save edit.");
    }
  };

  const cancelEdit = () => {
    // This is purely UI state
    setEditingTaskId(null);
    setEditText('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo List</h1>
      </header>
      <main className="App-content">
        {/* Display error message if exists */}
        {error && <p className="error-message">{error}</p>}
        <TaskInput addTask={addTask} />
        {isLoading ? (
          <p>Loading tasks...</p> // Basic loading indicator
        ) : (
          <TaskList
            tasks={tasks}
            toggleComplete={toggleComplete}
            deleteTask={deleteTask}
            startEdit={startEdit}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            editingTaskId={editingTaskId}
            editText={editText}
            setEditText={setEditText}
          />
        )}
      </main>
    </div>
  );
}

export default App; 