import { describe, it, expect, beforeEach } from 'vitest';
import { useLayoutStore } from '../../stores/useLayoutStore';
import { clearMockStorage, getMockStorageState } from '../setup';
import type { Layout } from '../../types/layout';

describe('Layout Sync Integration', () => {
    beforeEach(() => {
        clearMockStorage();
        useLayoutStore.setState({
            layout: [
                { i: 'clock-1', x: 0, y: 0, w: 3, h: 2 },
            ],
            isInitialized: false,
        });
    });

    it('should persist layout changes to storage', async () => {
        const newLayout: Layout = [
            { i: 'clock-1', x: 1, y: 1, w: 3, h: 2 },
            { i: 'todo-1', x: 4, y: 1, w: 3, h: 2 },
        ];

        // Update layout
        await useLayoutStore.getState().updateLayout(newLayout);

        // Verify layout is in store
        const storeLayout = useLayoutStore.getState().layout;
        expect(storeLayout).toEqual(newLayout);

        // Verify layout is persisted to storage
        const storageState = getMockStorageState();
        expect(storageState.layout).toEqual(newLayout);
    });

    it('should load persisted layout on initialization', async () => {
        const persistedLayout: Layout = [
            { i: 'clock-1', x: 2, y: 2, w: 3, h: 2 },
            { i: 'calendar-1', x: 5, y: 2, w: 3, h: 2 },
            { i: 'todo-1', x: 8, y: 2, w: 3, h: 2 },
        ];

        // Set up persisted layout in storage
        await chrome.storage.sync.set({ layout: persistedLayout });

        // Initialize layout
        await useLayoutStore.getState().initializeLayout();

        // Verify layout is loaded into store
        const storeLayout = useLayoutStore.getState().layout;
        expect(storeLayout).toEqual(persistedLayout);
        expect(useLayoutStore.getState().isInitialized).toBe(true);
    });

    it('should handle drag and drop layout updates', async () => {
        const initialLayout: Layout = [
            { i: 'clock-1', x: 0, y: 0, w: 3, h: 2 },
            { i: 'todo-1', x: 3, y: 0, w: 3, h: 2 },
        ];

        useLayoutStore.setState({ layout: initialLayout });

        // Simulate dragging clock-1 to new position
        const updatedLayout: Layout = [
            { i: 'clock-1', x: 6, y: 0, w: 3, h: 2 }, // Moved
            { i: 'todo-1', x: 3, y: 0, w: 3, h: 2 },
        ];

        await useLayoutStore.getState().updateLayout(updatedLayout);

        // Verify layout is updated and persisted
        const storageState = getMockStorageState();
        expect(storageState.layout).toEqual(updatedLayout);
    });

    it('should handle resize layout updates', async () => {
        const initialLayout: Layout = [
            { i: 'clock-1', x: 0, y: 0, w: 3, h: 2 },
        ];

        useLayoutStore.setState({ layout: initialLayout });

        // Simulate resizing clock-1
        const updatedLayout: Layout = [
            { i: 'clock-1', x: 0, y: 0, w: 4, h: 3 }, // Resized
        ];

        await useLayoutStore.getState().updateLayout(updatedLayout);

        // Verify layout is updated and persisted
        const storageState = getMockStorageState();
        expect(storageState.layout).toEqual(updatedLayout);
    });

    it('should maintain layout integrity across multiple updates', async () => {
        // First update
        await useLayoutStore.getState().updateLayout([
            { i: 'clock-1', x: 0, y: 0, w: 3, h: 2 },
        ]);

        // Second update
        await useLayoutStore.getState().updateLayout([
            { i: 'clock-1', x: 0, y: 0, w: 3, h: 2 },
            { i: 'todo-1', x: 3, y: 0, w: 3, h: 2 },
        ]);

        // Third update
        await useLayoutStore.getState().updateLayout([
            { i: 'clock-1', x: 1, y: 1, w: 3, h: 2 },
            { i: 'todo-1', x: 4, y: 1, w: 3, h: 2 },
            { i: 'calendar-1', x: 7, y: 1, w: 3, h: 2 },
        ]);

        // Verify final layout is correct
        const storageState = getMockStorageState();
        expect(storageState.layout).toHaveLength(3);
        expect(storageState.layout.find((item: any) => item.i === 'clock-1')?.x).toBe(1);
    });

    it('should sync layout when widget is added', async () => {
        const currentLayout: Layout = [
            { i: 'clock-1', x: 0, y: 0, w: 3, h: 2 },
            { i: 'todo-1', x: 3, y: 0, w: 3, h: 2 },
        ];

        useLayoutStore.setState({ layout: currentLayout });

        // Add new widget to layout
        const updatedLayout: Layout = [
            ...currentLayout,
            { i: 'calendar-1', x: 6, y: 0, w: 3, h: 2 },
        ];

        await useLayoutStore.getState().updateLayout(updatedLayout);

        // Verify layout includes new widget
        const storageState = getMockStorageState();
        expect(storageState.layout).toHaveLength(3);
        expect(storageState.layout.find((item: any) => item.i === 'calendar-1')).toBeDefined();
    });

    it('should sync layout when widget is removed', async () => {
        const currentLayout: Layout = [
            { i: 'clock-1', x: 0, y: 0, w: 3, h: 2 },
            { i: 'todo-1', x: 3, y: 0, w: 3, h: 2 },
            { i: 'calendar-1', x: 6, y: 0, w: 3, h: 2 },
        ];

        useLayoutStore.setState({ layout: currentLayout });

        // Remove widget from layout
        const updatedLayout: Layout = currentLayout.filter(item => item.i !== 'todo-1');

        await useLayoutStore.getState().updateLayout(updatedLayout);

        // Verify layout no longer includes removed widget
        const storageState = getMockStorageState();
        expect(storageState.layout).toHaveLength(2);
        expect(storageState.layout.find((item: any) => item.i === 'todo-1')).toBeUndefined();
    });

    it('should handle rapid layout updates', async () => {
        const updates: Promise<void>[] = [];

        // Simulate rapid layout changes
        for (let i = 0; i < 5; i++) {
            const layout: Layout = [
                { i: 'clock-1', x: i, y: i, w: 3, h: 2 },
            ];
            updates.push(useLayoutStore.getState().updateLayout(layout));
        }

        await Promise.all(updates);

        // Verify final state is consistent
        const storageState = getMockStorageState();
        expect(storageState.layout).toBeDefined();
        expect(storageState.layout).toHaveLength(1);
    });
});
