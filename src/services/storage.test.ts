import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage, StorageQuotaExceededError, StorageValidationError } from './storage';
import { clearMockStorage, getMockStorageState } from '../test/setup';

describe('Storage Service', () => {
    beforeEach(() => {
        clearMockStorage();
    });

    describe('get', () => {
        it('should retrieve a value from storage', async () => {
            await chrome.storage.sync.set({ testKey: 'testValue' });
            const result = await storage.get<string>('testKey');
            expect(result).toBe('testValue');
        });

        it('should return null for non-existent keys', async () => {
            const result = await storage.get<string>('nonExistent');
            expect(result).toBeNull();
        });

        it('should retrieve complex objects', async () => {
            const testData = { name: 'Test', count: 42, nested: { value: true } };
            await chrome.storage.sync.set({ complexKey: testData });
            const result = await storage.get<typeof testData>('complexKey');
            expect(result).toEqual(testData);
        });
    });

    describe('set', () => {
        it('should store a value in storage', async () => {
            await storage.set('testKey', 'testValue');
            const state = getMockStorageState();
            expect(state.testKey).toBe('testValue');
        });

        it('should store arrays', async () => {
            const testArray = [1, 2, 3, 4, 5];
            await storage.set('arrayKey', testArray);
            const result = await storage.get<number[]>('arrayKey');
            expect(result).toEqual(testArray);
        });

        it('should store objects', async () => {
            const testObject = { id: '1', type: 'test', enabled: true };
            await storage.set('objectKey', testObject);
            const result = await storage.get<typeof testObject>('objectKey');
            expect(result).toEqual(testObject);
        });

        it('should throw StorageValidationError for undefined values', async () => {
            await expect(storage.set('testKey', undefined)).rejects.toThrow(StorageValidationError);
        });

        it('should throw StorageValidationError for non-array layout', async () => {
            await expect(storage.set('layout', 'not an array')).rejects.toThrow(StorageValidationError);
        });

        it('should throw StorageValidationError for non-array widgets', async () => {
            await expect(storage.set('widgets', 'not an array')).rejects.toThrow(StorageValidationError);
        });

        it('should throw StorageValidationError for non-object widgetData', async () => {
            await expect(storage.set('widgetData', 'not an object')).rejects.toThrow(StorageValidationError);
        });

        it('should throw StorageValidationError for non-object settings', async () => {
            await expect(storage.set('settings', 'not an object')).rejects.toThrow(StorageValidationError);
        });

        it('should retry on transient failures with exponential backoff', async () => {
            let attemptCount = 0;
            const originalSet = chrome.storage.sync.set;

            // Mock to fail twice, then succeed
            chrome.storage.sync.set = vi.fn().mockImplementation(() => {
                attemptCount++;
                if (attemptCount < 3) {
                    return Promise.reject(new Error('Transient error'));
                }
                return originalSet({ testKey: 'testValue' });
            });

            await storage.set('testKey', 'testValue', 3);

            expect(attemptCount).toBe(3);
            const result = await storage.get<string>('testKey');
            expect(result).toBe('testValue');
        });

        it('should throw error after max retries exceeded', async () => {
            const originalSet = chrome.storage.sync.set;

            // Mock to always fail
            chrome.storage.sync.set = vi.fn().mockRejectedValue(new Error('Persistent error'));

            await expect(storage.set('testKey', 'testValue', 3)).rejects.toThrow('Persistent error');

            // Should have tried 3 times
            expect(chrome.storage.sync.set).toHaveBeenCalledTimes(3);

            // Restore original
            chrome.storage.sync.set = originalSet;
        });

        it('should not retry on quota exceeded errors', async () => {
            const originalSet = chrome.storage.sync.set;
            const quotaError = new Error('QUOTA_BYTES exceeded');

            chrome.storage.sync.set = vi.fn().mockRejectedValue(quotaError);

            await expect(storage.set('testKey', 'testValue', 3)).rejects.toThrow(StorageQuotaExceededError);

            // Should only try once (no retries for quota errors)
            expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);

            // Restore original
            chrome.storage.sync.set = originalSet;
        });

        it('should not retry on validation errors', async () => {
            // Validation happens before any storage attempts
            await expect(storage.set('testKey', undefined, 3)).rejects.toThrow(StorageValidationError);
        });

        it('should use default retry count of 3', async () => {
            let attemptCount = 0;
            const originalSet = chrome.storage.sync.set;

            chrome.storage.sync.set = vi.fn().mockImplementation(() => {
                attemptCount++;
                return Promise.reject(new Error('Always fails'));
            });

            await expect(storage.set('testKey', 'testValue')).rejects.toThrow('Always fails');

            // Should use default of 3 retries
            expect(attemptCount).toBe(3);

            // Restore original
            chrome.storage.sync.set = originalSet;
        });
    });

    describe('getAll', () => {
        it('should retrieve all data from storage', async () => {
            await chrome.storage.sync.set({
                key1: 'value1',
                key2: 'value2',
                key3: { nested: 'value3' },
            });

            const result = await storage.getAll();
            expect(result).toEqual({
                key1: 'value1',
                key2: 'value2',
                key3: { nested: 'value3' },
            });
        });

        it('should return empty object when storage is empty', async () => {
            const result = await storage.getAll();
            expect(result).toEqual({});
        });
    });

    describe('clear', () => {
        it('should clear all data from storage', async () => {
            await chrome.storage.sync.set({
                key1: 'value1',
                key2: 'value2',
            });

            await storage.clear();
            const result = await storage.getAll();
            expect(result).toEqual({});
        });
    });

    describe('remove', () => {
        it('should remove a single key', async () => {
            await chrome.storage.sync.set({
                key1: 'value1',
                key2: 'value2',
            });

            await storage.remove('key1');
            const result = await storage.getAll();
            expect(result).toEqual({ key2: 'value2' });
        });

        it('should remove multiple keys', async () => {
            await chrome.storage.sync.set({
                key1: 'value1',
                key2: 'value2',
                key3: 'value3',
            });

            await storage.remove(['key1', 'key3']);
            const result = await storage.getAll();
            expect(result).toEqual({ key2: 'value2' });
        });
    });

    describe('getBytesInUse', () => {
        it('should return bytes in use', async () => {
            const result = await storage.getBytesInUse();
            expect(typeof result).toBe('number');
        });
    });
});
