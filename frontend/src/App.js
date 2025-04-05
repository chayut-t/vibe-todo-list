import React, { useState } from 'react';
import './App.css';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState([]); // Initialize with empty array

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
    setTasks(
      tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo List</h1>
      </header>
      <main className="App-content">
        <TaskInput addTask={addTask} />
        <TaskList tasks={tasks} toggleComplete={toggleComplete} />
      </main>
    </div>
  );
}

export default App; 