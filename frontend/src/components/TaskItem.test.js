import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskItem from './TaskItem';

// Mock props
const mockToggleComplete = jest.fn();
const mockDeleteTask = jest.fn();
const mockSaveEdit = jest.fn();

const baseTask = {
  id: 1,
  title: 'Test Task Title',
  completed: false,
  created_at: new Date().toISOString(), // Ensure it's a string like from API initially
  // Convert string to Date object within the component or hook
};

describe('TaskItem Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockToggleComplete.mockClear();
    mockDeleteTask.mockClear();
    mockSaveEdit.mockClear();
    // Convert date string to Date object for rendering consistency
    baseTask.createdAt = new Date(baseTask.created_at);
  });

  it('renders task details correctly in normal view', () => {
    render(
      <TaskItem 
        task={baseTask} 
        toggleComplete={mockToggleComplete} 
        deleteTask={mockDeleteTask} 
        saveEdit={mockSaveEdit} 
      />
    );

    expect(screen.getByText(baseTask.title)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(screen.getByLabelText(/edit task/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/delete task/i)).toBeInTheDocument();
    // Check for the specific format from date-fns 'Pp'
    // Example: [04/05/2025, 2:55 PM] (No seconds)
    // Regex accounts for 1 or 2 digit month/day/hour
    expect(screen.getByText(/\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2} (AM|PM)/i)).toBeInTheDocument();
  });

  it('renders completed task correctly', () => {
    const completedTask = { ...baseTask, completed: true };
    render(
      <TaskItem 
        task={completedTask} 
        toggleComplete={mockToggleComplete} 
        deleteTask={mockDeleteTask} 
        saveEdit={mockSaveEdit} 
      />
    );
    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(screen.getByRole('listitem')).toHaveClass('task-item--completed');
  });

  it('calls toggleComplete when checkbox is clicked', () => {
    render(
      <TaskItem 
        task={baseTask} 
        toggleComplete={mockToggleComplete} 
        deleteTask={mockDeleteTask} 
        saveEdit={mockSaveEdit} 
      />
    );
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockToggleComplete).toHaveBeenCalledTimes(1);
    expect(mockToggleComplete).toHaveBeenCalledWith(baseTask.id, baseTask.completed);
  });

  it('calls deleteTask when delete button is clicked', () => {
    render(
      <TaskItem 
        task={baseTask} 
        toggleComplete={mockToggleComplete} 
        deleteTask={mockDeleteTask} 
        saveEdit={mockSaveEdit} 
      />
    );
    const deleteButton = screen.getByLabelText(/delete task/i);
    fireEvent.click(deleteButton);
    expect(mockDeleteTask).toHaveBeenCalledTimes(1);
    expect(mockDeleteTask).toHaveBeenCalledWith(baseTask.id);
  });

  it('switches to edit mode when edit button is clicked', () => {
    render(
      <TaskItem 
        task={baseTask} 
        toggleComplete={mockToggleComplete} 
        deleteTask={mockDeleteTask} 
        saveEdit={mockSaveEdit} 
      />
    );
    const editButton = screen.getByLabelText(/edit task/i);
    fireEvent.click(editButton);

    // Now in edit mode
    expect(screen.getByDisplayValue(baseTask.title)).toBeInTheDocument(); // Input field with current title
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/edit task/i)).not.toBeInTheDocument(); // Original buttons hidden
    expect(screen.queryByLabelText(/delete task/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('updates edit input value on change', () => {
    render(
      <TaskItem 
        task={baseTask} 
        toggleComplete={mockToggleComplete} 
        deleteTask={mockDeleteTask} 
        saveEdit={mockSaveEdit} 
      />
    );
    fireEvent.click(screen.getByLabelText(/edit task/i)); // Enter edit mode
    const editInput = screen.getByDisplayValue(baseTask.title);
    
    fireEvent.change(editInput, { target: { value: 'Updated Task Text' } });
    expect(editInput.value).toBe('Updated Task Text');
  });

  it('calls saveEdit and exits edit mode on save button click', () => {
    render(
      <TaskItem 
        task={baseTask} 
        toggleComplete={mockToggleComplete} 
        deleteTask={mockDeleteTask} 
        saveEdit={mockSaveEdit} 
      />
    );
    fireEvent.click(screen.getByLabelText(/edit task/i)); // Enter edit mode
    const editInput = screen.getByDisplayValue(baseTask.title);
    const saveButton = screen.getByRole('button', { name: /save/i });

    fireEvent.change(editInput, { target: { value: 'Saved Task' } });
    fireEvent.click(saveButton);

    expect(mockSaveEdit).toHaveBeenCalledTimes(1);
    expect(mockSaveEdit).toHaveBeenCalledWith(baseTask.id, 'Saved Task');

    // Should return to normal view
    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
    expect(screen.getByLabelText(/edit task/i)).toBeInTheDocument(); // Edit button back
  });

   it('calls saveEdit and exits edit mode on Enter key press', () => {
    render(
      <TaskItem 
        task={baseTask} 
        toggleComplete={mockToggleComplete} 
        deleteTask={mockDeleteTask} 
        saveEdit={mockSaveEdit} 
      />
    );
    fireEvent.click(screen.getByLabelText(/edit task/i));
    const editInput = screen.getByDisplayValue(baseTask.title);
    
    fireEvent.change(editInput, { target: { value: 'Saved Via Enter' } });
    fireEvent.keyDown(editInput, { key: 'Enter', code: 'Enter' });

    expect(mockSaveEdit).toHaveBeenCalledTimes(1);
    expect(mockSaveEdit).toHaveBeenCalledWith(baseTask.id, 'Saved Via Enter');
    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
    expect(screen.getByLabelText(/edit task/i)).toBeInTheDocument();
  });

  it('exits edit mode on cancel button click without saving', () => {
    render(
      <TaskItem 
        task={baseTask} 
        toggleComplete={mockToggleComplete} 
        deleteTask={mockDeleteTask} 
        saveEdit={mockSaveEdit} 
      />
    );
    fireEvent.click(screen.getByLabelText(/edit task/i));
    const editInput = screen.getByDisplayValue(baseTask.title);
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    fireEvent.change(editInput, { target: { value: 'Do not save' } });
    fireEvent.click(cancelButton);

    expect(mockSaveEdit).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
    expect(screen.getByLabelText(/edit task/i)).toBeInTheDocument();
    expect(screen.getByText(baseTask.title)).toBeInTheDocument(); // Original title shown
  });

  it('exits edit mode on Escape key press without saving', () => {
    render(
      <TaskItem 
        task={baseTask} 
        toggleComplete={mockToggleComplete} 
        deleteTask={mockDeleteTask} 
        saveEdit={mockSaveEdit} 
      />
    );
    fireEvent.click(screen.getByLabelText(/edit task/i));
    const editInput = screen.getByDisplayValue(baseTask.title);

    fireEvent.change(editInput, { target: { value: 'Do not save ESC' } });
    fireEvent.keyDown(editInput, { key: 'Escape', code: 'Escape' });

    expect(mockSaveEdit).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
    expect(screen.getByLabelText(/edit task/i)).toBeInTheDocument();
    expect(screen.getByText(baseTask.title)).toBeInTheDocument();
  });

  it('does not call saveEdit if title is empty on save', () => {
    render(
      <TaskItem 
        task={baseTask} 
        toggleComplete={mockToggleComplete} 
        deleteTask={mockDeleteTask} 
        saveEdit={mockSaveEdit} 
      />
    );
    fireEvent.click(screen.getByLabelText(/edit task/i));
    const editInput = screen.getByDisplayValue(baseTask.title);
    const saveButton = screen.getByRole('button', { name: /save/i });

    fireEvent.change(editInput, { target: { value: '   ' } }); // Empty/whitespace title
    fireEvent.click(saveButton);

    expect(mockSaveEdit).not.toHaveBeenCalled();
    // Stays in edit mode or cancels depending on implementation - current cancels
    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument(); 
    expect(screen.getByText(baseTask.title)).toBeInTheDocument(); // Back to original title view
  });

}); 