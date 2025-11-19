import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useSettingsStore } from './useSettingsStore';
import { clearMockStorage, getMockStorageState } from '../test/setup';
import type { AppSettings } from '../types/storage';

describe('useSettingsStore', () => {
    beforeEach(() => {
        clearMockStorage();
        // Reset store to initial state
        useSettingsStore.setState({
            theme: 'dark',
            background: null,
            userName: null,
            isInitialized: false,
        });
        // Clear document classes
        document.documentElement.classList.remove('dark');
    });

    afterEach(() => {
        document.documentElement.classList.remove('dark');
    });

    describe('setTheme', () => {
        it('should update theme and persist to storage', async () => {
            await useSettingsStore.getState().setTheme('light');

            // Check state updated
            expect(useSettingsStore.getState().theme).toBe('light');

            // Check persisted to storage
            const storageState = getMockStorageState();
            expect(storageState.settings.theme).toBe('light');
        });

        it('should apply dark theme class to document', async () => {
            await useSettingsStore.getState().setTheme('dark');

            expect(document.documentElement.classList.contains('dark')).toBe(true);
        });

        it('should remove dark theme class for light theme', async () => {
            document.documentElement.classList.add('dark');

            await useSettingsStore.getState().setTheme('light');

            expect(document.documentElement.classList.contains('dark')).toBe(false);
        });

        it('should preserve background setting when updating theme', async () => {
            useSettingsStore.setState({ background: '#ff0000' });

            await useSettingsStore.getState().setTheme('light');

            const storageState = getMockStorageState();
            expect(storageState.settings.background).toBe('#ff0000');
        });
    });

    describe('setBackground', () => {
        it('should update background and persist to storage', async () => {
            const testBackground = '#123456';

            await useSettingsStore.getState().setBackground(testBackground);

            // Check state updated
            expect(useSettingsStore.getState().background).toBe(testBackground);

            // Check persisted to storage
            const storageState = getMockStorageState();
            expect(storageState.settings.background).toBe(testBackground);
        });

        it('should allow setting background to null', async () => {
            useSettingsStore.setState({ background: '#ff0000' });

            await useSettingsStore.getState().setBackground(null);

            expect(useSettingsStore.getState().background).toBeNull();

            const storageState = getMockStorageState();
            expect(storageState.settings.background).toBeNull();
        });

        it('should preserve theme setting when updating background', async () => {
            useSettingsStore.setState({ theme: 'light' });

            await useSettingsStore.getState().setBackground('#ff0000');

            const storageState = getMockStorageState();
            expect(storageState.settings.theme).toBe('light');
        });
    });

    describe('initializeSettings', () => {
        it('should load settings from storage', async () => {
            const storedSettings: AppSettings = {
                theme: 'light',
                themeId: 'mono',
                background: '#abcdef',
                backgroundPattern: 'dots',
                layoutWidth: 'full',
                userName: 'TestUser',
            };

            await chrome.storage.sync.set({ settings: storedSettings });

            await useSettingsStore.getState().initializeSettings();

            expect(useSettingsStore.getState().theme).toBe('light');
            expect(useSettingsStore.getState().background).toBe('#abcdef');
            expect(useSettingsStore.getState().userName).toBe('TestUser');
            expect(useSettingsStore.getState().isInitialized).toBe(true);
        });

        it('should apply theme from storage to document', async () => {
            await chrome.storage.sync.set({
                settings: { theme: 'dark', background: null, userName: null },
            });

            await useSettingsStore.getState().initializeSettings();

            expect(document.documentElement.classList.contains('dark')).toBe(true);
        });

        it('should use default settings when storage is empty', async () => {
            await useSettingsStore.getState().initializeSettings();

            expect(useSettingsStore.getState().theme).toBe('dark');
            expect(useSettingsStore.getState().background).toBeNull();
            expect(useSettingsStore.getState().userName).toBeNull();
            expect(useSettingsStore.getState().isInitialized).toBe(true);

            // Should persist defaults
            const storageState = getMockStorageState();
            expect(storageState.settings).toEqual({
                theme: 'dark',
                themeId: 'mono',
                background: null,
                backgroundPattern: 'dots',
                layoutWidth: 'full',
                userName: null
            });
        });

        it('should handle partial settings in storage', async () => {
            await chrome.storage.sync.set({
                settings: { theme: 'light' },
            });

            await useSettingsStore.getState().initializeSettings();

            expect(useSettingsStore.getState().theme).toBe('light');
            expect(useSettingsStore.getState().background).toBeNull();
        });

        it('should handle storage errors gracefully', async () => {
            // Mock storage error
            chrome.storage.sync.get = () => Promise.reject(new Error('Storage error'));

            await useSettingsStore.getState().initializeSettings();

            // Should fall back to defaults
            expect(useSettingsStore.getState().theme).toBe('dark');
            expect(useSettingsStore.getState().background).toBeNull();
            expect(useSettingsStore.getState().userName).toBeNull();
            expect(useSettingsStore.getState().isInitialized).toBe(true);
        });
    });

    describe('setUserName', () => {
        it('should update userName and persist to storage', async () => {
            const testName = 'John Doe';

            await useSettingsStore.getState().setUserName(testName);

            // Check state updated
            expect(useSettingsStore.getState().userName).toBe(testName);

            // Check persisted to storage
            const storageState = getMockStorageState();
            expect(storageState.settings.userName).toBe(testName);
        });

        it('should allow setting userName to null', async () => {
            useSettingsStore.setState({ userName: 'John Doe' });

            await useSettingsStore.getState().setUserName(null);

            expect(useSettingsStore.getState().userName).toBeNull();

            const storageState = getMockStorageState();
            expect(storageState.settings.userName).toBeNull();
        });

        it('should validate userName length (max 50 chars)', async () => {
            const longName = 'a'.repeat(51);

            await expect(
                useSettingsStore.getState().setUserName(longName)
            ).rejects.toThrow('Name must be 50 characters or less');
        });

        it('should validate userName contains only alphanumeric and spaces', async () => {
            await expect(
                useSettingsStore.getState().setUserName('John@Doe')
            ).rejects.toThrow('Name can only contain letters, numbers, and spaces');

            await expect(
                useSettingsStore.getState().setUserName('John-Doe')
            ).rejects.toThrow('Name can only contain letters, numbers, and spaces');
        });

        it('should accept valid userName with letters, numbers, and spaces', async () => {
            const validName = 'John Doe 123';

            await useSettingsStore.getState().setUserName(validName);

            expect(useSettingsStore.getState().userName).toBe(validName);
        });

        it('should preserve other settings when updating userName', async () => {
            useSettingsStore.setState({ theme: 'light' });

            await useSettingsStore.getState().setUserName('Jane');

            const storageState = getMockStorageState();
            expect(storageState.settings.theme).toBe('light');
        });
    });
});
