// Settings store for managing app preferences with Zustand

import { create } from 'zustand';
import type { AppSettings, LayoutWidth } from '../types/storage';
import { storage } from '../services/storage';
import type { BackgroundPattern } from '../lib/backgroundPatterns';
import { applyThemeColors } from '../lib/themes';

interface SettingsStore {
    theme: 'dark' | 'light';
    themeId: string;
    background: string | null;
    backgroundPattern: BackgroundPattern;
    layoutWidth: LayoutWidth;
    userName: string | null;
    isInitialized: boolean;
    setTheme: (theme: 'dark' | 'light') => Promise<void>;
    setThemeId: (themeId: string) => Promise<void>;
    setBackground: (background: string | null) => Promise<void>;
    setBackgroundPattern: (pattern: BackgroundPattern) => Promise<void>;
    setLayoutWidth: (width: LayoutWidth) => Promise<void>;
    setUserName: (userName: string | null) => Promise<void>;
    initializeSettings: () => Promise<void>;
}

// Default settings for new users
const DEFAULT_SETTINGS: AppSettings = {
    theme: 'dark',
    themeId: 'mono',
    background: null,
    backgroundPattern: 'dots',
    layoutWidth: 'full',
    userName: null,
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
    themeId: DEFAULT_SETTINGS.themeId,
    background: DEFAULT_SETTINGS.background,
    backgroundPattern: DEFAULT_SETTINGS.backgroundPattern,
    layoutWidth: DEFAULT_SETTINGS.layoutWidth,
    userName: DEFAULT_SETTINGS.userName,
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

            // Apply theme colors
            const { themeId } = get();
            applyThemeColors(themeId, theme);

            // Get current settings and update theme
            const { themeId: currentThemeId, background, backgroundPattern, layoutWidth, userName } = get();
            const updatedSettings: AppSettings = { theme, themeId: currentThemeId, background, backgroundPattern, layoutWidth, userName };

            // Persist to Chrome Storage
            await storage.set('settings', updatedSettings);
        } catch (error) {
            console.error('Failed to update theme:', error);
            throw error;
        }
    },

    /**
     * Set theme ID preference and persist to Chrome Storage
     */
    setThemeId: async (themeId: string) => {
        try {
            // Update local state first for immediate UI feedback
            set({ themeId });

            // Apply theme colors
            const { theme } = get();
            applyThemeColors(themeId, theme);

            // Get current settings and update themeId
            const { theme: currentTheme, background, backgroundPattern, layoutWidth, userName } = get();
            const updatedSettings: AppSettings = { theme: currentTheme, themeId, background, backgroundPattern, layoutWidth, userName };

            // Persist to Chrome Storage
            await storage.set('settings', updatedSettings);
        } catch (error) {
            console.error('Failed to update theme ID:', error);
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
            const { theme, themeId, backgroundPattern, layoutWidth, userName } = get();
            const updatedSettings: AppSettings = { theme, themeId, background, backgroundPattern, layoutWidth, userName };

            // Persist to Chrome Storage
            await storage.set('settings', updatedSettings);
        } catch (error) {
            console.error('Failed to update background:', error);
            throw error;
        }
    },

    /**
     * Set background pattern preference and persist to Chrome Storage
     */
    setBackgroundPattern: async (backgroundPattern: BackgroundPattern) => {
        try {
            // Update local state first for immediate UI feedback
            set({ backgroundPattern });

            // Get current settings and update pattern
            const { theme, themeId, background, layoutWidth, userName } = get();
            const updatedSettings: AppSettings = { theme, themeId, background, backgroundPattern, layoutWidth, userName };

            // Persist to Chrome Storage
            await storage.set('settings', updatedSettings);
        } catch (error) {
            console.error('Failed to update background pattern:', error);
            throw error;
        }
    },

    /**
     * Set layout width preference and persist to Chrome Storage
     */
    setLayoutWidth: async (layoutWidth: LayoutWidth) => {
        try {
            // Update local state first for immediate UI feedback
            set({ layoutWidth });

            // Get current settings and update width
            const { theme, themeId, background, backgroundPattern, userName } = get();
            const updatedSettings: AppSettings = { theme, themeId, background, backgroundPattern, layoutWidth, userName };

            // Persist to Chrome Storage
            await storage.set('settings', updatedSettings);
        } catch (error) {
            console.error('Failed to update layout width:', error);
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
            const { theme, themeId, background, backgroundPattern, layoutWidth } = get();
            const updatedSettings: AppSettings = { theme, themeId, background, backgroundPattern, layoutWidth, userName };

            // Persist to Chrome Storage
            await storage.set('settings', updatedSettings);
        } catch (error) {
            console.error('Failed to update user name:', error);
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
                const themeId = storedSettings.themeId || DEFAULT_SETTINGS.themeId;
                const background = storedSettings.background !== undefined
                    ? storedSettings.background
                    : DEFAULT_SETTINGS.background;
                const backgroundPattern = storedSettings.backgroundPattern || DEFAULT_SETTINGS.backgroundPattern;
                const layoutWidth = storedSettings.layoutWidth || DEFAULT_SETTINGS.layoutWidth;
                const userName = storedSettings.userName !== undefined
                    ? storedSettings.userName
                    : DEFAULT_SETTINGS.userName;

                set({ theme, themeId, background, backgroundPattern, layoutWidth, userName, isInitialized: true });

                // Apply theme to document root
                applyTheme(theme);

                // Apply theme colors
                applyThemeColors(themeId, theme);
            } else {
                // Use default settings and persist them
                set({
                    theme: DEFAULT_SETTINGS.theme,
                    themeId: DEFAULT_SETTINGS.themeId,
                    background: DEFAULT_SETTINGS.background,
                    backgroundPattern: DEFAULT_SETTINGS.backgroundPattern,
                    layoutWidth: DEFAULT_SETTINGS.layoutWidth,
                    userName: DEFAULT_SETTINGS.userName,
                    isInitialized: true,
                });

                // Apply default theme
                applyTheme(DEFAULT_SETTINGS.theme);
                applyThemeColors(DEFAULT_SETTINGS.themeId, DEFAULT_SETTINGS.theme);

                await storage.set('settings', DEFAULT_SETTINGS);
            }
        } catch (error) {
            console.error('Failed to initialize settings from storage:', error);
            // Fall back to defaults on error
            set({
                theme: DEFAULT_SETTINGS.theme,
                themeId: DEFAULT_SETTINGS.themeId,
                background: DEFAULT_SETTINGS.background,
                backgroundPattern: DEFAULT_SETTINGS.backgroundPattern,
                layoutWidth: DEFAULT_SETTINGS.layoutWidth,
                userName: DEFAULT_SETTINGS.userName,
                isInitialized: true,
            });
            applyTheme(DEFAULT_SETTINGS.theme);
            applyThemeColors(DEFAULT_SETTINGS.themeId, DEFAULT_SETTINGS.theme);
        }
    },
}));
