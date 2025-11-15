/**
 * Background Pattern Presets
 * Modern website-style background patterns (dots, grids, etc.)
 */

export type BackgroundPattern =
    | 'none'
    | 'dots'
    | 'grid'
    | 'dots-lg'
    | 'grid-lg'
    | 'cross'
    | 'diagonal';

export interface BackgroundPatternConfig {
    id: BackgroundPattern;
    name: string;
    description: string;
    getStyle: (isDark: boolean) => React.CSSProperties;
}

/**
 * Generate SVG data URL for patterns
 */
const createSvgPattern = (svg: string): string => {
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

/**
 * Background pattern configurations
 */
export const BACKGROUND_PATTERNS: Record<BackgroundPattern, BackgroundPatternConfig> = {
    none: {
        id: 'none',
        name: 'None',
        description: 'Solid background',
        getStyle: () => ({}),
    },

    dots: {
        id: 'dots',
        name: 'Dots',
        description: 'Small dot pattern',
        getStyle: (isDark) => {
            const color = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
            const svg = `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="1" cy="1" r="1" fill="${color}"/></svg>`;
            return {
                backgroundImage: `url("${createSvgPattern(svg)}")`,
                backgroundSize: '20px 20px',
                backgroundRepeat: 'repeat',
            };
        },
    },

    'dots-lg': {
        id: 'dots-lg',
        name: 'Dots Large',
        description: 'Large dot pattern',
        getStyle: (isDark) => {
            const color = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
            const svg = `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><circle cx="2" cy="2" r="1.5" fill="${color}"/></svg>`;
            return {
                backgroundImage: `url("${createSvgPattern(svg)}")`,
                backgroundSize: '40px 40px',
                backgroundRepeat: 'repeat',
            };
        },
    },

    grid: {
        id: 'grid',
        name: 'Grid',
        description: 'Small grid pattern',
        getStyle: (isDark) => {
            const color = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
            const svg = `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="${color}" stroke-width="1"/></svg>`;
            return {
                backgroundImage: `url("${createSvgPattern(svg)}")`,
                backgroundSize: '20px 20px',
                backgroundRepeat: 'repeat',
            };
        },
    },

    'grid-lg': {
        id: 'grid-lg',
        name: 'Grid Large',
        description: 'Large grid pattern',
        getStyle: (isDark) => {
            const color = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
            const svg = `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="${color}" stroke-width="1"/></svg>`;
            return {
                backgroundImage: `url("${createSvgPattern(svg)}")`,
                backgroundSize: '40px 40px',
                backgroundRepeat: 'repeat',
            };
        },
    },

    cross: {
        id: 'cross',
        name: 'Cross',
        description: 'Cross pattern',
        getStyle: (isDark) => {
            const color = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
            const svg = `<svg width="30" height="30" xmlns="http://www.w3.org/2000/svg"><path d="M 15 0 L 15 30 M 0 15 L 30 15" fill="none" stroke="${color}" stroke-width="1"/></svg>`;
            return {
                backgroundImage: `url("${createSvgPattern(svg)}")`,
                backgroundSize: '30px 30px',
                backgroundRepeat: 'repeat',
            };
        },
    },

    diagonal: {
        id: 'diagonal',
        name: 'Diagonal',
        description: 'Diagonal lines',
        getStyle: (isDark) => {
            const color = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
            const svg = `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M 0 40 L 40 0 M -10 10 L 10 -10 M 30 50 L 50 30" fill="none" stroke="${color}" stroke-width="1"/></svg>`;
            return {
                backgroundImage: `url("${createSvgPattern(svg)}")`,
                backgroundSize: '40px 40px',
                backgroundRepeat: 'repeat',
            };
        },
    },
};

/**
 * Get background pattern style
 */
export const getPatternStyle = (
    pattern: BackgroundPattern,
    isDark: boolean
): React.CSSProperties => {
    const config = BACKGROUND_PATTERNS[pattern];
    return config ? config.getStyle(isDark) : {};
};

/**
 * Get all available patterns
 */
export const getAllPatterns = (): BackgroundPatternConfig[] => {
    return Object.values(BACKGROUND_PATTERNS);
};
