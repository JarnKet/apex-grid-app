import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Chrome Storage API
const mockStorage = new Map<string, any>();

(globalThis as any).chrome = {
    storage: {
        sync: {
            get: vi.fn((keys: string | string[] | null) => {
                if (keys === null) {
                    // Return all stored data
                    const result: Record<string, any> = {};
                    mockStorage.forEach((value, key) => {
                        result[key] = value;
                    });
                    return Promise.resolve(result);
                }

                if (typeof keys === 'string') {
                    const value = mockStorage.get(keys);
                    return Promise.resolve(value !== undefined ? { [keys]: value } : {});
                }

                if (Array.isArray(keys)) {
                    const result: Record<string, any> = {};
                    keys.forEach(key => {
                        const value = mockStorage.get(key);
                        if (value !== undefined) {
                            result[key] = value;
                        }
                    });
                    return Promise.resolve(result);
                }

                return Promise.resolve({});
            }),
            set: vi.fn((items: Record<string, any>) => {
                Object.entries(items).forEach(([key, value]) => {
                    mockStorage.set(key, value);
                });
                return Promise.resolve();
            }),
            remove: vi.fn((keys: string | string[]) => {
                const keysArray = typeof keys === 'string' ? [keys] : keys;
                keysArray.forEach(key => mockStorage.delete(key));
                return Promise.resolve();
            }),
            clear: vi.fn(() => {
                mockStorage.clear();
                return Promise.resolve();
            }),
            getBytesInUse: vi.fn(() => {
                return Promise.resolve(0);
            }),
        },
    },
} as any;

// Helper to clear mock storage between tests
export function clearMockStorage() {
    mockStorage.clear();
    vi.clearAllMocks();
}

// Helper to get mock storage state
export function getMockStorageState() {
    const state: Record<string, any> = {};
    mockStorage.forEach((value, key) => {
        state[key] = value;
    });
    return state;
}

// Helper to set mock storage state
export function setMockStorageState(state: Record<string, any>) {
    mockStorage.clear();
    Object.entries(state).forEach(([key, value]) => {
        mockStorage.set(key, value);
    });
}
