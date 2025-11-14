import React, { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import { GridLayout } from './GridLayout';
import { WidgetRenderer } from './WidgetRenderer';
import { SettingsPanel } from './SettingsPanel';
import { Greeting } from './Greeting';
import { SearchBar } from './SearchBar';
import { useLayoutStore } from '../stores/useLayoutStore';
import { useWidgetStore } from '../stores/useWidgetStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useKeyboardNavigation } from '../lib/useKeyboardNavigation';
import { getCurrentTimeGradient, getGradientStyle } from '../lib/timeBasedGradients';

/**
 * Dashboard component - main layout container for ApexGrid
 * - Connects to layout store and widget store
 * - Renders GridLayout with current layout configuration
 * - Maps enabled widgets to WidgetRenderer components
 * - Initializes stores from Chrome Storage on mount
 * - Handles layout changes through GridLayout component
 */
export const Dashboard: React.FC = () => {
    const { isInitialized: layoutInitialized, initializeLayout } = useLayoutStore();
    const {
        widgets,
        widgetData,
        isInitialized: widgetsInitialized,
        initializeWidgets,
        updateWidgetData
    } = useWidgetStore();
    const { background } = useSettingsStore();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [timeGradient, setTimeGradient] = useState(getCurrentTimeGradient());
    const widgetRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    /**
     * Initialize stores from Chrome Storage on component mount
     */
    useEffect(() => {
        const initializeStores = async () => {
            try {
                // Initialize both stores in parallel
                await Promise.all([
                    initializeLayout(),
                    initializeWidgets(),
                ]);
            } catch (error) {
                console.error('Failed to initialize dashboard:', error);
            }
        };

        initializeStores();
    }, [initializeLayout, initializeWidgets]);

    /**
     * Update time-based gradient every 60 seconds
     */
    useEffect(() => {
        const updateGradient = () => {
            setTimeGradient(getCurrentTimeGradient());
        };

        // Set up interval to update gradient every 60 seconds
        const interval = setInterval(updateGradient, 60000);

        // Clean up interval on unmount
        return () => clearInterval(interval);
    }, []);

    /**
     * Handle widget data changes
     * Called by widgets when their data needs to be updated
     * Memoized to prevent unnecessary re-renders of child components
     */
    const handleWidgetDataChange = useCallback((widgetId: string) => (data: any) => {
        updateWidgetData(widgetId, data);
    }, [updateWidgetData]);

    /**
     * Keyboard navigation callbacks
     */
    const focusWidget = useCallback((index: number) => {
        const widgetArray = Array.from(widgetRefs.current.values());
        if (widgetArray[index]) {
            const firstFocusable = widgetArray[index].querySelector<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            firstFocusable?.focus();
        }
    }, []);

    const handleFocusNextWidget = useCallback(() => {
        const widgetArray = Array.from(widgetRefs.current.values());
        const currentIndex = widgetArray.findIndex(el => el.contains(document.activeElement));
        const nextIndex = (currentIndex + 1) % widgetArray.length;
        focusWidget(nextIndex);
    }, [focusWidget]);

    const handleFocusPreviousWidget = useCallback(() => {
        const widgetArray = Array.from(widgetRefs.current.values());
        const currentIndex = widgetArray.findIndex(el => el.contains(document.activeElement));
        const prevIndex = currentIndex <= 0 ? widgetArray.length - 1 : currentIndex - 1;
        focusWidget(prevIndex);
    }, [focusWidget]);

    // Set up keyboard navigation
    useKeyboardNavigation({
        onOpenSettings: () => setSettingsOpen(true),
        onCloseSettings: () => setSettingsOpen(false),
        onFocusNextWidget: handleFocusNextWidget,
        onFocusPreviousWidget: handleFocusPreviousWidget,
    });

    // Show loading state while stores are initializing
    if (!layoutInitialized || !widgetsInitialized) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="text-lg font-medium mb-2">Loading ApexGrid...</div>
                    <div className="text-sm text-muted-foreground">
                        Initializing your dashboard
                    </div>
                </div>
            </div>
        );
    }

    // Filter to only enabled widgets - memoized to prevent recalculation
    const enabledWidgets = useMemo(
        () => widgets.filter(widget => widget.enabled),
        [widgets]
    );

    // Apply background style - memoized to prevent object recreation
    const backgroundStyle: React.CSSProperties = useMemo(() => {
        if (background) {
            return background.startsWith('#') || background.startsWith('rgb')
                ? { backgroundColor: background }
                : { backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' };
        }

        // Use time-based gradient when no custom background is set
        return getGradientStyle(timeGradient);
    }, [background, timeGradient]);

    return (
        <div
            id="main-content"
            className="min-h-screen bg-background p-4 transition-all duration-1000"
            style={backgroundStyle}
            role="main"
            aria-label="ApexGrid Dashboard"
        >
            <SettingsPanel isOpen={settingsOpen} onOpenChange={setSettingsOpen} />

            {/* Greeting and SearchBar container with max-width for proper centering */}
            <div className="max-w-7xl mx-auto">
                {/* Greeting component with staggered fade-in animation */}
                <Greeting className="mb-6 animate-slide-in-from-top" />

                {/* SearchBar component with staggered fade-in animation (delayed) */}
                <SearchBar className="mb-8 animate-slide-in-from-top [animation-delay:100ms]" />

                {/* GridLayout with widgets */}
                <GridLayout>
                    {enabledWidgets.map((widget) => (
                        <div
                            key={widget.id}
                            ref={(el) => {
                                if (el) {
                                    widgetRefs.current.set(widget.id, el);
                                } else {
                                    widgetRefs.current.delete(widget.id);
                                }
                            }}
                        >
                            <WidgetRenderer
                                widget={widget}
                                data={widgetData[widget.id]}
                                onDataChange={handleWidgetDataChange(widget.id)}
                            />
                        </div>
                    ))}
                </GridLayout>
            </div>
        </div>
    );
};
