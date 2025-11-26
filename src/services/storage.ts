// Chrome Storage API abstraction layer for ApexGrid

import type { StorageSchema } from '../types/storage';

/**
 * Storage service error types
 */
export class StorageQuotaExceededError extends Error {
    constructor(message: string = 'Storage quota exceeded') {
        super(message);
        this.name = 'StorageQuotaExceededError';
    }
}

export class StorageValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'StorageValidationError';
    }
}

/**
 * Calculate approximate size of data in bytes
 */
function getDataSize(value: any): number {
    return new Blob([JSON.stringify(value)]).size;
}

/**
 * Validates data before storage operations
 */
function validateData(key: string, value: any): void {
    if (value === undefined) {
        throw new StorageValidationError(`Value for key "${key}" cannot be undefined`);
    }

    // Check if value is serializable
    try {
        JSON.stringify(value);
    } catch (error) {
        throw new StorageValidationError(
            `Value for key "${key}" is not serializable: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }

    // Check size limit (8KB = 8192 bytes)
    const size = getDataSize(value);
    const MAX_SIZE = 8192;

    if (size > MAX_SIZE) {
        console.warn(`Data for key "${key}" is ${size} bytes, exceeds ${MAX_SIZE} bytes limit`);
        throw new StorageValidationError(
            `Data for key "${key}" is too large (${size} bytes). Maximum is ${MAX_SIZE} bytes. Consider reducing the data size.`
        );
    }

    // Validate specific schema keys
    if (key === 'layout' && !Array.isArray(value)) {
        throw new StorageValidationError('Layout must be an array');
    }

    if (key === 'widgets' && !Array.isArray(value)) {
        throw new StorageValidationError('Widgets must be an array');
    }

    if (key === 'widgetData' && typeof value !== 'object') {
        throw new StorageValidationError('Widget data must be an object');
    }

    if (key === 'settings' && typeof value !== 'object') {
        throw new StorageValidationError('Settings must be an object');
    }
}

/**
 * Check if Chrome Storage API is available
 */
const isChromeStorageAvailable = (): boolean => {
    return typeof chrome !== 'undefined' && !!chrome.storage && !!chrome.storage.sync;
};

/**
 * Storage service with fallback to localStorage
 */
export const storage = {
    /**
     * Get a value from storage by key
     */
    async get<T>(key: string): Promise<T | null> {
        try {
            if (isChromeStorageAvailable()) {
                const result = await chrome.storage.sync.get(key);
                return result[key] !== undefined ? (result[key] as T) : null;
            } else {
                // Fallback to localStorage
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            }
        } catch (error) {
            console.error(`Failed to get key "${key}" from storage:`, error);
            throw error;
        }
    },

    /**
     * Set a value in storage with retry logic
     * @param key - Storage key
     * @param value - Value to store
     * @param retries - Maximum number of retry attempts (default: 3)
     */
    async set(key: string, value: any, retries: number = 3): Promise<void> {
        // Validate data before attempting storage
        validateData(key, value);

        if (!isChromeStorageAvailable()) {
            // Fallback to localStorage
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return;
            } catch (error) {
                if (error instanceof Error && error.name === 'QuotaExceededError') {
                    throw new StorageQuotaExceededError(
                        'Storage quota exceeded. Please remove some data or widgets.'
                    );
                }
                throw error;
            }
        }

        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                await chrome.storage.sync.set({ [key]: value });
                return; // Success - exit function
            } catch (error) {
                // Handle quota exceeded error - don't retry
                if (error instanceof Error && error.message.includes('QUOTA_BYTES')) {
                    throw new StorageQuotaExceededError(
                        'Storage quota exceeded. Please remove some data or widgets.'
                    );
                }

                // Re-throw validation errors - don't retry
                if (error instanceof StorageValidationError) {
                    throw error;
                }

                // Log the error
                console.error(
                    `Failed to set key "${key}" in storage (attempt ${attempt + 1}/${retries}):`,
                    error
                );

                // If this was the last attempt, throw the error
                if (attempt === retries - 1) {
                    console.error(
                        `Failed to set key "${key}" after ${retries} attempts. Giving up.`
                    );
                    throw error;
                }

                // Exponential backoff: 100ms, 200ms, 400ms
                const backoffDelay = Math.pow(2, attempt) * 100;
                await new Promise(resolve => setTimeout(resolve, backoffDelay));
            }
        }
    },

    /**
     * Get all data from storage
     */
    async getAll(): Promise<Partial<StorageSchema>> {
        try {
            if (isChromeStorageAvailable()) {
                const result = await chrome.storage.sync.get(null);
                return result as Partial<StorageSchema>;
            } else {
                // Fallback to localStorage
                const result: Partial<StorageSchema> = {};
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key) {
                        const value = localStorage.getItem(key);
                        if (value) {
                            result[key as keyof StorageSchema] = JSON.parse(value);
                        }
                    }
                }
                return result;
            }
        } catch (error) {
            console.error('Failed to get all data from storage:', error);
            throw error;
        }
    },

    /**
     * Clear all data from storage
     */
    async clear(): Promise<void> {
        try {
            if (isChromeStorageAvailable()) {
                await chrome.storage.sync.clear();
            } else {
                localStorage.clear();
            }
        } catch (error) {
            console.error('Failed to clear storage:', error);
            throw error;
        }
    },

    /**
     * Get storage usage information
     */
    async getBytesInUse(keys?: string | string[]): Promise<number> {
        try {
            if (isChromeStorageAvailable()) {
                return await chrome.storage.sync.getBytesInUse(keys);
            } else {
                // Estimate size for localStorage
                let size = 0;
                if (keys) {
                    const keyArray = Array.isArray(keys) ? keys : [keys];
                    keyArray.forEach(key => {
                        const value = localStorage.getItem(key);
                        if (value) {
                            size += value.length;
                        }
                    });
                } else {
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key) {
                            const value = localStorage.getItem(key);
                            if (value) {
                                size += value.length;
                            }
                        }
                    }
                }
                return size;
            }
        } catch (error) {
            console.error('Failed to get storage bytes in use:', error);
            throw error;
        }
    },

    /**
     * Remove specific keys from storage
     */
    async remove(keys: string | string[]): Promise<void> {
        try {
            if (isChromeStorageAvailable()) {
                await chrome.storage.sync.remove(keys);
            } else {
                const keyArray = Array.isArray(keys) ? keys : [keys];
                keyArray.forEach(key => localStorage.removeItem(key));
            }
        } catch (error) {
            console.error('Failed to remove keys from storage:', error);
            throw error;
        }
    },
};
