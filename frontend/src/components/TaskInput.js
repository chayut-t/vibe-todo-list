import React, { useState } from 'react';
import './TaskInput.css';

function TaskInput({ addTask }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return; // Prevent adding empty tasks
    addTask(inputValue);
    setInputValue(''); // Clear input after adding
  };

  return (
    <form className="task-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="task-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a new task..."
      />
      <button type="submit" className="add-button">Add Task</button>
    </form>
  );
}

export default TaskInput; 