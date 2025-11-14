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
 * Morning: 5 AM - 11 AM (warm sunrise colors)
 * Afternoon: 12 PM - 4 PM (bright daylight colors)
 * Evening: 5 PM - 8 PM (sunset colors)
 * Night: 9 PM - 4 AM (deep blue and purple tones)
 */
export const TIME_GRADIENTS: Record<string, TimeGradient> = {
    morning: {
        from: '#FFE5B4', // Peach
        via: '#FFB6C1',  // Light pink
        to: '#87CEEB',   // Sky blue
        period: 'morning'
    },
    afternoon: {
        from: '#87CEEB', // Sky blue
        via: '#4FC3F7',  // Light blue
        to: '#29B6F6',   // Bright blue
        period: 'afternoon'
    },
    evening: {
        from: '#FF6B6B', // Coral
        via: '#FF8E53',  // Orange
        to: '#FE6B8B',   // Pink
        period: 'evening'
    },
    night: {
        from: '#1A1A2E', // Dark blue
        via: '#16213E',  // Navy
        to: '#0F3460',   // Deep blue
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
