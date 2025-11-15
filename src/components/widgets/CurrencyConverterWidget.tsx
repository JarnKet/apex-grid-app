import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { DollarSign, RefreshCw, ArrowDownUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { WidgetProps } from '../../types/widget';

interface ExchangeRates {
    [key: string]: number;
}

interface CurrencyData {
    rates: ExchangeRates;
    lastFetched: number;
}

const POPULAR_CURRENCIES = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
];

const CurrencyConverterWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const [amount, setAmount] = useState('100');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const widgetData = data as CurrencyData;
    const rates = widgetData?.rates || {};
    const lastFetched = widgetData?.lastFetched || 0;

    const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

    const fetchRates = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            if (!response.ok) throw new Error('Failed to fetch rates');

            const data = await response.json();
            onDataChange?.({
                rates: data.rates,
                lastFetched: Date.now(),
            });
        } catch (err) {
            setError('Failed to fetch exchange rates');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const shouldFetch = !lastFetched || Date.now() - lastFetched > CACHE_DURATION;
        if (shouldFetch && !loading) {
            fetchRates();
        }
    }, []);

    const convertCurrency = () => {
        const amt = parseFloat(amount);
        if (isNaN(amt) || !rates[fromCurrency] || !rates[toCurrency]) return 0;

        const inUSD = amt / rates[fromCurrency];
        return (inUSD * rates[toCurrency]).toFixed(2);
    };

    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    return (
        <WidgetWrapper
            id={id}
            title="Currency Converter"
            icon={<DollarSign className="h-4 w-4" />}
            actions={
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={fetchRates}
                    disabled={loading}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            }
        >
            <div className="flex flex-col h-full p-3 space-y-4">
                {error && (
                    <div className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                        {error}
                    </div>
                )}

                {/* Amount input */}
                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Amount</label>
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="100"
                    />
                </div>

                {/* From currency */}
                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">From</label>
                    <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="w-full p-2 rounded-md border border-input bg-background text-sm"
                    >
                        {POPULAR_CURRENCIES.map((curr) => (
                            <option key={curr.code} value={curr.code}>
                                {curr.symbol} {curr.code} - {curr.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Swap button */}
                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={swapCurrencies}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <ArrowDownUp className="h-4 w-4" />
                    </Button>
                </div>

                {/* To currency */}
                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">To</label>
                    <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="w-full p-2 rounded-md border border-input bg-background text-sm"
                    >
                        {POPULAR_CURRENCIES.map((curr) => (
                            <option key={curr.code} value={curr.code}>
                                {curr.symbol} {curr.code} - {curr.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Result */}
                <div className="p-4 rounded-lg bg-primary/10 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Converted Amount</div>
                    <div className="text-2xl font-bold">
                        {POPULAR_CURRENCIES.find(c => c.code === toCurrency)?.symbol}
                        {convertCurrency()}
                    </div>
                </div>

                {lastFetched > 0 && (
                    <div className="text-xs text-muted-foreground text-center">
                        Updated {new Date(lastFetched).toLocaleTimeString()}
                    </div>
                )}
            </div>
        </WidgetWrapper>
    );
};

export const CurrencyConverterWidget = React.memo(CurrencyConverterWidgetComponent);
