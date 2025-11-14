// Quote API service for fetching quotes from Quotable.io

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
 * Fetch with retry logic and exponential backoff
 */
async function fetchWithRetry(
    url: string,
    maxRetries: number = 3
): Promise<Response> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(url);

            if (response.ok) {
                return response;
            }

            // If not ok, throw error with status code
            throw new QuoteApiError(
                `API request failed with status ${response.status}`,
                response.status
            );
        } catch (error) {
            lastError = error instanceof Error ? error : new Error('Unknown error');

            // If this is the last attempt, throw the error
            if (attempt === maxRetries - 1) {
                break;
            }

            // Exponential backoff: wait 2^attempt seconds
            const delayMs = Math.pow(2, attempt) * 1000;
            console.warn(
                `Quote API request failed (attempt ${attempt + 1}/${maxRetries}). Retrying in ${delayMs}ms...`,
                error
            );

            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }

    // All retries failed
    throw new QuoteApiError(
        `Failed to fetch quote after ${maxRetries} attempts: ${lastError?.message}`,
        lastError instanceof QuoteApiError ? lastError.statusCode : undefined
    );
}

/**
 * Fetch a random quote from Quotable.io API
 */
export async function fetchQuote(): Promise<Quote> {
    try {
        const response = await fetchWithRetry('https://api.quotable.io/random');
        const data = await response.json();

        // Validate response structure
        if (!data.content || !data.author) {
            throw new QuoteApiError('Invalid API response structure');
        }

        return {
            text: data.content,
            author: data.author
        };
    } catch (error) {
        // Re-throw QuoteApiError as-is
        if (error instanceof QuoteApiError) {
            throw error;
        }

        // Wrap other errors
        throw new QuoteApiError(
            `Failed to fetch quote: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
}
