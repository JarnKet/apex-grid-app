import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoWidget } from './TodoWidget';
import type { TodoItem } from '../../types/widget';

describe('TodoWidget', () => {
    it('should render empty state when no todos', () => {
        render(<TodoWidget id="todo-1" />);

        expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    });

    it('should render existing todos', () => {
        const mockData = {
            todos: [
                { id: '1', text: 'Task 1', completed: false, createdAt: Date.now() },
                { id: '2', text: 'Task 2', completed: true, createdAt: Date.now() },
            ] as TodoItem[],
        };

        render(<TodoWidget id="todo-1" data={mockData} />);

        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    it('should call onDataChange when adding a new task', async () => {
        const user = userEvent.setup();
        const mockOnDataChange = vi.fn();

        render(<TodoWidget id="todo-1" onDataChange={mockOnDataChange} />);

        const input = screen.getByPlaceholderText(/add a new task/i);
        const addButton = screen.getByRole('button', { name: /add task/i });

        await user.type(input, 'New Task');
        await user.click(addButton);

        expect(mockOnDataChange).toHaveBeenCalledWith(
            expect.objectContaining({
                todos: expect.arrayContaining([
                    expect.objectContaining({
                        text: 'New Task',
                        completed: false,
                    }),
                ]),
            })
        );
    });

    it('should call onDataChange when toggling task completion', async () => {
        const user = userEvent.setup();
        const mockOnDataChange = vi.fn();
        const mockData = {
            todos: [
                { id: '1', text: 'Task 1', completed: false, createdAt: Date.now() },
            ] as TodoItem[],
        };

        render(<TodoWidget id="todo-1" data={mockData} onDataChange={mockOnDataChange} />);

        const checkbox = screen.getByRole('checkbox');
        await user.click(checkbox);

        expect(mockOnDataChange).toHaveBeenCalledWith({
            todos: [
                expect.objectContaining({
                    id: '1',
                    text: 'Task 1',
                    completed: true,
                }),
            ],
        });
    });

    it('should call onDataChange when deleting a task', async () => {
        const user = userEvent.setup();
        const mockOnDataChange = vi.fn();
        const mockData = {
            todos: [
                { id: '1', text: 'Task 1', completed: false, createdAt: Date.now() },
                { id: '2', text: 'Task 2', completed: false, createdAt: Date.now() },
            ] as TodoItem[],
        };

        render(<TodoWidget id="todo-1" data={mockData} onDataChange={mockOnDataChange} />);

        const deleteButtons = screen.getAllByRole('button', { name: /delete task/i });
        await user.click(deleteButtons[0]);

        expect(mockOnDataChange).toHaveBeenCalledWith({
            todos: [
                expect.objectContaining({
                    id: '2',
                    text: 'Task 2',
                }),
            ],
        });
    });

    it('should not add empty tasks', async () => {
        const user = userEvent.setup();
        const mockOnDataChange = vi.fn();

        render(<TodoWidget id="todo-1" onDataChange={mockOnDataChange} />);

        const addButton = screen.getByRole('button', { name: /add task/i });
        await user.click(addButton);

        expect(mockOnDataChange).not.toHaveBeenCalled();
    });
});
