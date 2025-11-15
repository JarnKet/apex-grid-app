/**
 * Preset dashboard layouts for different user types
 * Allows users to quickly switch between optimized layouts
 */

import type { Widget } from '../types/widget';
import type { Layout } from '../types/layout';

export interface PresetLayout {
    id: string;
    name: string;
    description: string;
    icon: string;
    widgets: Widget[];
    layout: Layout;
}

/**
 * Developer-focused preset layout (DEFAULT)
 * Includes: Tech News, Clock, Calendar, Todo, Quick Links, Quote, Pomodoro, Weather
 * This is the default layout for new users
 */
export const DEVELOPER_PRESET: PresetLayout = {
    id: 'developer',
    name: 'Developer',
    description: 'Optimized for developers with tech news, productivity tools, and quick links',
    icon: '💻',
    widgets: [
        { id: 'clock-1', type: 'clock', enabled: true },
        { id: 'calendar-1', type: 'calendar', enabled: true },
        { id: 'todo-1', type: 'todo', enabled: true },
        { id: 'quicklinks-1', type: 'quicklinks', enabled: true },
        { id: 'quote-1', type: 'quote', enabled: true },
        { id: 'rss-1', type: 'rss', enabled: true },
        { id: 'weather-1', type: 'weather', enabled: true },
        { id: 'pomodoro-1', type: 'pomodoro', enabled: true },
    ],
    layout: [
        // Left column - Clock, Weather, Calendar
        { i: 'clock-1', x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
        { i: 'weather-1', x: 0, y: 2, w: 3, h: 2, minW: 2, minH: 2 },
        { i: 'calendar-1', x: 0, y: 4, w: 3, h: 4, minW: 3, minH: 3 },

        // Center - Tech News (large)
        { i: 'rss-1', x: 3, y: 0, w: 6, h: 5, minW: 4, minH: 3 },

        // Right column - Todo, Quote, Pomodoro
        { i: 'todo-1', x: 9, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'quote-1', x: 9, y: 3, w: 3, h: 2, minW: 3, minH: 2 },
        { i: 'pomodoro-1', x: 9, y: 5, w: 3, h: 3, minW: 3, minH: 4 },

        // Bottom - Quick Links
        { i: 'quicklinks-1', x: 3, y: 5, w: 6, h: 3, minW: 2, minH: 2 },
    ],
};

/**
 * Trader-focused preset layout
 * Includes: Market Ticker, Trading Chart, Market Overview, Symbol Overview, Quick Links, Quote
 */
export const TRADER_PRESET: PresetLayout = {
    id: 'trader',
    name: 'Trader',
    description: 'Optimized for traders with market data, charts, and financial news',
    icon: '📈',
    widgets: [
        { id: 'tradingview-ticker-1', type: 'tradingview-ticker', enabled: true },
        { id: 'tradingview-chart-1', type: 'tradingview-chart', enabled: true },
        { id: 'tradingview-market-1', type: 'tradingview-market', enabled: true },
        { id: 'tradingview-mini-1', type: 'tradingview-mini', enabled: true },
        { id: 'quicklinks-1', type: 'quicklinks', enabled: true },
        { id: 'quote-1', type: 'quote', enabled: true },
        { id: 'rss-1', type: 'rss', enabled: true },
        { id: 'clock-1', type: 'clock', enabled: true },
    ],
    layout: [
        // Top - Market Ticker (full width)
        { i: 'tradingview-ticker-1', x: 0, y: 0, w: 12, h: 2, minW: 4, minH: 2 },

        // Main area - Trading Chart (large)
        { i: 'tradingview-chart-1', x: 0, y: 2, w: 8, h: 5, minW: 4, minH: 3 },

        // Right - Market Overview
        { i: 'tradingview-market-1', x: 8, y: 2, w: 4, h: 5, minW: 4, minH: 3 },

        // Bottom left - Symbol Overview
        { i: 'tradingview-mini-1', x: 0, y: 7, w: 4, h: 3, minW: 3, minH: 2 },

        // Bottom center - Quick Links
        { i: 'quicklinks-1', x: 4, y: 7, w: 4, h: 3, minW: 2, minH: 2 },

        // Bottom right - Quote and Clock
        { i: 'quote-1', x: 8, y: 7, w: 2, h: 3, minW: 3, minH: 2 },
        { i: 'clock-1', x: 10, y: 7, w: 2, h: 2, minW: 2, minH: 2 },

        // Finance News
        { i: 'rss-1', x: 0, y: 10, w: 12, h: 4, minW: 4, minH: 3 },
    ],
};

/**
 * All available presets
 */
export const PRESET_LAYOUTS: PresetLayout[] = [
    DEVELOPER_PRESET,
    TRADER_PRESET,
];

/**
 * Get preset by ID
 */
export const getPresetById = (id: string): PresetLayout | undefined => {
    return PRESET_LAYOUTS.find(preset => preset.id === id);
};
