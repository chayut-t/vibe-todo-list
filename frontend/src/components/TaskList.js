import React from 'react';
import './TaskList.css';
import TaskItem from './TaskItem';

function TaskList({ tasks, toggleComplete }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          toggleComplete={toggleComplete}
        />
      ))}
    </ul>
  );
}

export default TaskList; 