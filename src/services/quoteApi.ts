// Quote API service for fetching quotes
// Uses multiple sources with automatic fallback for reliability

/**
 * Quote data structure
 */
export interface Quote {
    text: string;
    author: string;
}

/**
 * API error types
 */
export class QuoteApiError extends Error {
    readonly statusCode?: number;

    constructor(message: string, statusCode?: number) {
        super(message);
        this.name = 'QuoteApiError';
        this.statusCode = statusCode;
    }
}

/**
 * Fetch a random quote from multiple sources with fallback
 * Tries Quotable.io first, then falls back to alternative sources
 */
export async function fetchQuote(): Promise<Quote> {
    // Try Quotable.io first (most reliable)
    try {
        const response = await fetch('https://api.quotable.io/random', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        // Validate response structure
        if (!data || !data.content || !data.author) {
            throw new Error('Invalid response structure');
        }

        return {
            text: data.content,
            author: data.author
        };
    } catch (error) {
        console.warn('Quotable.io failed, trying alternative source:', error);

        // Fallback to DummyJSON API (reliable, no SSL issues)
        try {
            const response = await fetch('https://dummyjson.com/quotes/random', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            // Validate response structure
            if (!data || !data.quote || !data.author) {
                throw new Error('Invalid response structure');
            }

            return {
                text: data.quote,
                author: data.author
            };
        } catch (fallbackError) {
            console.error('All quote APIs failed:', fallbackError);

            // Throw final error
            throw new QuoteApiError(
                `Failed to fetch quote from all sources: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }
}
