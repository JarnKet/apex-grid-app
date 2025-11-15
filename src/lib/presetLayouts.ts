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
 * Includes: GitHub, Tech News, Location, Clock, Calendar, Quick Links, Todo, Pomodoro
 * This is the default layout for new users
 */
export const DEVELOPER_PRESET: PresetLayout = {
    id: 'developer',
    name: 'Developer',
    description: 'Optimized for developers with GitHub stats, tech news, and productivity tools',
    icon: '💻',
    widgets: [
        { id: 'github-1', type: 'github', enabled: true },
        { id: 'rss-1', type: 'rss', enabled: true },
        { id: 'location-1', type: 'location', enabled: true },
        { id: 'clock-1', type: 'clock', enabled: true },
        { id: 'calendar-1', type: 'calendar', enabled: true },
        { id: 'quicklinks-1', type: 'quicklinks', enabled: true },
        { id: 'todo-1', type: 'todo', enabled: true },
        { id: 'pomodoro-1', type: 'pomodoro', enabled: true },
    ],
    layout: [
        // Top left - GitHub (tall)
        { i: 'github-1', x: 0, y: 0, w: 3, h: 5, minW: 3, minH: 4 },

        // Top center - Tech News (large)
        { i: 'rss-1', x: 3, y: 0, w: 6, h: 4, minW: 4, minH: 3 },

        // Top right - Location Info
        { i: 'location-1', x: 9, y: 0, w: 3, h: 4, minW: 3, minH: 2 },

        // Middle left - Clock
        { i: 'clock-1', x: 0, y: 5, w: 3, h: 2, minW: 2, minH: 2 },

        // Middle center - Quick Links
        { i: 'quicklinks-1', x: 3, y: 4, w: 3, h: 3, minW: 2, minH: 2 },

        // Middle center-right - Todo
        { i: 'todo-1', x: 6, y: 4, w: 3, h: 3, minW: 2, minH: 2 },

        // Middle right - Pomodoro
        { i: 'pomodoro-1', x: 9, y: 4, w: 3, h: 3, minW: 3, minH: 4 },

        // Bottom left - Calendar
        { i: 'calendar-1', x: 0, y: 7, w: 3, h: 4, minW: 3, minH: 3 },
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
 * Minimalist preset layout
 * Includes: Clock, Quote, Todo, Quick Links
 */
export const MINIMALIST_PRESET: PresetLayout = {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean and simple with just the essentials',
    icon: '✨',
    widgets: [
        { id: 'clock-1', type: 'clock', enabled: true },
        { id: 'quote-1', type: 'quote', enabled: true },
        { id: 'todo-1', type: 'todo', enabled: true },
        { id: 'quicklinks-1', type: 'quicklinks', enabled: true },
    ],
    layout: [
        { i: 'clock-1', x: 3, y: 0, w: 6, h: 3, minW: 2, minH: 2 },
        { i: 'quote-1', x: 2, y: 3, w: 8, h: 2, minW: 3, minH: 2 },
        { i: 'todo-1', x: 1, y: 5, w: 5, h: 4, minW: 2, minH: 2 },
        { i: 'quicklinks-1', x: 6, y: 5, w: 5, h: 4, minW: 2, minH: 2 },
    ],
};

/**
 * Productivity preset layout
 * Includes: Clock, Calendar, Todo, Pomodoro, Counter, Countdown, Quick Links
 */
export const PRODUCTIVITY_PRESET: PresetLayout = {
    id: 'productivity',
    name: 'Productivity',
    description: 'Focus on getting things done with timers and task management',
    icon: '⚡',
    widgets: [
        { id: 'clock-1', type: 'clock', enabled: true },
        { id: 'calendar-1', type: 'calendar', enabled: true },
        { id: 'todo-1', type: 'todo', enabled: true },
        { id: 'pomodoro-1', type: 'pomodoro', enabled: true },
        { id: 'counter-1', type: 'counter', enabled: true },
        { id: 'countdown-1', type: 'countdown', enabled: true },
        { id: 'quicklinks-1', type: 'quicklinks', enabled: true },
    ],
    layout: [
        { i: 'clock-1', x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
        { i: 'calendar-1', x: 0, y: 2, w: 3, h: 4, minW: 3, minH: 3 },
        { i: 'todo-1', x: 3, y: 0, w: 4, h: 6, minW: 2, minH: 2 },
        { i: 'pomodoro-1', x: 7, y: 0, w: 3, h: 3, minW: 3, minH: 4 },
        { i: 'countdown-1', x: 10, y: 0, w: 2, h: 3, minW: 2, minH: 2 },
        { i: 'counter-1', x: 7, y: 3, w: 2, h: 3, minW: 2, minH: 2 },
        { i: 'quicklinks-1', x: 9, y: 3, w: 3, h: 3, minW: 2, minH: 2 },
    ],
};

/**
 * Wellness preset layout
 * Includes: Meditation, Water Tracker, Horoscope, Quote, Unsplash, Calendar
 */
export const WELLNESS_PRESET: PresetLayout = {
    id: 'wellness',
    name: 'Wellness',
    description: 'Focus on health, mindfulness, and self-care',
    icon: '🧘',
    widgets: [
        { id: 'meditation-1', type: 'meditation', enabled: true },
        { id: 'water-1', type: 'water', enabled: true },
        { id: 'horoscope-1', type: 'horoscope', enabled: true },
        { id: 'quote-1', type: 'quote', enabled: true },
        { id: 'unsplash-1', type: 'unsplash', enabled: true },
        { id: 'calendar-1', type: 'calendar', enabled: true },
        { id: 'lifeprogress-1', type: 'lifeprogress', enabled: true },
    ],
    layout: [
        { i: 'unsplash-1', x: 0, y: 0, w: 6, h: 4, minW: 3, minH: 3 },
        { i: 'meditation-1', x: 6, y: 0, w: 3, h: 4, minW: 3, minH: 3 },
        { i: 'water-1', x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
        { i: 'horoscope-1', x: 9, y: 2, w: 3, h: 2, minW: 3, minH: 2 },
        { i: 'quote-1', x: 0, y: 4, w: 6, h: 2, minW: 3, minH: 2 },
        { i: 'calendar-1', x: 6, y: 4, w: 3, h: 4, minW: 3, minH: 3 },
        { i: 'lifeprogress-1', x: 9, y: 4, w: 3, h: 4, minW: 3, minH: 3 },
    ],
};

/**
 * Student preset layout
 * Includes: Clock, Calendar, Todo, Pomodoro, Dictionary, Unit Converter, Quick Links, Quote
 */
export const STUDENT_PRESET: PresetLayout = {
    id: 'student',
    name: 'Student',
    description: 'Perfect for studying with tools and references',
    icon: '📚',
    widgets: [
        { id: 'clock-1', type: 'clock', enabled: true },
        { id: 'calendar-1', type: 'calendar', enabled: true },
        { id: 'todo-1', type: 'todo', enabled: true },
        { id: 'pomodoro-1', type: 'pomodoro', enabled: true },
        { id: 'dictionary-1', type: 'dictionary', enabled: true },
        { id: 'unitconverter-1', type: 'unitconverter', enabled: true },
        { id: 'quicklinks-1', type: 'quicklinks', enabled: true },
        { id: 'quote-1', type: 'quote', enabled: true },
    ],
    layout: [
        { i: 'clock-1', x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
        { i: 'calendar-1', x: 0, y: 2, w: 3, h: 4, minW: 3, minH: 3 },
        { i: 'todo-1', x: 3, y: 0, w: 3, h: 4, minW: 2, minH: 2 },
        { i: 'pomodoro-1', x: 6, y: 0, w: 3, h: 4, minW: 3, minH: 4 },
        { i: 'dictionary-1', x: 9, y: 0, w: 3, h: 3, minW: 3, minH: 2 },
        { i: 'unitconverter-1', x: 9, y: 3, w: 3, h: 3, minW: 3, minH: 2 },
        { i: 'quicklinks-1', x: 3, y: 4, w: 4, h: 2, minW: 2, minH: 2 },
        { i: 'quote-1', x: 7, y: 4, w: 5, h: 2, minW: 3, minH: 2 },
    ],
};

/**
 * Creative preset layout
 * Includes: Unsplash, Color Palette, QR Code, Spotify, Quote, Clock
 */
export const CREATIVE_PRESET: PresetLayout = {
    id: 'creative',
    name: 'Creative',
    description: 'Inspiration and tools for designers and creators',
    icon: '🎨',
    widgets: [
        { id: 'unsplash-1', type: 'unsplash', enabled: true },
        { id: 'colorpalette-1', type: 'colorpalette', enabled: true },
        { id: 'qrcode-1', type: 'qrcode', enabled: true },
        { id: 'spotify-1', type: 'spotify', enabled: true },
        { id: 'quote-1', type: 'quote', enabled: true },
        { id: 'clock-1', type: 'clock', enabled: true },
    ],
    layout: [
        { i: 'unsplash-1', x: 0, y: 0, w: 6, h: 5, minW: 3, minH: 3 },
        { i: 'colorpalette-1', x: 6, y: 0, w: 3, h: 3, minW: 3, minH: 2 },
        { i: 'qrcode-1', x: 9, y: 0, w: 3, h: 3, minW: 3, minH: 2 },
        { i: 'clock-1', x: 6, y: 3, w: 3, h: 2, minW: 2, minH: 2 },
        { i: 'quote-1', x: 9, y: 3, w: 3, h: 2, minW: 3, minH: 2 },
        { i: 'spotify-1', x: 0, y: 5, w: 12, h: 3, minW: 4, minH: 3 },
    ],
};

/**
 * Traveler preset layout
 * Includes: World Clock, Weather, Currency Converter, Location, Calendar, Quick Links
 */
export const TRAVELER_PRESET: PresetLayout = {
    id: 'traveler',
    name: 'Traveler',
    description: 'Essential tools for globetrotters and remote workers',
    icon: '✈️',
    widgets: [
        { id: 'worldclock-1', type: 'worldclock', enabled: true },
        { id: 'weather-1', type: 'weather', enabled: true },
        { id: 'currency-1', type: 'currency', enabled: true },
        { id: 'location-1', type: 'location', enabled: true },
        { id: 'calendar-1', type: 'calendar', enabled: true },
        { id: 'quicklinks-1', type: 'quicklinks', enabled: true },
        { id: 'clock-1', type: 'clock', enabled: true },
    ],
    layout: [
        { i: 'worldclock-1', x: 0, y: 0, w: 6, h: 3, minW: 4, minH: 2 },
        { i: 'weather-1', x: 6, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'clock-1', x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
        { i: 'currency-1', x: 0, y: 3, w: 4, h: 3, minW: 3, minH: 2 },
        { i: 'location-1', x: 4, y: 3, w: 4, h: 3, minW: 3, minH: 2 },
        { i: 'calendar-1', x: 8, y: 2, w: 4, h: 4, minW: 3, minH: 3 },
        { i: 'quicklinks-1', x: 0, y: 6, w: 8, h: 2, minW: 2, minH: 2 },
    ],
};

/**
 * News & Info preset layout
 * Includes: RSS, Weather, Clock, Calendar, Quote, Location
 */
export const NEWS_PRESET: PresetLayout = {
    id: 'news',
    name: 'News & Info',
    description: 'Stay informed with news, weather, and information',
    icon: '📰',
    widgets: [
        { id: 'rss-1', type: 'rss', enabled: true },
        { id: 'weather-1', type: 'weather', enabled: true },
        { id: 'clock-1', type: 'clock', enabled: true },
        { id: 'calendar-1', type: 'calendar', enabled: true },
        { id: 'quote-1', type: 'quote', enabled: true },
        { id: 'location-1', type: 'location', enabled: true },
    ],
    layout: [
        { i: 'rss-1', x: 0, y: 0, w: 8, h: 6, minW: 4, minH: 3 },
        { i: 'clock-1', x: 8, y: 0, w: 4, h: 2, minW: 2, minH: 2 },
        { i: 'weather-1', x: 8, y: 2, w: 4, h: 2, minW: 2, minH: 2 },
        { i: 'calendar-1', x: 8, y: 4, w: 4, h: 4, minW: 3, minH: 3 },
        { i: 'quote-1', x: 0, y: 6, w: 5, h: 2, minW: 3, minH: 2 },
        { i: 'location-1', x: 5, y: 6, w: 3, h: 2, minW: 3, minH: 2 },
    ],
};

/**
 * GitHub Developer preset layout
 * Includes: GitHub, Clock, Todo, Quick Links, RSS, Pomodoro, API Tester
 */
export const GITHUB_DEV_PRESET: PresetLayout = {
    id: 'github-dev',
    name: 'GitHub Dev',
    description: 'For developers tracking GitHub activity and coding',
    icon: '🐙',
    widgets: [
        { id: 'github-1', type: 'github', enabled: true },
        { id: 'clock-1', type: 'clock', enabled: true },
        { id: 'todo-1', type: 'todo', enabled: true },
        { id: 'quicklinks-1', type: 'quicklinks', enabled: true },
        { id: 'rss-1', type: 'rss', enabled: true },
        { id: 'pomodoro-1', type: 'pomodoro', enabled: true },
        { id: 'apitester-1', type: 'apitester', enabled: true },
    ],
    layout: [
        { i: 'github-1', x: 0, y: 0, w: 6, h: 5, minW: 4, minH: 4 },
        { i: 'clock-1', x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
        { i: 'pomodoro-1', x: 9, y: 0, w: 3, h: 3, minW: 3, minH: 4 },
        { i: 'todo-1', x: 6, y: 2, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'rss-1', x: 0, y: 5, w: 6, h: 3, minW: 4, minH: 3 },
        { i: 'quicklinks-1', x: 6, y: 5, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'apitester-1', x: 9, y: 3, w: 3, h: 5, minW: 3, minH: 3 },
    ],
};

/**
 * Entertainment preset layout
 * Includes: Spotify, Unsplash, Quote, Horoscope, Calendar, Clock
 */
export const ENTERTAINMENT_PRESET: PresetLayout = {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Relax with music, images, and inspiration',
    icon: '🎵',
    widgets: [
        { id: 'spotify-1', type: 'spotify', enabled: true },
        { id: 'unsplash-1', type: 'unsplash', enabled: true },
        { id: 'quote-1', type: 'quote', enabled: true },
        { id: 'horoscope-1', type: 'horoscope', enabled: true },
        { id: 'calendar-1', type: 'calendar', enabled: true },
        { id: 'clock-1', type: 'clock', enabled: true },
    ],
    layout: [
        { i: 'spotify-1', x: 0, y: 0, w: 8, h: 4, minW: 4, minH: 3 },
        { i: 'unsplash-1', x: 8, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
        { i: 'quote-1', x: 0, y: 4, w: 5, h: 2, minW: 3, minH: 2 },
        { i: 'horoscope-1', x: 5, y: 4, w: 3, h: 2, minW: 3, minH: 2 },
        { i: 'clock-1', x: 8, y: 4, w: 2, h: 2, minW: 2, minH: 2 },
        { i: 'calendar-1', x: 10, y: 4, w: 2, h: 4, minW: 3, minH: 3 },
    ],
};

/**
 * All-in-One preset layout
 * Includes: A comprehensive mix of popular widgets
 */
export const ALL_IN_ONE_PRESET: PresetLayout = {
    id: 'all-in-one',
    name: 'All-in-One',
    description: 'A comprehensive dashboard with all the essentials',
    icon: '🌟',
    widgets: [
        { id: 'clock-1', type: 'clock', enabled: true },
        { id: 'weather-1', type: 'weather', enabled: true },
        { id: 'calendar-1', type: 'calendar', enabled: true },
        { id: 'todo-1', type: 'todo', enabled: true },
        { id: 'quicklinks-1', type: 'quicklinks', enabled: true },
        { id: 'quote-1', type: 'quote', enabled: true },
        { id: 'rss-1', type: 'rss', enabled: true },
        { id: 'pomodoro-1', type: 'pomodoro', enabled: true },
        { id: 'spotify-1', type: 'spotify', enabled: true },
        { id: 'currency-1', type: 'currency', enabled: true },
    ],
    layout: [
        { i: 'clock-1', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
        { i: 'weather-1', x: 2, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
        { i: 'calendar-1', x: 0, y: 2, w: 4, h: 4, minW: 3, minH: 3 },
        { i: 'todo-1', x: 4, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'pomodoro-1', x: 7, y: 0, w: 2, h: 3, minW: 3, minH: 4 },
        { i: 'quicklinks-1', x: 9, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
        { i: 'rss-1', x: 4, y: 3, w: 5, h: 3, minW: 4, minH: 3 },
        { i: 'quote-1', x: 9, y: 3, w: 3, h: 2, minW: 3, minH: 2 },
        { i: 'currency-1', x: 9, y: 5, w: 3, h: 1, minW: 3, minH: 2 },
        { i: 'spotify-1', x: 0, y: 6, w: 12, h: 3, minW: 4, minH: 3 },
    ],
};

/**
 * All available presets
 */
export const PRESET_LAYOUTS: PresetLayout[] = [
    MINIMALIST_PRESET,
    PRODUCTIVITY_PRESET,
    DEVELOPER_PRESET,
    STUDENT_PRESET,
    TRADER_PRESET,
    WELLNESS_PRESET,
    CREATIVE_PRESET,
    TRAVELER_PRESET,
    NEWS_PRESET,
    GITHUB_DEV_PRESET,
    ENTERTAINMENT_PRESET,
    ALL_IN_ONE_PRESET,
];

/**
 * Get preset by ID
 */
export const getPresetById = (id: string): PresetLayout | undefined => {
    return PRESET_LAYOUTS.find(preset => preset.id === id);
};
