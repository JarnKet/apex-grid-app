import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { Quote } from 'lucide-react';
import type { WidgetProps, CachedQuote } from '../../types/widget';
import { fetchQuote, QuoteApiError } from '../../services/quoteApi';

/**
 * Fallback quote displayed when API fails
 */
const FALLBACK_QUOTE: CachedQuote = {
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    cachedAt: 0,
};

/**
 * Cache duration: 24 hours in milliseconds
 */
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

/**
 * QuoteWidget displays a daily motivational quote
 * - Fetches quote from Quotable.io API on mount
 * - Caches quote for 24 hours
 * - Displays cached quote immediately while fetching update
 * - Shows fallback quote on API failure
 */
const QuoteWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const [quote, setQuote] = useState<CachedQuote | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get cached quote from widget data
    const cachedQuote: CachedQuote | undefined = data?.quote;

    useEffect(() => {
        // Function to fetch and cache a new quote
        const fetchAndCacheQuote = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const newQuote = await fetchQuote();
                const cachedData: CachedQuote = {
                    text: newQuote.text,
                    author: newQuote.author,
                    cachedAt: Date.now(),
                };

                // Update local state
                setQuote(cachedData);

                // Persist to widget store
                if (onDataChange) {
                    onDataChange({ quote: cachedData });
                }
            } catch (err) {
                console.error('Failed to fetch quote:', err);
                setError(err instanceof QuoteApiError ? err.message : 'Failed to fetch quote');

                // Use fallback quote if no cached quote exists
                if (!cachedQuote) {
                    setQuote(FALLBACK_QUOTE);
                }
            } finally {
                setIsLoading(false);
            }
        };

        // Check if we have a cached quote
        if (cachedQuote) {
            // Display cached quote immediately
            setQuote(cachedQuote);

            // Check if cache is expired (older than 24 hours)
            const cacheAge = Date.now() - cachedQuote.cachedAt;
            const isCacheExpired = cacheAge > CACHE_DURATION_MS;

            if (isCacheExpired) {
                // Fetch new quote in background
                fetchAndCacheQuote();
            }
        } else {
            // No cached quote, fetch immediately
            fetchAndCacheQuote();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, cachedQuote?.cachedAt]); // Only run on mount or when widget id changes

    // Display quote (cached, fetched, or fallback)
    const displayQuote = quote || FALLBACK_QUOTE;

    return (
        <WidgetWrapper id={id} title="Daily Quote" icon={<Quote className="h-4 w-4" />}>
            <div className="flex flex-col items-center justify-center h-full px-6 py-4">
                {isLoading && !quote ? (
                    <div className="text-center">
                        <div className="text-sm text-muted-foreground animate-pulse">
                            Loading quote...
                        </div>
                    </div>
                ) : (
                    <>
                        <blockquote className="text-center space-y-4">
                            <p className="text-lg italic leading-relaxed">
                                "{displayQuote.text}"
                            </p>
                            <footer className="text-sm text-muted-foreground">
                                — {displayQuote.author}
                            </footer>
                        </blockquote>

                        {error && (
                            <div className="mt-4 text-xs text-muted-foreground">
                                {cachedQuote ? '(Showing cached quote)' : '(Showing fallback quote)'}
                            </div>
                        )}
                    </>
                )}
            </div>
        </WidgetWrapper>
    );
};

// Memoize component to prevent unnecessary re-renders
export const QuoteWidget = React.memo(QuoteWidgetComponent);
