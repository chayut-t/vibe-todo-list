import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './TaskItem.css';

function TaskItem({ 
  task, 
  toggleComplete, 
  deleteTask, 
  saveEdit,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditText, setCurrentEditText] = useState(task.title);

  useEffect(() => {
    if (!isEditing) {
        setCurrentEditText(task.title);
    }
  }, [task.title, isEditing]);

  const formattedDate = task.createdAt instanceof Date && !isNaN(task.createdAt)
    ? format(task.createdAt, 'Pp')
    : 'Invalid date';

  const handleStartEdit = () => {
      setCurrentEditText(task.title);
      setIsEditing(true);
  };

  const handleCancelEdit = () => {
      setIsEditing(false);
  };

  const handleSave = () => {
    if (currentEditText.trim() === '') {
        handleCancelEdit();
        return;
    }
    saveEdit(task.id, currentEditText);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <li className={`task-item ${task.completed ? 'task-item--completed' : ''} ${isEditing ? 'task-item--editing' : ''}`}>
      {isEditing ? (
        <>
          <input
            type="text"
            className="edit-input"
            value={currentEditText}
            onChange={(e) => setCurrentEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button className="save-button edit-action-button" onClick={handleSave}>Save</button>
          <button className="cancel-button edit-action-button" onClick={handleCancelEdit}>Cancel</button>
        </>
      ) : (
        <>
          <input
            type="checkbox"
            className="task-checkbox"
            checked={task.completed}
            onChange={() => toggleComplete(task.id, task.completed)}
            disabled={isEditing}
          />
          <span className="task-title">{task.title}</span>
          <span className="task-timestamp">[{formattedDate}]</span>
          <button
            className="edit-button action-button"
            onClick={handleStartEdit}
            aria-label="Edit task"
            disabled={isEditing}
          >
            ✏️
          </button>
          <button
            className="delete-button action-button"
            onClick={() => deleteTask(task.id)}
            aria-label="Delete task"
            disabled={isEditing}
          >
            🗑️
          </button>
        </>
      )}
    </li>
  );
}

export default TaskItem; 