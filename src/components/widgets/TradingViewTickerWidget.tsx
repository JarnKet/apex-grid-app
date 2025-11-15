import React, { useEffect, useRef } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { TrendingUp } from 'lucide-react';
import type { WidgetProps } from '../../types/widget';

/**
 * TradingViewTickerWidget - Displays a ticker tape of market symbols
 * Shows real-time prices scrolling horizontally
 */
const TradingViewTickerWidgetComponent: React.FC<WidgetProps> = ({ id }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Build TradingView widget URL with parameters
    const widgetConfig = {
        symbols: [
            { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
            { proName: 'FOREXCOM:NSXUSD', title: 'US 100' },
            { proName: 'FX_IDC:EURUSD', title: 'EUR to USD' },
            { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
            { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' },
        ],
        showSymbolLogo: true,
        colorTheme: 'dark',
        isTransparent: true,
        displayMode: 'regular',
        locale: 'en',
    };

    const widgetUrl = `https://s.tradingview.com/embed-widget/ticker-tape/?${new URLSearchParams({
        locale: 'en',
        colorTheme: 'dark',
        isTransparent: 'true',
    }).toString()}#${encodeURIComponent(JSON.stringify(widgetConfig))}`;

    return (
        <WidgetWrapper id={id} title="Market Ticker" icon={<TrendingUp className="h-4 w-4" />}>
            <div className="h-full w-full" style={{ minHeight: '120px' }}>
                <iframe
                    ref={iframeRef}
                    src={widgetUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                    }}
                    title="TradingView Ticker Tape"
                />
            </div>
        </WidgetWrapper>
    );
};

export const TradingViewTickerWidget = React.memo(TradingViewTickerWidgetComponent);
