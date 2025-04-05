import React from 'react'; // Removed useState
import './App.css';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import { useTaskManager } from './hooks/useTaskManager'; // Import the custom hook

// API_URL is now defined within the hook

function App() {
  const {
    tasks,
    isLoading,
    error,
    addTask, // Get action functions from hook
    toggleComplete,
    deleteTask,
    saveEdit
  } = useTaskManager();

  // Local UI state for editing REMOVED
  // const [editingTaskId, setEditingTaskId] = useState(null);
  // const [editText, setEditText] = useState('');

  // Edit Handling Functions REMOVED (logic moved to TaskItem)
  // const startEdit = (task) => { ... };
  // const handleSaveEdit = async (taskId) => { ... };
  // const cancelEdit = () => { ... };

  // Wrapper for toggle complete REMOVED (TaskItem now passes necessary info)
  // const handleToggleComplete = (taskId) => { ... };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo List</h1>
      </header>
      <main className="App-content">
        {error && <p className="error-message">{error}</p>}
        <TaskInput addTask={addTask} />
        {isLoading ? (
          <p>Loading tasks...</p>
        ) : (
          <TaskList
            tasks={tasks}
            // Pass down functions directly from hook
            toggleComplete={toggleComplete} 
            deleteTask={deleteTask} 
            saveEdit={saveEdit} // Pass saveEdit directly
            // Removed props related to App-level edit state:
            // startEdit, cancelEdit, editingTaskId, editText, setEditText
          />
        )}
      </main>
    </div>
  );
}

export default App; 