import React from 'react';
import './TaskItem.css';

function TaskItem({ 
  task, 
  toggleComplete, 
  deleteTask, 
  startEdit, 
  saveEdit, 
  cancelEdit, 
  isEditing, 
  editText, 
  setEditText 
}) {
  const formattedDate = task.createdAt
    ? `[${task.createdAt.toLocaleString()}]`
    : '';

  const handleSave = () => {
    saveEdit(task.id);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <li className={`task-item ${task.completed ? 'task-item--completed' : ''} ${isEditing ? 'task-item--editing' : ''}`}>
      {isEditing ? (
        // Editing View
        <>
          <input
            type="text"
            className="edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus // Focus the input when editing starts
          />
          <button className="save-button edit-action-button" onClick={handleSave}>Save</button>
          <button className="cancel-button edit-action-button" onClick={cancelEdit}>Cancel</button>
        </>
      ) : (
        // Normal View
        <>
          <input
            type="checkbox"
            className="task-checkbox"
            checked={task.completed}
            onChange={() => toggleComplete(task.id)}
            disabled={isEditing} // Disable checkbox while editing
          />
          <span className="task-title">{task.title}</span>
          <span className="task-timestamp">{formattedDate}</span>
          <button
            className="edit-button action-button"
            onClick={() => startEdit(task)}
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