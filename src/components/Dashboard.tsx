import React, { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import { GridLayout } from './GridLayout';
import { WidgetRenderer } from './WidgetRenderer';
import { SettingsPanel } from './SettingsPanel';
import { WidgetGallery } from './WidgetGallery';
import { useLayoutStore } from '../stores/useLayoutStore';
import { useWidgetStore } from '../stores/useWidgetStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useKeyboardNavigation } from '../lib/useKeyboardNavigation';
import { getPatternStyle } from '../lib/backgroundPatterns';

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
    const { background, backgroundPattern, layoutWidth, theme } = useSettingsStore();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const widgetRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    // Get container width class based on setting
    const getContainerClass = () => {
        switch (layoutWidth) {
            case 'compact':
                return 'max-w-5xl';
            case 'standard':
                return 'max-w-7xl';
            case 'wide':
                return 'max-w-[1600px]';
            case 'full':
                return 'max-w-none px-8';
            default:
                return 'max-w-7xl';
        }
    };

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
        const isDark = theme === 'dark';
        const patternStyle = getPatternStyle(backgroundPattern, isDark);

        if (background) {
            const bgStyle = background.startsWith('#') || background.startsWith('rgb')
                ? { backgroundColor: background }
                : { backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' };

            // Combine custom background with pattern
            return { ...bgStyle, ...patternStyle };
        }

        // Use pattern with default background color
        return {
            backgroundColor: isDark ? 'hsl(var(--background))' : 'hsl(var(--background))',
            ...patternStyle
        };
    }, [background, backgroundPattern, theme]);

    return (
        <div
            id="main-content"
            className="min-h-screen  p-4 transition-all duration-1000"
            style={backgroundStyle}
            role="main"
            aria-label="ApexGrid Dashboard"
        >
            <WidgetGallery />
            <SettingsPanel isOpen={settingsOpen} onOpenChange={setSettingsOpen} />

            {/* GridLayout container with responsive max-width */}
            <div className={`${getContainerClass()} mx-auto transition-all duration-300`}>
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
