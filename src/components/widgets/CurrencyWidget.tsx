import React, { useEffect, useState } from 'react';
import { fetchExchangeRates, type ExchangeRates } from '../../services/currencyApi';

interface WidgetProps {
    id: string;
    data?: {
        rates?: ExchangeRates['rates'];
        lastUpdate?: number;
    };
    onDataChange?: (data: any) => void;
}

const CurrencyWidgetComponent: React.FC<WidgetProps> = ({ data, onDataChange }) => {
    const [rates, setRates] = useState<ExchangeRates['rates'] | null>(data?.rates || null);
    const [lastUpdate, setLastUpdate] = useState<number | null>(data?.lastUpdate || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadRates = async () => {
        setLoading(true);
        setError(null);

        try {
            const exchangeRates = await fetchExchangeRates();
            setRates(exchangeRates.rates);
            setLastUpdate(exchangeRates.lastUpdate);

            // Persist to storage
            if (onDataChange) {
                onDataChange({
                    rates: exchangeRates.rates,
                    lastUpdate: exchangeRates.lastUpdate
                });
            }
        } catch (err) {
            console.error('Failed to load exchange rates:', err);
            setError('Failed to load rates');

            // Display cached rates on failure
            if (data?.rates) {
                setRates(data.rates);
                setLastUpdate(data.lastUpdate || null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Load rates on mount
        loadRates();

        // Set up 60-minute auto-refresh
        const intervalId = setInterval(() => {
            loadRates();
        }, 60 * 60 * 1000); // 60 minutes

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run on mount

    const formatLastUpdate = (timestamp: number | null) => {
        if (!timestamp) return 'Never';
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <div className="p-4 h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Currency Exchange</h3>

            {loading && !rates && (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    Loading rates...
                </div>
            )}

            {error && !rates && (
                <div className="flex-1 flex items-center justify-center text-red-500">
                    {error}
                </div>
            )}

            {rates && (
                <div className="flex-1 flex flex-col justify-center space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">USD</span>
                        <span className="text-lg font-bold">${rates.USD.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">THB</span>
                        <span className="text-lg font-bold">฿{rates.THB.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">LAK</span>
                        <span className="text-lg font-bold">₭{rates.LAK.toFixed(2)}</span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                            Last updated: {formatLastUpdate(lastUpdate)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

// Memoize component to prevent unnecessary re-renders
export const CurrencyWidget = React.memo(CurrencyWidgetComponent);
