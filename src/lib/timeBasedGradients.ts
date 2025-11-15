/**
 * Time-based gradient utilities for dynamic dashboard backgrounds
 * Provides gradient definitions and utilities for time-of-day based theming
 */

export interface TimeGradient {
    from: string;
    via?: string;
    to: string;
    period: string;
}

/**
 * Predefined gradients for different times of day
 * Dark, minimal gradients optimized for developer aesthetics
 * Morning: 5 AM - 11 AM (subtle cool tones)
 * Afternoon: 12 PM - 4 PM (neutral dark tones)
 * Evening: 5 PM - 8 PM (warm dark tones)
 * Night: 9 PM - 4 AM (deep blacks and blues)
 */
export const TIME_GRADIENTS: Record<string, TimeGradient> = {
    morning: {
        from: '#0a0a0f', // Very dark blue
        via: '#0f0f18',  // Dark blue-gray
        to: '#14141f',   // Dark slate
        period: 'morning'
    },
    afternoon: {
        from: '#0a0a0b', // Almost black
        via: '#0f0f11',  // Very dark gray
        to: '#14141a',   // Dark neutral
        period: 'afternoon'
    },
    evening: {
        from: '#0f0a0a', // Very dark warm
        via: '#140f0f',  // Dark warm gray
        to: '#1a1414',   // Dark warm neutral
        period: 'evening'
    },
    night: {
        from: '#09090b', // Almost black with blue tint
        via: '#0f0f13',  // Very dark blue
        to: '#14141b',   // Dark blue-gray
        period: 'night'
    }
};

/**
 * Get the appropriate gradient based on the current time
 * @returns TimeGradient object for the current time period
 */
export function getCurrentTimeGradient(): TimeGradient {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return TIME_GRADIENTS.morning;
    }

    if (hour >= 12 && hour < 17) {
        return TIME_GRADIENTS.afternoon;
    }

    if (hour >= 17 && hour < 21) {
        return TIME_GRADIENTS.evening;
    }

    return TIME_GRADIENTS.night;
}

/**
 * Convert a TimeGradient object to CSS style properties
 * @param gradient - The TimeGradient to convert
 * @returns React.CSSProperties object with background gradient and transition
 */
export function getGradientStyle(gradient: TimeGradient): React.CSSProperties {
    const backgroundValue = gradient.via
        ? `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.via} 50%, ${gradient.to} 100%)`
        : `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`;

    return {
        background: backgroundValue,
        transition: 'background 1s ease-in-out'
    };
}
