// Storage schema type definitions for Chrome Storage API

import type { Layout } from './layout';
import type { Widget, TodoItem, QuickLink, CachedQuote, CachedCurrency } from './widget';

export interface WidgetDataSchema {
    // Todo widget data
    todos?: TodoItem[];

    // Quick links widget data
    links?: QuickLink[];

    // Quote widget cache
    quote?: CachedQuote;

    // Currency widget cache
    currency?: CachedCurrency;
}

export type SearchEngine = 'google' | 'bing' | 'duckduckgo' | 'yahoo';

export interface AppSettings {
    theme: 'dark' | 'light';
    background: string | null;
    userName: string | null;
    searchEngine: SearchEngine;
}

export interface StorageSchema {
    // Layout configuration
    layout: Layout;

    // Widget configurations
    widgets: Widget[];

    // Widget-specific data indexed by widget ID
    widgetData: {
        [widgetId: string]: WidgetDataSchema;
    };

    // App settings
    settings: AppSettings;
}
