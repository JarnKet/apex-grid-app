# Background Patterns & Layout Width Features

## Overview

ApexGrid now includes:
1. **Modern background pattern presets** - Subtle, professional patterns similar to modern websites
2. **Flexible layout width options** - Perfect for users with larger monitors who want to utilize more screen space

## Available Patterns

1. **None** - Solid background with no pattern
2. **Dots** - Small dot pattern (20px grid)
3. **Dots Large** - Larger dot pattern (40px grid)
4. **Grid** - Small grid lines (20px grid)
5. **Grid Large** - Larger grid lines (40px grid)
6. **Cross** - Cross/plus pattern (30px grid)
7. **Diagonal** - Diagonal line pattern (40px grid)

## How to Use

### Layout Width

1. Open Settings (gear icon in top-right)
2. Navigate to the "Appearance" section
3. Select your preferred layout width:
   - **Compact** (1024px) - Smaller screens or focused layout
   - **Standard** (1280px) - Default, balanced layout
   - **Wide** (1600px) - Larger monitors
   - **Full Width** - Utilizes full screen with padding (perfect for ultrawide monitors)
4. The layout adjusts immediately with a smooth transition

### Background Patterns

1. Open Settings (gear icon in top-right)
2. Navigate to the "Appearance" section
3. Select your preferred pattern from the "Background Pattern" grid
4. The pattern will be applied immediately
5. Optionally, set a custom background color or image that will be combined with the pattern

## Technical Details

### Pattern Implementation

- Patterns are generated using SVG data URLs
- They automatically adapt to dark/light theme
- Opacity is adjusted for better visibility in both themes
- Patterns are overlaid on top of the background color/image

### Files Modified

- `src/lib/backgroundPatterns.ts` - Pattern definitions and utilities
- `src/stores/useSettingsStore.ts` - Added pattern and layout width state management
- `src/types/storage.ts` - Added BackgroundPattern and LayoutWidth types
- `src/components/Dashboard.tsx` - Applied pattern styles and responsive layout width
- `src/components/SettingsPanel.tsx` - Added pattern and layout width selector UI

### Storage

Both the selected pattern and layout width are persisted to Chrome Storage and sync across devices.

## Customization

To add new patterns, edit `src/lib/backgroundPatterns.ts` and add a new entry to the `BACKGROUND_PATTERNS` object with:
- `id`: Unique identifier
- `name`: Display name
- `description`: Short description
- `getStyle`: Function that returns CSS styles based on theme

Example:
```typescript
'my-pattern': {
  id: 'my-pattern',
  name: 'My Pattern',
  description: 'Custom pattern description',
  getStyle: (isDark) => {
    const color = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const svg = `<svg>...</svg>`;
    return {
      backgroundImage: `url("${createSvgPattern(svg)}")`,
      backgroundSize: '30px 30px',
      backgroundRepeat: 'repeat',
    };
  },
}
```
