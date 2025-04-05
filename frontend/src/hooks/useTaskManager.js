import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Keep API URL definition here

export function useTaskManager() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/tasks/`);
      const tasksWithDate = response.data.map(task => {
        // Ensure incoming string is treated as UTC by appending 'Z'
        const utcCreatedAtString = task.created_at + 'Z';
        return {
            ...task,
            createdAt: new Date(utcCreatedAtString) // Parse as UTC
        };
      });
      setTasks(tasksWithDate);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (taskTitle) => {
    setError(null);
    try {
      await axios.post(`${API_URL}/tasks/`, { title: taskTitle });
      await fetchTasks(); 
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Failed to add task.");
      throw err; // Re-throw error for potential handling in component
    }
  };

  const toggleComplete = async (taskId, currentStatus) => {
    setError(null);
    try {
      await axios.put(`${API_URL}/tasks/${taskId}`, { completed: !currentStatus });
      await fetchTasks(); 
    } catch (err) {
      console.error("Error updating task completion:", err);
      setError("Failed to update task status.");
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    setError(null);
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      await fetchTasks(); 
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task.");
      throw err;
    }
  };

  const saveEdit = async (taskId, newTitle) => {
     if (newTitle.trim() === '') {
       setError("Task title cannot be empty.");
       return; // Or throw an error
     }
    setError(null);
    try {
      await axios.put(`${API_URL}/tasks/${taskId}`, { title: newTitle });
      await fetchTasks(); 
    } catch (err) {
      console.error("Error saving task edit:", err);
      setError("Failed to save edit.");
      throw err;
    }
  };

  // Return state and action functions
  return {
    tasks,
    isLoading,
    error,
    fetchTasks, // Expose fetchTasks if manual refresh is needed
    addTask,
    toggleComplete,
    deleteTask,
    saveEdit
  };
} 