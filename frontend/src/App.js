import React, { useState } from 'react';
import './App.css';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState([]); // Initialize with empty array
  const [editingTaskId, setEditingTaskId] = useState(null); // Track which task is being edited
  const [editText, setEditText] = useState(''); // Store the text being edited

  // Function to add a new task
  const addTask = (taskTitle) => {
    const newTask = {
      id: Date.now(),
      title: taskTitle,
      completed: false,
      createdAt: new Date()
    };
    setTasks([...tasks, newTask]);
  };

  // Function to toggle task completion status
  const toggleComplete = (taskId) => {
    // Prevent toggling complete while editing
    if (editingTaskId === taskId) return;
    setTasks(
      tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Function to delete a task
  const deleteTask = (taskId) => {
    // Prevent deleting while editing this task
    if (editingTaskId === taskId) return;
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Function to start editing a task
  const startEdit = (task) => {
    setEditingTaskId(task.id);
    setEditText(task.title);
  };

  // Function to save the edited task
  const saveEdit = (taskId) => {
    if (editText.trim() === '') return; // Prevent saving empty title
    setTasks(
      tasks.map(task =>
        task.id === taskId ? { ...task, title: editText } : task
      )
    );
    setEditingTaskId(null); // Exit editing mode
    setEditText('');
  };

  // Function to cancel editing
  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditText('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo List</h1>
      </header>
      <main className="App-content">
        <TaskInput addTask={addTask} />
        <TaskList
          tasks={tasks}
          toggleComplete={toggleComplete}
          deleteTask={deleteTask}
          startEdit={startEdit}       // Pass startEdit
          saveEdit={saveEdit}         // Pass saveEdit
          cancelEdit={cancelEdit}     // Pass cancelEdit
          editingTaskId={editingTaskId} // Pass editingTaskId
          editText={editText}         // Pass editText
          setEditText={setEditText}   // Pass setEditText
        />
      </main>
    </div>
  );
}

export default App; 