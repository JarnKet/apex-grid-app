import React, { useEffect, useRef, useState } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { Settings, BarChart3 } from 'lucide-react';
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

interface MiniSettings {
    symbol: string;
}

const DEFAULT_SETTINGS: MiniSettings = {
    symbol: 'NASDAQ:AAPL',
};

/**
 * TradingViewMiniWidget - Compact symbol overview
 * Shows price, change, and mini chart
 */
const TradingViewMiniWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const containerRef = useRef<HTMLIFrameElement>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [tempSymbol, setTempSymbol] = useState('');

    const settings: MiniSettings = data?.settings || DEFAULT_SETTINGS;

    // Build TradingView widget URL with parameters
    const widgetConfig = {
        symbol: settings.symbol,
        width: '100%',
        height: '100%',
        locale: 'en',
        dateRange: '12M',
        colorTheme: 'dark',
        isTransparent: true,
        autosize: true,
        largeChartUrl: '',
    };

    const widgetUrl = `https://s.tradingview.com/embed-widget/mini-symbol-overview/?${new URLSearchParams({
        locale: 'en',
        colorTheme: 'dark',
        isTransparent: 'true',
    }).toString()}#${encodeURIComponent(JSON.stringify(widgetConfig))}`;

    const handleSaveSettings = () => {
        if (tempSymbol.trim()) {
            onDataChange?.({
                settings: {
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
            title="Symbol Overview"
            icon={<BarChart3 className="h-4 w-4" />}
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
                            <DialogTitle>Symbol Settings</DialogTitle>
                            <DialogDescription>
                                Configure the symbol to display
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
                                    Format: EXCHANGE:SYMBOL
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
                    title="TradingView Mini Symbol Overview"
                />
            </div>
        </WidgetWrapper>
    );
};

export const TradingViewMiniWidget = React.memo(TradingViewMiniWidgetComponent);
