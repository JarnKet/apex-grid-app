// Widget type definitions for ApexGrid

export type WidgetType =
    | 'clock'
    | 'calendar'
    | 'todo'
    | 'quicklinks'
    | 'quote'
    | 'rss'
    | 'weather'
    | 'pomodoro'
    | 'tradingview-ticker'
    | 'tradingview-chart'
    | 'tradingview-mini'
    | 'tradingview-market'
    | 'spotify'
    | 'horoscope'
    | 'github'
    | 'worldclock'
    | 'currency'
    | 'water'
    | 'qrcode'
    | 'unitconverter'
    | 'dictionary'
    | 'unsplash'
    | 'colorpalette'
    | 'meditation'
    | 'location'
    | 'apitester'
    | 'lifeprogress'
    | 'counter'
    | 'countdown';

export interface Widget {
    id: string;
    type: WidgetType;
    enabled: boolean;
}

export interface WidgetData {
    [widgetId: string]: any; // Widget-specific data
}

// Widget-specific data types
export interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
}

export interface QuickLink {
    id: string;
    title: string;
    url: string;
    icon?: string;
}

export interface CachedQuote {
    text: string;
    author: string;
    cachedAt: number;
}

export interface CachedCurrency {
    rates: Record<string, number>;
    lastUpdate: number;
}

// Widget props interface
export interface WidgetProps {
    id: string;
    data?: any;
    onDataChange?: (data: any) => void;
}
