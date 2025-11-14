// Layout store for managing grid layout state with Zustand

import { create } from 'zustand';
import type { Layout } from '../types/layout';
import { DEFAULT_LAYOUT } from '../types/layout';
import { storage } from '../services/storage';

interface LayoutStore {
    layout: Layout;
    isInitialized: boolean;
    setLayout: (layout: Layout) => void;
    updateLayout: (layout: Layout) => Promise<void>;
    initializeLayout: () => Promise<void>;
}

export const useLayoutStore = create<LayoutStore>((set) => ({
    layout: DEFAULT_LAYOUT,
    isInitialized: false,

    /**
     * Set layout state without persisting
     */
    setLayout: (layout: Layout) => {
        set({ layout });
    },

    /**
     * Update layout and persist to Chrome Storage
     */
    updateLayout: async (layout: Layout) => {
        try {
            // Update local state first for immediate UI feedback
            set({ layout });

            // Persist to Chrome Storage
            await storage.set('layout', layout);
        } catch (error) {
            console.error('Failed to update layout:', error);
            throw error;
        }
    },

    /**
     * Initialize layout from Chrome Storage on app load
     */
    initializeLayout: async () => {
        try {
            const storedLayout = await storage.get<Layout>('layout');

            if (storedLayout && Array.isArray(storedLayout) && storedLayout.length > 0) {
                set({ layout: storedLayout, isInitialized: true });
            } else {
                // Use default layout and persist it
                set({ layout: DEFAULT_LAYOUT, isInitialized: true });
                await storage.set('layout', DEFAULT_LAYOUT);
            }
        } catch (error) {
            console.error('Failed to initialize layout from storage:', error);
            // Fall back to default layout on error
            set({ layout: DEFAULT_LAYOUT, isInitialized: true });
        }
    },
}));
