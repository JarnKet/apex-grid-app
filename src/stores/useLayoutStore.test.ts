import { describe, it, expect, beforeEach } from 'vitest';
import { useLayoutStore } from './useLayoutStore';
import { clearMockStorage, getMockStorageState } from '../test/setup';
import { DEFAULT_LAYOUT } from '../types/layout';
import type { Layout } from '../types/layout';

describe('useLayoutStore', () => {
    beforeEach(() => {
        clearMockStorage();
        // Reset store to initial state
        useLayoutStore.setState({
            layout: DEFAULT_LAYOUT,
            isInitialized: false,
        });
    });

    describe('setLayout', () => {
        it('should update layout state without persisting', () => {
            const newLayout: Layout = [
                { i: 'test-1', x: 0, y: 0, w: 2, h: 2 },
            ];

            useLayoutStore.getState().setLayout(newLayout);

            expect(useLayoutStore.getState().layout).toEqual(newLayout);

            // Should not persist to storage
            const storageState = getMockStorageState();
            expect(storageState.layout).toBeUndefined();
        });
    });

    describe('updateLayout', () => {
        it('should update layout and persist to storage', async () => {
            const newLayout: Layout = [
                { i: 'test-1', x: 1, y: 1, w: 3, h: 2 },
            ];

            await useLayoutStore.getState().updateLayout(newLayout);

            // Check state updated
            expect(useLayoutStore.getState().layout).toEqual(newLayout);

            // Check persisted to storage
            const storageState = getMockStorageState();
            expect(storageState.layout).toEqual(newLayout);
        });

        it('should update state immediately even if storage fails', async () => {
            const newLayout: Layout = [
                { i: 'test-1', x: 2, y: 2, w: 2, h: 2 },
            ];

            await useLayoutStore.getState().updateLayout(newLayout);

            expect(useLayoutStore.getState().layout).toEqual(newLayout);
        });
    });

    describe('initializeLayout', () => {
        it('should load layout from storage', async () => {
            const storedLayout: Layout = [
                { i: 'stored-1', x: 5, y: 5, w: 2, h: 2 },
            ];

            await chrome.storage.sync.set({ layout: storedLayout });

            await useLayoutStore.getState().initializeLayout();

            expect(useLayoutStore.getState().layout).toEqual(storedLayout);
            expect(useLayoutStore.getState().isInitialized).toBe(true);
        });

        it('should use default layout when storage is empty', async () => {
            await useLayoutStore.getState().initializeLayout();

            expect(useLayoutStore.getState().layout).toEqual(DEFAULT_LAYOUT);
            expect(useLayoutStore.getState().isInitialized).toBe(true);

            // Should persist default layout
            const storageState = getMockStorageState();
            expect(storageState.layout).toEqual(DEFAULT_LAYOUT);
        });

        it('should use default layout when stored layout is invalid', async () => {
            await chrome.storage.sync.set({ layout: null });

            await useLayoutStore.getState().initializeLayout();

            expect(useLayoutStore.getState().layout).toEqual(DEFAULT_LAYOUT);
            expect(useLayoutStore.getState().isInitialized).toBe(true);
        });

        it('should handle storage errors gracefully', async () => {
            // Mock storage error
            chrome.storage.sync.get = () => Promise.reject(new Error('Storage error'));

            await useLayoutStore.getState().initializeLayout();

            // Should fall back to default layout
            expect(useLayoutStore.getState().layout).toEqual(DEFAULT_LAYOUT);
            expect(useLayoutStore.getState().isInitialized).toBe(true);
        });
    });
});
