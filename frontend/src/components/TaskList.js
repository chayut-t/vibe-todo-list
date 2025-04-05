import React from 'react';
// import './TaskList.css'; -- Remove this import
import TaskItem from './TaskItem';

function TaskList({ 
  tasks, 
  toggleComplete, 
  deleteTask, 
  startEdit, 
  saveEdit, 
  cancelEdit, 
  editingTaskId, 
  editText, 
  setEditText 
}) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          toggleComplete={toggleComplete}
          deleteTask={deleteTask}
          startEdit={startEdit}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
          isEditing={editingTaskId === task.id}
          editText={editText}
          setEditText={setEditText}
        />
      ))}
    </ul>
  );
}

export default TaskList; 