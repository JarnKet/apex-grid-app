import React from 'react';
import type { Widget, WidgetProps } from '../types/widget';
import { ClockWidget } from './widgets/ClockWidget';
import { CalendarWidget } from './widgets/CalendarWidget';
import { TodoWidget } from './widgets/TodoWidget';
import { QuickLinksWidget } from './widgets/QuickLinksWidget';
import { QuoteWidget } from './widgets/QuoteWidget';
import { RSSWidget } from './widgets/RSSWidget';
import { WeatherWidget } from './widgets/WeatherWidget';
import { PomodoroWidget } from './widgets/PomodoroWidget';
import { TradingViewTickerWidget } from './widgets/TradingViewTickerWidget';
import { TradingViewChartWidget } from './widgets/TradingViewChartWidget';
import { TradingViewMiniWidget } from './widgets/TradingViewMiniWidget';
import { TradingViewMarketWidget } from './widgets/TradingViewMarketWidget';
import { SpotifyWidget } from './widgets/SpotifyWidget';
import { HoroscopeWidget } from './widgets/HoroscopeWidget';
import { GitHubWidget } from './widgets/GitHubWidget';
import { WorldClockWidget } from './widgets/WorldClockWidget';
import { CurrencyConverterWidget } from './widgets/CurrencyConverterWidget';
import { WaterTrackerWidget } from './widgets/WaterTrackerWidget';
import { QRCodeWidget } from './widgets/QRCodeWidget';
import { UnitConverterWidget } from './widgets/UnitConverterWidget';
import { DictionaryWidget } from './widgets/DictionaryWidget';
import { UnsplashWidget } from './widgets/UnsplashWidget';
import { ColorPaletteWidget } from './widgets/ColorPaletteWidget';
import { MeditationWidget } from './widgets/MeditationWidget';
import { LocationWidget } from './widgets/LocationWidget';
import { APITesterWidget } from './widgets/APITesterWidget';
import { LifeProgressWidget } from './widgets/LifeProgressWidget';
import { CounterWidget } from './widgets/CounterWidget';
import { CountdownWidget } from './widgets/CountdownWidget';

interface WidgetRendererProps {
    widget: Widget;
    data?: any;
    onDataChange?: (data: any) => void;
}

/**
 * WidgetRenderer maps widget types to their corresponding components
 * - Implements switch/case for all widget types
 * - Passes widget ID and data props to widget components
 * - Passes onDataChange callback for data updates
 * - Each widget is wrapped in WidgetWrapper (done by individual widgets)
 */
const WidgetRendererComponent: React.FC<WidgetRendererProps> = ({ widget, data, onDataChange }) => {
    const widgetProps: WidgetProps = {
        id: widget.id,
        data,
        onDataChange,
    };

    switch (widget.type) {
        case 'clock':
            return <ClockWidget {...widgetProps} />;

        case 'calendar':
            return <CalendarWidget {...widgetProps} />;

        case 'todo':
            return <TodoWidget {...widgetProps} />;

        case 'quicklinks':
            return <QuickLinksWidget {...widgetProps} />;

        case 'quote':
            return <QuoteWidget {...widgetProps} />;

        case 'rss':
            return <RSSWidget {...widgetProps} />;

        case 'weather':
            return <WeatherWidget {...widgetProps} />;

        case 'pomodoro':
            return <PomodoroWidget {...widgetProps} />;

        case 'tradingview-ticker':
            return <TradingViewTickerWidget {...widgetProps} />;

        case 'tradingview-chart':
            return <TradingViewChartWidget {...widgetProps} />;

        case 'tradingview-mini':
            return <TradingViewMiniWidget {...widgetProps} />;

        case 'tradingview-market':
            return <TradingViewMarketWidget {...widgetProps} />;

        case 'spotify':
            return <SpotifyWidget {...widgetProps} />;

        case 'horoscope':
            return <HoroscopeWidget {...widgetProps} />;

        case 'github':
            return <GitHubWidget {...widgetProps} />;

        case 'worldclock':
            return <WorldClockWidget {...widgetProps} />;

        case 'currency':
            return <CurrencyConverterWidget {...widgetProps} />;

        case 'water':
            return <WaterTrackerWidget {...widgetProps} />;

        case 'qrcode':
            return <QRCodeWidget {...widgetProps} />;

        case 'unitconverter':
            return <UnitConverterWidget {...widgetProps} />;

        case 'dictionary':
            return <DictionaryWidget {...widgetProps} />;

        case 'unsplash':
            return <UnsplashWidget {...widgetProps} />;

        case 'colorpalette':
            return <ColorPaletteWidget {...widgetProps} />;

        case 'meditation':
            return <MeditationWidget {...widgetProps} />;

        case 'location':
            return <LocationWidget {...widgetProps} />;

        case 'apitester':
            return <APITesterWidget {...widgetProps} />;

        case 'lifeprogress':
            return <LifeProgressWidget {...widgetProps} />;

        case 'counter':
            return <CounterWidget {...widgetProps} />;

        case 'countdown':
            return <CountdownWidget {...widgetProps} />;

        default:
            // Handle unknown widget types gracefully
            return (
                <div className="flex items-center justify-center h-full p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        Unknown widget type: {widget.type}
                    </p>
                </div>
            );
    }
};

// Memoize component to prevent unnecessary re-renders when other widgets update
export const WidgetRenderer = React.memo(WidgetRendererComponent);
