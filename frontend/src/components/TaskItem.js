import React from 'react';
import './TaskItem.css';

function TaskItem({ task, toggleComplete }) {
  const formattedDate = task.createdAt
    ? `[${task.createdAt.toLocaleString()}]`
    : ''; // Handle case where date might not exist for older tasks

  return (
    <li className={`task-item ${task.completed ? 'task-item--completed' : ''}`}>
      <input
        type="checkbox"
        className="task-checkbox"
        checked={task.completed}
        onChange={() => toggleComplete(task.id)}
      />
      <span className="task-title">{task.title}</span>
      <span className="task-timestamp">{formattedDate}</span>
      {/* Add delete button later */}
    </li>
  );
}

export default TaskItem; 