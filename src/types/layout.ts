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
export const DEFAULT_LAYOUT: Layout = [
    { i: 'clock-1', x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'calendar-1', x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'todo-1', x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'quicklinks-1', x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'quote-1', x: 0, y: 2, w: 6, h: 1, minW: 3, minH: 1 },
    { i: 'currency-1', x: 6, y: 2, w: 6, h: 1, minW: 3, minH: 1 },
];
