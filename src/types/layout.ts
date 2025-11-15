// Layout type definitions for ApexGrid grid system

export interface LayoutItem {
    i: string;           // Widget ID
    x: number;           // Grid X position (0-11 for 12-column grid)
    y: number;           // Grid Y position
    w: number;           // Width in grid units
    h: number;           // Height in grid units
    minW?: number;       // Minimum width
    minH?: number;       // Minimum height
    maxW?: number;       // Maximum width
    maxH?: number;       // Maximum height
}

export type Layout = LayoutItem[];

// Default layout configuration for new users
// Developer-focused layout with tech news, productivity tools, and quick links
export const DEFAULT_LAYOUT: Layout = [
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
];
