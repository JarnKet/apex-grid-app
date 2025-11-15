import React, { useEffect, useRef, useState } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { Settings, LineChart } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/Dialog';
import type { WidgetProps } from '../../types/widget';

interface ChartSettings {
    symbol: string;
    interval: string;
}

const DEFAULT_SETTINGS: ChartSettings = {
    symbol: 'NASDAQ:AAPL',
    interval: 'D',
};

/**
 * TradingViewChartWidget - Advanced trading chart
 * Full-featured chart with technical indicators
 */
const TradingViewChartWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const containerRef = useRef<HTMLIFrameElement>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [tempSymbol, setTempSymbol] = useState('');

    const settings: ChartSettings = data?.settings || DEFAULT_SETTINGS;

    // Build TradingView widget URL with parameters
    const widgetConfig = {
        autosize: true,
        symbol: settings.symbol,
        interval: settings.interval,
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        enable_publishing: false,
        allow_symbol_change: true,
        support_host: 'https://www.tradingview.com',
    };

    const widgetUrl = `https://s.tradingview.com/widgetembed/?${new URLSearchParams({
        locale: 'en',
        theme: 'dark',
    }).toString()}#${encodeURIComponent(JSON.stringify(widgetConfig))}`;

    const handleSaveSettings = () => {
        if (tempSymbol.trim()) {
            onDataChange?.({
                settings: {
                    ...settings,
                    symbol: tempSymbol.trim().toUpperCase(),
                },
            });
        }
        setSettingsOpen(false);
    };

    const handleOpenSettings = () => {
        setTempSymbol(settings.symbol);
        setSettingsOpen(true);
    };

    return (
        <WidgetWrapper
            id={id}
            title="Trading Chart"
            icon={<LineChart className="h-4 w-4" />}
            actions={
                <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleOpenSettings}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                        >
                            <Settings className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Chart Settings</DialogTitle>
                            <DialogDescription>
                                Configure the trading symbol to display
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Symbol</label>
                                <Input
                                    placeholder="e.g., NASDAQ:AAPL, BINANCE:BTCUSDT"
                                    value={tempSymbol}
                                    onChange={(e) => setTempSymbol(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Format: EXCHANGE:SYMBOL (e.g., NASDAQ:AAPL)
                                </p>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSaveSettings}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            }
        >
            <div className="h-full w-full">
                <iframe
                    ref={containerRef}
                    src={widgetUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                    }}
                    title="TradingView Advanced Chart"
                />
            </div>
        </WidgetWrapper>
    );
};

export const TradingViewChartWidget = React.memo(TradingViewChartWidgetComponent);
