/**
 * Default widget layout configurations
 * Defines minimum and maximum sizes for each widget type
 */

import type { WidgetType } from '../types/widget';

export interface WidgetLayoutDefaults {
    minW: number;
    minH: number;
    maxW?: number;
    maxH?: number;
    defaultW: number;
    defaultH: number;
}

/**
 * Widget layout defaults by type
 * These constraints ensure widgets maintain usability at different sizes
 */
export const WIDGET_LAYOUT_DEFAULTS: Record<WidgetType, WidgetLayoutDefaults> = {
    clock: {
        minW: 2,
        minH: 2,
        defaultW: 3,
        defaultH: 2,
    },
    calendar: {
        minW: 3,
        minH: 3,
        defaultW: 3,
        defaultH: 4,
    },
    todo: {
        minW: 2,
        minH: 2,
        defaultW: 3,
        defaultH: 3,
    },
    quicklinks: {
        minW: 2,
        minH: 2,
        defaultW: 3,
        defaultH: 3,
    },
    quote: {
        minW: 3,
        minH: 2,
        defaultW: 3,
        defaultH: 3,
    },
    rss: {
        minW: 4,
        minH: 3,
        defaultW: 6,
        defaultH: 5,
    },
    weather: {
        minW: 2,
        minH: 2,
        defaultW: 3,
        defaultH: 3,
    },
    pomodoro: {
        minW: 3,
        minH: 4,
        defaultW: 3,
        defaultH: 4,
    },
    'tradingview-ticker': {
        minW: 4,
        minH: 2,
        defaultW: 12,
        defaultH: 2,
    },
    'tradingview-chart': {
        minW: 4,
        minH: 3,
        defaultW: 8,
        defaultH: 5,
    },
    'tradingview-mini': {
        minW: 3,
        minH: 2,
        defaultW: 4,
        defaultH: 3,
    },
    'tradingview-market': {
        minW: 4,
        minH: 3,
        defaultW: 6,
        defaultH: 5,
    },
    spotify: {
        minW: 3,
        minH: 3,
        defaultW: 4,
        defaultH: 4,
    },
    horoscope: {
        minW: 3,
        minH: 3,
        defaultW: 3,
        defaultH: 4,
    },
    github: {
        minW: 3,
        minH: 4,
        defaultW: 4,
        defaultH: 5,
    },
    worldclock: {
        minW: 3,
        minH: 3,
        defaultW: 3,
        defaultH: 4,
    },
    currency: {
        minW: 3,
        minH: 4,
        defaultW: 3,
        defaultH: 5,
    },
    water: {
        minW: 3,
        minH: 4,
        defaultW: 3,
        defaultH: 4,
    },
    qrcode: {
        minW: 3,
        minH: 3,
        defaultW: 3,
        defaultH: 4,
    },
    unitconverter: {
        minW: 3,
        minH: 4,
        defaultW: 3,
        defaultH: 5,
    },
};

/**
 * Get default layout configuration for a widget type
 */
export const getWidgetDefaults = (type: WidgetType): WidgetLayoutDefaults => {
    return WIDGET_LAYOUT_DEFAULTS[type] || {
        minW: 2,
        minH: 2,
        defaultW: 3,
        defaultH: 3,
    };
};
