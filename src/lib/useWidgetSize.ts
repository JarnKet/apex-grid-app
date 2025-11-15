import { useEffect, useState, useRef } from 'react';

export interface WidgetSize {
    width: number;
    height: number;
    gridWidth: number;
    gridHeight: number;
}

export type SizeCategory = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Hook to track widget size and provide responsive sizing utilities
 */
export const useWidgetSize = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<WidgetSize>({
        width: 0,
        height: 0,
        gridWidth: 0,
        gridHeight: 0,
    });

    useEffect(() => {
        if (!ref.current) return;

        const updateSize = () => {
            if (!ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            // Approximate grid units (assuming 80px row height + 16px margin)
            const gridWidth = Math.round(rect.width / 96); // ~96px per grid unit with margins
            const gridHeight = Math.round(rect.height / 96);

            setSize({
                width: rect.width,
                height: rect.height,
                gridWidth,
                gridHeight,
            });
        };

        // Initial size
        updateSize();

        // Use ResizeObserver for accurate size tracking
        const resizeObserver = new ResizeObserver(updateSize);
        resizeObserver.observe(ref.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return { ref, size };
};

/**
 * Get size category based on widget dimensions
 */
export const getSizeCategory = (size: WidgetSize): SizeCategory => {
    const area = size.gridWidth * size.gridHeight;

    if (area <= 4) return 'xs';      // 2x2 or smaller
    if (area <= 9) return 'sm';      // 3x3 or smaller
    if (area <= 16) return 'md';     // 4x4 or smaller
    if (area <= 25) return 'lg';     // 5x5 or smaller
    return 'xl';                      // Larger than 5x5
};

/**
 * Get responsive text size classes based on widget size
 */
export const getResponsiveTextSize = (size: WidgetSize) => {
    const category = getSizeCategory(size);

    return {
        // Main display text (like clock time)
        display: {
            xs: 'text-2xl',
            sm: 'text-3xl',
            md: 'text-4xl',
            lg: 'text-5xl',
            xl: 'text-6xl',
        }[category],

        // Title/heading text
        title: {
            xs: 'text-sm',
            sm: 'text-base',
            md: 'text-lg',
            lg: 'text-xl',
            xl: 'text-2xl',
        }[category],

        // Body text
        body: {
            xs: 'text-xs',
            sm: 'text-sm',
            md: 'text-base',
            lg: 'text-lg',
            xl: 'text-xl',
        }[category],

        // Small/secondary text
        small: {
            xs: 'text-[10px]',
            sm: 'text-xs',
            md: 'text-sm',
            lg: 'text-base',
            xl: 'text-lg',
        }[category],

        // Icon sizes
        icon: {
            xs: 'h-3 w-3',
            sm: 'h-4 w-4',
            md: 'h-5 w-5',
            lg: 'h-6 w-6',
            xl: 'h-8 w-8',
        }[category],

        // Spacing
        spacing: {
            xs: 'space-y-1',
            sm: 'space-y-2',
            md: 'space-y-3',
            lg: 'space-y-4',
            xl: 'space-y-6',
        }[category],

        // Padding
        padding: {
            xs: 'p-2',
            sm: 'p-3',
            md: 'p-4',
            lg: 'p-5',
            xl: 'p-6',
        }[category],
    };
};

/**
 * Check if widget is in compact mode (small size)
 */
export const isCompactMode = (size: WidgetSize): boolean => {
    const category = getSizeCategory(size);
    return category === 'xs' || category === 'sm';
};

/**
 * Get responsive button size
 */
export const getResponsiveButtonSize = (size: WidgetSize): 'sm' | 'default' | 'lg' => {
    const category = getSizeCategory(size);

    if (category === 'xs') return 'sm';
    if (category === 'xl') return 'lg';
    return 'default';
};
