import React from 'react';
// import './TaskList.css'; -- Remove this import
import TaskItem from './TaskItem';

function TaskList({ 
  tasks, 
  toggleComplete, 
  deleteTask, 
  saveEdit, 
}) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          toggleComplete={toggleComplete}
          deleteTask={deleteTask}
          saveEdit={saveEdit}
        />
      ))}
    </ul>
  );
}

export default TaskList; 