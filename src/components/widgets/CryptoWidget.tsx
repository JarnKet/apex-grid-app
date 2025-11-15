import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { RefreshCw, TrendingUp, TrendingDown, Bitcoin } from 'lucide-react';
import { Button } from '../ui/Button';
import type { WidgetProps } from '../../types/widget';
import { fetchCryptoPrices, formatPrice, formatChange, type CryptoPrice } from '../../services/cryptoApi';

interface CryptoWidgetData {
    prices: CryptoPrice[];
    lastFetched: number;
}

/**
 * CryptoWidget displays cryptocurrency and gold prices
 * - Shows Bitcoin, Ethereum, and Gold prices
 * - Displays 24-hour price changes
 * - Caches data for 5 minutes
 * - Uses CoinGecko API (free tier)
 */
const CryptoWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const widgetData = data as CryptoWidgetData | undefined;
    const prices = widgetData?.prices || [];
    const lastFetched = widgetData?.lastFetched || 0;

    // Cache duration: 5 minutes
    const CACHE_DURATION = 5 * 60 * 1000;

    /**
     * Fetch crypto prices
     */
    const fetchPrices = async () => {
        setLoading(true);
        setError(null);

        try {
            const cryptoPrices = await fetchCryptoPrices();

            const newData: CryptoWidgetData = {
                prices: cryptoPrices,
                lastFetched: Date.now(),
            };

            onDataChange?.(newData);
        } catch (err) {
            console.error('Failed to fetch crypto prices:', err);
            setError(err instanceof Error ? err.message : 'Failed to load prices');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Initialize or refresh prices
     */
    useEffect(() => {
        const shouldFetch = !lastFetched || Date.now() - lastFetched > CACHE_DURATION;

        if (shouldFetch && !loading) {
            fetchPrices();
        }
    }, []);

    return (
        <WidgetWrapper id={id} title="Crypto & Gold">
            <div className="flex flex-col h-full">
                {/* Header with refresh button */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted-foreground">Live Prices</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={fetchPrices}
                        disabled={loading}
                        className="h-7 w-7"
                        aria-label="Refresh prices"
                    >
                        <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                {/* Loading state */}
                {loading && prices.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="flex flex-col items-center justify-center h-full space-y-3">
                        <Bitcoin className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground text-center">{error}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchPrices}
                            disabled={loading}
                        >
                            <RefreshCw className="h-3 w-3 mr-2" />
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Prices display */}
                {!loading && !error && prices.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-muted-foreground">No price data available</p>
                    </div>
                )}

                {prices.length > 0 && (
                    <div className="space-y-3">
                        {prices.map((item) => (
                            <div
                                key={item.symbol}
                                className="flex items-center justify-between p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold">{item.symbol}</span>
                                        <span className="text-xs text-muted-foreground">{item.name}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-bold">{formatPrice(item.price)}</span>
                                    <div
                                        className={`flex items-center gap-1 text-xs ${item.change24h >= 0 ? 'text-chart-2' : 'text-destructive'
                                            }`}
                                    >
                                        {item.change24h >= 0 ? (
                                            <TrendingUp className="h-3 w-3" />
                                        ) : (
                                            <TrendingDown className="h-3 w-3" />
                                        )}
                                        <span>{formatChange(item.change24h)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </WidgetWrapper>
    );
};

// Memoize component to prevent unnecessary re-renders
export const CryptoWidget = React.memo(CryptoWidgetComponent);
