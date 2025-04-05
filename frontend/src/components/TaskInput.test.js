import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides extra matchers like .toBeInTheDocument()
import TaskInput from './TaskInput';

describe('TaskInput Component', () => {
  it('renders the input field and add button', () => {
    render(<TaskInput addTask={() => {}} />); // Mock addTask prop

    // Check if the input field is rendered
    const inputElement = screen.getByPlaceholderText(/add a new task/i);
    expect(inputElement).toBeInTheDocument();

    // Check if the button is rendered
    const buttonElement = screen.getByRole('button', { name: /add task/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('updates input value on change', () => {
    render(<TaskInput addTask={() => {}} />);
    const inputElement = screen.getByPlaceholderText(/add a new task/i);

    fireEvent.change(inputElement, { target: { value: 'New Task Input' } });
    expect(inputElement.value).toBe('New Task Input');
  });

  it('calls addTask prop and clears input on form submit', () => {
    const mockAddTask = jest.fn(); // Create a jest mock function
    render(<TaskInput addTask={mockAddTask} />);

    const inputElement = screen.getByPlaceholderText(/add a new task/i);
    const formElement = screen.getByTestId('task-input-form'); // Use getByTestId

    // Simulate user typing and submitting
    fireEvent.change(inputElement, { target: { value: 'Finish testing' } });
    fireEvent.submit(formElement);

    // Check if addTask was called correctly
    expect(mockAddTask).toHaveBeenCalledTimes(1);
    expect(mockAddTask).toHaveBeenCalledWith('Finish testing');

    // Check if input was cleared
    expect(inputElement.value).toBe('');
  });

  it('does not call addTask if input is empty', () => {
    const mockAddTask = jest.fn();
    render(<TaskInput addTask={mockAddTask} />);
    const formElement = screen.getByTestId('task-input-form'); // Use getByTestId

    fireEvent.submit(formElement);
    expect(mockAddTask).not.toHaveBeenCalled();
  });

  it('does not call addTask if input is only whitespace', () => {
    const mockAddTask = jest.fn();
    render(<TaskInput addTask={mockAddTask} />);
    const inputElement = screen.getByPlaceholderText(/add a new task/i);
    const formElement = screen.getByTestId('task-input-form'); // Use getByTestId

    fireEvent.change(inputElement, { target: { value: '   ' } }); // Input with spaces
    fireEvent.submit(formElement);

    expect(mockAddTask).not.toHaveBeenCalled();
  });
}); 