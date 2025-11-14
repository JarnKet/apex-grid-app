import { describe, it, expect, beforeEach } from 'vitest';
import { useWidgetStore } from '../../stores/useWidgetStore';
import { clearMockStorage, getMockStorageState } from '../setup';
import type { TodoItem } from '../../types/widget';

describe('Widget Data Persistence Integration', () => {
    beforeEach(() => {
        clearMockStorage();
        useWidgetStore.setState({
            widgets: [
                { id: 'todo-1', type: 'todo', enabled: true },
                { id: 'quicklinks-1', type: 'quicklinks', enabled: true },
            ],
            widgetData: {},
            isInitialized: false,
        });
    });

    it('should persist todo widget data to storage', async () => {
        const todoData = {
            todos: [
                { id: '1', text: 'Test task', completed: false, createdAt: Date.now() },
                { id: '2', text: 'Another task', completed: true, createdAt: Date.now() },
            ] as TodoItem[],
        };

        // Update widget data
        await useWidgetStore.getState().updateWidgetData('todo-1', todoData);

        // Verify data is in store
        const storeData = useWidgetStore.getState().widgetData;
        expect(storeData['todo-1']).toEqual(todoData);

        // Verify data is persisted to storage
        const storageState = getMockStorageState();
        expect(storageState.widgetData['todo-1']).toEqual(todoData);
    });

    it('should persist quick links widget data to storage', async () => {
        const linksData = {
            links: [
                { id: '1', title: 'Google', url: 'https://google.com' },
                { id: '2', title: 'GitHub', url: 'https://github.com' },
            ],
        };

        // Update widget data
        await useWidgetStore.getState().updateWidgetData('quicklinks-1', linksData);

        // Verify data is in store
        const storeData = useWidgetStore.getState().widgetData;
        expect(storeData['quicklinks-1']).toEqual(linksData);

        // Verify data is persisted to storage
        const storageState = getMockStorageState();
        expect(storageState.widgetData['quicklinks-1']).toEqual(linksData);
    });

    it('should load persisted widget data on initialization', async () => {
        const persistedData = {
            'todo-1': {
                todos: [
                    { id: '1', text: 'Persisted task', completed: false, createdAt: Date.now() },
                ],
            },
            'quicklinks-1': {
                links: [
                    { id: '1', title: 'Test Link', url: 'https://test.com' },
                ],
            },
        };

        // Set up persisted data in storage
        await chrome.storage.sync.set({ widgetData: persistedData });

        // Initialize widgets
        await useWidgetStore.getState().initializeWidgets();

        // Verify data is loaded into store
        const storeData = useWidgetStore.getState().widgetData;
        expect(storeData).toEqual(persistedData);
    });

    it('should maintain data integrity across multiple updates', async () => {
        // First update
        await useWidgetStore.getState().updateWidgetData('todo-1', {
            todos: [
                { id: '1', text: 'Task 1', completed: false, createdAt: Date.now() },
            ],
        });

        // Second update to different widget
        await useWidgetStore.getState().updateWidgetData('quicklinks-1', {
            links: [
                { id: '1', title: 'Link 1', url: 'https://example.com' },
            ],
        });

        // Third update to first widget
        await useWidgetStore.getState().updateWidgetData('todo-1', {
            todos: [
                { id: '1', text: 'Task 1', completed: false, createdAt: Date.now() },
                { id: '2', text: 'Task 2', completed: false, createdAt: Date.now() },
            ],
        });

        // Verify all data is preserved
        const storageState = getMockStorageState();
        expect(storageState.widgetData['todo-1'].todos).toHaveLength(2);
        expect(storageState.widgetData['quicklinks-1'].links).toHaveLength(1);
    });

    it('should remove widget data when widget is removed', async () => {
        // Set up widget data
        await useWidgetStore.getState().updateWidgetData('todo-1', {
            todos: [
                { id: '1', text: 'Task', completed: false, createdAt: Date.now() },
            ],
        });

        await useWidgetStore.getState().updateWidgetData('quicklinks-1', {
            links: [
                { id: '1', title: 'Link', url: 'https://example.com' },
            ],
        });

        // Remove one widget
        useWidgetStore.getState().removeWidget('todo-1');

        // Wait for async operations
        await new Promise(resolve => setTimeout(resolve, 100));

        // Verify widget data is removed from store
        const storeData = useWidgetStore.getState().widgetData;
        expect(storeData['todo-1']).toBeUndefined();
        expect(storeData['quicklinks-1']).toBeDefined();
    });

    it('should handle concurrent widget data updates', async () => {
        // Simulate concurrent updates
        const updates = [
            useWidgetStore.getState().updateWidgetData('todo-1', {
                todos: [{ id: '1', text: 'Task 1', completed: false, createdAt: Date.now() }],
            }),
            useWidgetStore.getState().updateWidgetData('quicklinks-1', {
                links: [{ id: '1', title: 'Link 1', url: 'https://example.com' }],
            }),
        ];

        await Promise.all(updates);

        // Verify both updates succeeded
        const storageState = getMockStorageState();
        expect(storageState.widgetData['todo-1']).toBeDefined();
        expect(storageState.widgetData['quicklinks-1']).toBeDefined();
    });
});
