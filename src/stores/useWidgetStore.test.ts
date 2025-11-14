import { describe, it, expect, beforeEach } from 'vitest';
import { useWidgetStore } from './useWidgetStore';
import { clearMockStorage, getMockStorageState } from '../test/setup';
import type { Widget, WidgetData } from '../types/widget';

describe('useWidgetStore', () => {
    beforeEach(() => {
        clearMockStorage();
        // Reset store to initial state
        useWidgetStore.setState({
            widgets: [
                { id: 'clock-1', type: 'clock', enabled: true },
                { id: 'calendar-1', type: 'calendar', enabled: true },
            ],
            widgetData: {},
            isInitialized: false,
        });
    });

    describe('addWidget', () => {
        it('should add a new widget with generated ID', () => {
            const initialCount = useWidgetStore.getState().widgets.length;

            useWidgetStore.getState().addWidget('todo');

            const widgets = useWidgetStore.getState().widgets;
            expect(widgets.length).toBe(initialCount + 1);

            const newWidget = widgets.find(w => w.type === 'todo');
            expect(newWidget).toBeDefined();
            expect(newWidget?.id).toMatch(/^todo-\d+$/);
            expect(newWidget?.enabled).toBe(true);
        });

        it('should generate unique IDs for multiple widgets of same type', () => {
            useWidgetStore.getState().addWidget('todo');
            useWidgetStore.getState().addWidget('todo');

            const todoWidgets = useWidgetStore.getState().widgets.filter(w => w.type === 'todo');
            expect(todoWidgets.length).toBe(2);
            expect(todoWidgets[0].id).not.toBe(todoWidgets[1].id);
        });
    });

    describe('removeWidget', () => {
        it('should remove widget from list', () => {
            const widgetId = 'clock-1';

            useWidgetStore.getState().removeWidget(widgetId);

            const widgets = useWidgetStore.getState().widgets;
            expect(widgets.find(w => w.id === widgetId)).toBeUndefined();
        });

        it('should remove widget data when removing widget', () => {
            const widgetId = 'clock-1';

            // Add some widget data
            useWidgetStore.setState({
                widgetData: {
                    [widgetId]: { someData: 'test' },
                    'other-1': { otherData: 'keep' },
                },
            });

            useWidgetStore.getState().removeWidget(widgetId);

            const widgetData = useWidgetStore.getState().widgetData;
            expect(widgetData[widgetId]).toBeUndefined();
            expect(widgetData['other-1']).toBeDefined();
        });
    });

    describe('updateWidgetData', () => {
        it('should update widget data and persist to storage', async () => {
            const widgetId = 'todo-1';
            const testData = {
                todos: [
                    { id: '1', text: 'Test task', completed: false, createdAt: Date.now() },
                ],
            };

            await useWidgetStore.getState().updateWidgetData(widgetId, testData);

            // Check state updated
            const widgetData = useWidgetStore.getState().widgetData;
            expect(widgetData[widgetId]).toEqual(testData);

            // Check persisted to storage
            const storageState = getMockStorageState();
            expect(storageState.widgetData[widgetId]).toEqual(testData);
        });

        it('should preserve other widget data when updating', async () => {
            const existingData = {
                'widget-1': { data: 'existing' },
                'widget-2': { data: 'also existing' },
            };

            useWidgetStore.setState({ widgetData: existingData });

            await useWidgetStore.getState().updateWidgetData('widget-3', { todos: [] });

            const widgetData = useWidgetStore.getState().widgetData;
            expect(widgetData['widget-1']).toEqual({ data: 'existing' });
            expect(widgetData['widget-2']).toEqual({ data: 'also existing' });
            expect(widgetData['widget-3']).toEqual({ data: 'new' });
        });
    });

    describe('initializeWidgets', () => {
        it('should load widgets from storage', async () => {
            const storedWidgets: Widget[] = [
                { id: 'test-1', type: 'clock', enabled: true },
                { id: 'test-2', type: 'todo', enabled: true },
            ];

            await chrome.storage.sync.set({ widgets: storedWidgets });

            await useWidgetStore.getState().initializeWidgets();

            expect(useWidgetStore.getState().widgets).toEqual(storedWidgets);
            expect(useWidgetStore.getState().isInitialized).toBe(true);
        });

        it('should load widget data from storage', async () => {
            const storedWidgetData: WidgetData = {
                'todo-1': {
                    todos: [{ id: '1', text: 'Task', completed: false, createdAt: Date.now() }],
                },
            };

            await chrome.storage.sync.set({ widgetData: storedWidgetData });

            await useWidgetStore.getState().initializeWidgets();

            expect(useWidgetStore.getState().widgetData).toEqual(storedWidgetData);
        });

        it('should use default widgets when storage is empty', async () => {
            await useWidgetStore.getState().initializeWidgets();

            const widgets = useWidgetStore.getState().widgets;
            expect(widgets.length).toBeGreaterThan(0);
            expect(widgets.some(w => w.type === 'clock')).toBe(true);
            expect(useWidgetStore.getState().isInitialized).toBe(true);
        });

        it('should handle storage errors gracefully', async () => {
            // Mock storage error
            chrome.storage.sync.get = () => Promise.reject(new Error('Storage error'));

            await useWidgetStore.getState().initializeWidgets();

            // Should fall back to defaults
            expect(useWidgetStore.getState().widgets.length).toBeGreaterThan(0);
            expect(useWidgetStore.getState().isInitialized).toBe(true);
        });
    });
});
