// Widget store for managing widget instances and data with Zustand

import { create } from 'zustand';
import type { Widget, WidgetType, WidgetData } from '../types/widget';
import type { WidgetDataSchema } from '../types/storage';
import { storage } from '../services/storage';

interface WidgetStore {
    widgets: Widget[];
    widgetData: WidgetData;
    isInitialized: boolean;
    addWidget: (type: WidgetType) => void;
    removeWidget: (id: string) => void;
    updateWidgetData: (id: string, data: WidgetDataSchema) => Promise<void>;
    initializeWidgets: () => Promise<void>;
}

// Default widgets for new users
const DEFAULT_WIDGETS: Widget[] = [
    { id: 'clock-1', type: 'clock', enabled: true },
    { id: 'calendar-1', type: 'calendar', enabled: true },
    { id: 'todo-1', type: 'todo', enabled: true },
    { id: 'quicklinks-1', type: 'quicklinks', enabled: true },
    { id: 'quote-1', type: 'quote', enabled: true },
    { id: 'currency-1', type: 'currency', enabled: true },
];

/**
 * Generate a unique widget ID
 */
function generateWidgetId(type: WidgetType, existingWidgets: Widget[]): string {
    const widgetsOfType = existingWidgets.filter(w => w.type === type);
    const maxNumber = widgetsOfType.reduce((max, widget) => {
        const match = widget.id.match(/-(\d+)$/);
        if (match) {
            const num = parseInt(match[1], 10);
            return num > max ? num : max;
        }
        return max;
    }, 0);

    return `${type}-${maxNumber + 1}`;
}

export const useWidgetStore = create<WidgetStore>((set, get) => ({
    widgets: DEFAULT_WIDGETS,
    widgetData: {},
    isInitialized: false,

    /**
     * Add a new widget with default configuration
     */
    addWidget: (type: WidgetType) => {
        const { widgets } = get();
        const newWidgetId = generateWidgetId(type, widgets);

        const newWidget: Widget = {
            id: newWidgetId,
            type,
            enabled: true,
        };

        const updatedWidgets = [...widgets, newWidget];
        set({ widgets: updatedWidgets });

        // Persist to storage
        storage.set('widgets', updatedWidgets).catch(error => {
            console.error('Failed to persist new widget:', error);
        });
    },

    /**
     * Remove a widget and its associated data
     */
    removeWidget: (id: string) => {
        const { widgets, widgetData } = get();

        // Remove widget from list
        const updatedWidgets = widgets.filter(w => w.id !== id);

        // Remove widget data
        const updatedWidgetData = { ...widgetData };
        delete updatedWidgetData[id];

        set({ widgets: updatedWidgets, widgetData: updatedWidgetData });

        // Persist changes to storage
        Promise.all([
            storage.set('widgets', updatedWidgets),
            storage.set('widgetData', updatedWidgetData),
        ]).catch(error => {
            console.error('Failed to persist widget removal:', error);
        });
    },

    /**
     * Update widget-specific data and persist to Chrome Storage
     */
    updateWidgetData: async (id: string, data: WidgetDataSchema) => {
        try {
            const { widgetData } = get();

            // Update widget data
            const updatedWidgetData = {
                ...widgetData,
                [id]: data,
            };

            // Update local state first for immediate UI feedback
            set({ widgetData: updatedWidgetData });

            // Persist to Chrome Storage
            await storage.set('widgetData', updatedWidgetData);
        } catch (error) {
            console.error(`Failed to update widget data for ${id}:`, error);
            throw error;
        }
    },

    /**
     * Initialize widgets from Chrome Storage on app load
     */
    initializeWidgets: async () => {
        try {
            const [storedWidgets, storedWidgetData] = await Promise.all([
                storage.get<Widget[]>('widgets'),
                storage.get<WidgetData>('widgetData'),
            ]);

            // Use stored widgets or default widgets
            const widgets = storedWidgets && Array.isArray(storedWidgets) && storedWidgets.length > 0
                ? storedWidgets
                : DEFAULT_WIDGETS;

            // Use stored widget data or empty object
            const widgetData = storedWidgetData && typeof storedWidgetData === 'object'
                ? storedWidgetData
                : {};

            set({ widgets, widgetData, isInitialized: true });

            // If using defaults, persist them
            if (!storedWidgets || storedWidgets.length === 0) {
                await storage.set('widgets', DEFAULT_WIDGETS);
            }
            if (!storedWidgetData) {
                await storage.set('widgetData', {});
            }
        } catch (error) {
            console.error('Failed to initialize widgets from storage:', error);
            // Fall back to defaults on error
            set({ widgets: DEFAULT_WIDGETS, widgetData: {}, isInitialized: true });
        }
    },
}));
