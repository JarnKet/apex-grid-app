import React, { useEffect, useRef } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { TrendingUp } from 'lucide-react';
import type { WidgetProps } from '../../types/widget';

/**
 * TradingViewMarketWidget - Market overview with multiple symbols
 * Shows a list of symbols with real-time prices
 */
const TradingViewMarketWidgetComponent: React.FC<WidgetProps> = ({ id }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Build TradingView widget URL with parameters
    const widgetConfig = {
        colorTheme: 'dark',
        dateRange: '12M',
        showChart: true,
        locale: 'en',
        width: '100%',
        height: '100%',
        largeChartUrl: '',
        isTransparent: true,
        showSymbolLogo: true,
        showFloatingTooltip: false,
        plotLineColorGrowing: 'rgba(41, 98, 255, 1)',
        plotLineColorFalling: 'rgba(41, 98, 255, 1)',
        gridLineColor: 'rgba(240, 243, 250, 0)',
        scaleFontColor: 'rgba(106, 109, 120, 1)',
        belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)',
        belowLineFillColorFalling: 'rgba(41, 98, 255, 0.12)',
        belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)',
        belowLineFillColorFallingBottom: 'rgba(41, 98, 255, 0)',
        symbolActiveColor: 'rgba(41, 98, 255, 0.12)',
        tabs: [
            {
                title: 'Indices',
                symbols: [
                    { s: 'FOREXCOM:SPXUSD', d: 'S&P 500' },
                    { s: 'FOREXCOM:NSXUSD', d: 'US 100' },
                    { s: 'FOREXCOM:DJI', d: 'Dow 30' },
                    { s: 'INDEX:NKY', d: 'Nikkei 225' },
                    { s: 'INDEX:DEU40', d: 'DAX Index' },
                    { s: 'FOREXCOM:UKXGBP', d: 'UK 100' },
                ],
                originalTitle: 'Indices',
            },
            {
                title: 'Forex',
                symbols: [
                    { s: 'FX:EURUSD', d: 'EUR to USD' },
                    { s: 'FX:GBPUSD', d: 'GBP to USD' },
                    { s: 'FX:USDJPY', d: 'USD to JPY' },
                    { s: 'FX:USDCHF', d: 'USD to CHF' },
                    { s: 'FX:AUDUSD', d: 'AUD to USD' },
                    { s: 'FX:USDCAD', d: 'USD to CAD' },
                ],
                originalTitle: 'Forex',
            },
            {
                title: 'Crypto',
                symbols: [
                    { s: 'BINANCE:BTCUSDT', d: 'Bitcoin' },
                    { s: 'BINANCE:ETHUSDT', d: 'Ethereum' },
                    { s: 'BINANCE:BNBUSDT', d: 'BNB' },
                    { s: 'BINANCE:SOLUSDT', d: 'Solana' },
                    { s: 'BINANCE:ADAUSDT', d: 'Cardano' },
                    { s: 'BINANCE:XRPUSDT', d: 'Ripple' },
                ],
                originalTitle: 'Crypto',
            },
        ],
    };

    const widgetUrl = `https://s.tradingview.com/embed-widget/market-overview/?${new URLSearchParams({
        locale: 'en',
        colorTheme: 'dark',
        isTransparent: 'true',
    }).toString()}#${encodeURIComponent(JSON.stringify(widgetConfig))}`;

    return (
        <WidgetWrapper id={id} title="Market Overview" icon={<TrendingUp className="h-4 w-4" />}>
            <div className="h-full w-full">
                <iframe
                    ref={iframeRef}
                    src={widgetUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                    }}
                    title="TradingView Market Overview"
                />
            </div>
        </WidgetWrapper>
    );
};

export const TradingViewMarketWidget = React.memo(TradingViewMarketWidgetComponent);
