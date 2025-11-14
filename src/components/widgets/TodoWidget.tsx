import React, { useState } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import type { WidgetProps, TodoItem } from '../../types/widget';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Checkbox } from '../ui/Checkbox';
import { Trash2 } from 'lucide-react';

/**
 * TodoWidget provides task management functionality
 * - Add new tasks with input field and submit button
 * - Toggle task completion with checkbox
 * - Delete tasks with delete button
 * - Display tasks in creation order
 * - Persist all changes to Chrome Storage
 */
const TodoWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const [newTaskText, setNewTaskText] = useState('');

    // Get todos from widget data, default to empty array
    const todos: TodoItem[] = data?.todos || [];

    /**
     * Handle adding a new task
     */
    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newTaskText.trim()) {
            return;
        }

        // Generate unique ID for new task
        const newTask: TodoItem = {
            id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: newTaskText.trim(),
            completed: false,
            createdAt: Date.now(),
        };

        // Update todos list
        const updatedTodos = [...todos, newTask];

        // Persist to widget store
        if (onDataChange) {
            onDataChange({ todos: updatedTodos });
        }

        // Clear input field
        setNewTaskText('');
    };

    /**
     * Handle toggling task completion state
     */
    const handleToggleTask = (taskId: string) => {
        const updatedTodos = todos.map(task =>
            task.id === taskId
                ? { ...task, completed: !task.completed }
                : task
        );

        // Persist to widget store
        if (onDataChange) {
            onDataChange({ todos: updatedTodos });
        }
    };

    /**
     * Handle deleting a task
     */
    const handleDeleteTask = (taskId: string) => {
        const updatedTodos = todos.filter(task => task.id !== taskId);

        // Persist to widget store
        if (onDataChange) {
            onDataChange({ todos: updatedTodos });
        }
    };

    return (
        <WidgetWrapper id={id} title="Todo List">
            <div className="flex flex-col h-full">
                {/* Add task form */}
                <form
                    onSubmit={handleAddTask}
                    className="flex gap-2 mb-4"
                    aria-label="Add new task"
                >
                    <Input
                        type="text"
                        placeholder="Add a new task..."
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        className="flex-1"
                        aria-label="New task description"
                    />
                    <Button
                        type="submit"
                        size="sm"
                        aria-label="Add task"
                    >
                        Add
                    </Button>
                </form>

                {/* Task list */}
                <div
                    className="flex-1 overflow-y-auto space-y-2"
                    role="list"
                    aria-label="Task list"
                >
                    {todos.length === 0 ? (
                        <p
                            className="text-sm text-muted-foreground text-center py-4"
                            role="status"
                        >
                            No tasks yet. Add one above!
                        </p>
                    ) : (
                        todos.map((task) => (
                            <div
                                key={task.id}
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors duration-200 group"
                                role="listitem"
                            >
                                <Checkbox
                                    checked={task.completed}
                                    onCheckedChange={() => handleToggleTask(task.id)}
                                    aria-label={`Mark "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
                                />
                                <span
                                    className={`flex-1 text-sm ${task.completed
                                        ? 'line-through text-muted-foreground'
                                        : ''
                                        }`}
                                    aria-label={task.completed ? `Completed: ${task.text}` : task.text}
                                >
                                    {task.text}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    aria-label={`Delete task "${task.text}"`}
                                    title={`Delete task "${task.text}"`}
                                >
                                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </WidgetWrapper>
    );
};

// Memoize component to prevent unnecessary re-renders
export const TodoWidget = React.memo(TodoWidgetComponent);
