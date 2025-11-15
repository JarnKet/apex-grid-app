import React, { useEffect, useRef } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import type { WidgetProps } from '../../types/widget';

/**
 * TradingViewTickerWidget - Displays a ticker tape of market symbols
 * Shows real-time prices scrolling horizontally
 */
const TradingViewTickerWidgetComponent: React.FC<WidgetProps> = ({ id }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear any existing content
        containerRef.current.innerHTML = '';

        // Create script element
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
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
        });

        containerRef.current.appendChild(script);

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <WidgetWrapper id={id} title="Market Ticker">
            <div className="tradingview-widget-container h-full w-full flex-1" ref={containerRef} style={{ minHeight: '120px' }}>
                <div className="tradingview-widget-container__widget h-full w-full"></div>
            </div>
        </WidgetWrapper>
    );
};

export const TradingViewTickerWidget = React.memo(TradingViewTickerWidgetComponent);
