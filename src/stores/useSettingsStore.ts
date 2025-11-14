// Settings store for managing app preferences with Zustand

import { create } from 'zustand';
import type { AppSettings } from '../types/storage';
import { storage } from '../services/storage';

interface SettingsStore {
    theme: 'dark' | 'light';
    background: string | null;
    userName: string | null;
    searchEngine: 'google' | 'bing' | 'duckduckgo' | 'yahoo';
    isInitialized: boolean;
    setTheme: (theme: 'dark' | 'light') => Promise<void>;
    setBackground: (background: string | null) => Promise<void>;
    setUserName: (userName: string | null) => Promise<void>;
    setSearchEngine: (searchEngine: 'google' | 'bing' | 'duckduckgo' | 'yahoo') => Promise<void>;
    initializeSettings: () => Promise<void>;
}

// Default settings for new users
const DEFAULT_SETTINGS: AppSettings = {
    theme: 'dark',
    background: null,
    userName: null,
    searchEngine: 'google',
};

/**
 * Apply theme to document root
 */
function applyTheme(theme: 'dark' | 'light'): void {
    const root = document.documentElement;

    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
    theme: DEFAULT_SETTINGS.theme,
    background: DEFAULT_SETTINGS.background,
    userName: DEFAULT_SETTINGS.userName,
    searchEngine: DEFAULT_SETTINGS.searchEngine,
    isInitialized: false,

    /**
     * Set theme preference and persist to Chrome Storage
     */
    setTheme: async (theme: 'dark' | 'light') => {
        try {
            // Update local state first for immediate UI feedback
            set({ theme });

            // Apply theme to document root
            applyTheme(theme);

            // Get current settings and update theme
            const { background, userName, searchEngine } = get();
            const updatedSettings: AppSettings = { theme, background, userName, searchEngine };

            // Persist to Chrome Storage
            await storage.set('settings', updatedSettings);
        } catch (error) {
            console.error('Failed to update theme:', error);
            throw error;
        }
    },

    /**
     * Set background preference and persist to Chrome Storage
     */
    setBackground: async (background: string | null) => {
        try {
            // Update local state first for immediate UI feedback
            set({ background });

            // Get current settings and update background
            const { theme, userName, searchEngine } = get();
            const updatedSettings: AppSettings = { theme, background, userName, searchEngine };

            // Persist to Chrome Storage
            await storage.set('settings', updatedSettings);
        } catch (error) {
            console.error('Failed to update background:', error);
            throw error;
        }
    },

    /**
     * Set user name preference and persist to Chrome Storage
     */
    setUserName: async (userName: string | null) => {
        try {
            // Validate name
            if (userName !== null) {
                if (userName.length > 50) {
                    throw new Error('Name must be 50 characters or less');
                }

                if (!/^[a-zA-Z0-9\s]*$/.test(userName)) {
                    throw new Error('Name can only contain letters, numbers, and spaces');
                }
            }

            // Update local state first for immediate UI feedback
            set({ userName });

            // Get current settings and update userName
            const { theme, background, searchEngine } = get();
            const updatedSettings: AppSettings = { theme, background, userName, searchEngine };

            // Persist to Chrome Storage
            await storage.set('settings', updatedSettings);
        } catch (error) {
            console.error('Failed to update user name:', error);
            throw error;
        }
    },

    /**
     * Set search engine preference and persist to Chrome Storage
     */
    setSearchEngine: async (searchEngine: 'google' | 'bing' | 'duckduckgo' | 'yahoo') => {
        try {
            // Update local state first for immediate UI feedback
            set({ searchEngine });

            // Get current settings and update searchEngine
            const { theme, background, userName } = get();
            const updatedSettings: AppSettings = { theme, background, userName, searchEngine };

            // Persist to Chrome Storage
            await storage.set('settings', updatedSettings);
        } catch (error) {
            console.error('Failed to update search engine:', error);
            throw error;
        }
    },

    /**
     * Initialize settings from Chrome Storage on app load
     */
    initializeSettings: async () => {
        try {
            const storedSettings = await storage.get<AppSettings>('settings');

            if (storedSettings && typeof storedSettings === 'object') {
                const theme = storedSettings.theme || DEFAULT_SETTINGS.theme;
                const background = storedSettings.background !== undefined
                    ? storedSettings.background
                    : DEFAULT_SETTINGS.background;
                const userName = storedSettings.userName !== undefined
                    ? storedSettings.userName
                    : DEFAULT_SETTINGS.userName;
                const searchEngine = storedSettings.searchEngine || DEFAULT_SETTINGS.searchEngine;

                set({ theme, background, userName, searchEngine, isInitialized: true });

                // Apply theme to document root
                applyTheme(theme);
            } else {
                // Use default settings and persist them
                set({
                    theme: DEFAULT_SETTINGS.theme,
                    background: DEFAULT_SETTINGS.background,
                    userName: DEFAULT_SETTINGS.userName,
                    searchEngine: DEFAULT_SETTINGS.searchEngine,
                    isInitialized: true,
                });

                // Apply default theme
                applyTheme(DEFAULT_SETTINGS.theme);

                await storage.set('settings', DEFAULT_SETTINGS);
            }
        } catch (error) {
            console.error('Failed to initialize settings from storage:', error);
            // Fall back to defaults on error
            set({
                theme: DEFAULT_SETTINGS.theme,
                background: DEFAULT_SETTINGS.background,
                userName: DEFAULT_SETTINGS.userName,
                searchEngine: DEFAULT_SETTINGS.searchEngine,
                isInitialized: true,
            });
            applyTheme(DEFAULT_SETTINGS.theme);
        }
    },
}));
