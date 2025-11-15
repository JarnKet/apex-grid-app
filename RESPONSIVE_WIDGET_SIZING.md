# Responsive Widget Sizing

## Overview

Widgets now automatically adjust their text sizes, spacing, and layout based on their current dimensions. This prevents layout breaking when widgets are resized to smaller sizes.

## Implementation

### useWidgetSize Hook

A custom React hook that tracks widget dimensions and provides responsive sizing utilities.

**Features:**
- Tracks widget width and height in pixels
- Calculates approximate grid units
- Uses ResizeObserver for accurate size tracking
- Provides size category (xs, sm, md, lg, xl)

### Size Categories

Based on widget area (gridWidth × gridHeight):
- **XS**: ≤ 4 grid units (2x2 or smaller)
- **SM**: ≤ 9 grid units (3x3 or smaller)
- **MD**: ≤ 16 grid units (4x4 or smaller)
- **LG**: ≤ 25 grid units (5x5 or smaller)
- **XL**: > 25 grid units (larger than 5x5)

### Responsive Text Sizes

Automatically scales based on widget size:

| Element | XS | SM | MD | LG | XL |
|---------|----|----|----|----|-----|
| Display | text-2xl | text-3xl | text-4xl | text-5xl | text-6xl |
| Title | text-sm | text-base | text-lg | text-xl | text-2xl |
| Body | text-xs | text-sm | text-base | text-lg | text-xl |
| Small | text-[10px] | text-xs | text-sm | text-base | text-lg |
| Icon | h-3 w-3 | h-4 w-4 | h-5 w-5 | h-6 w-6 | h-8 w-8 |

### Responsive Spacing

Spacing also scales with widget size:
- **XS**: space-y-1, p-2
- **SM**: space-y-2, p-3
- **MD**: space-y-3, p-4
- **LG**: space-y-4, p-5
- **XL**: space-y-6, p-6

## Updated Widgets

### Clock Widget

**Responsive Features:**
- Time display scales from text-2xl to text-6xl
- Date automatically hides in compact mode (XS/SM)
- Spacing adjusts based on size
- Always readable at any size

**Compact Mode (XS/SM):**
- Shows only time (no date)
- Smaller text size
- Tighter spacing

### Pomodoro Widget

**Responsive Features:**
- Timer circle scales (24px radius in compact, 32px in normal)
- Timer text scales with widget size
- Button labels hide in compact mode (shows only icons)
- Mode buttons show single letters in compact (W/S/L instead of Work/Break/Long)
- Session info hides in compact mode
- Stroke width adjusts (4px compact, 6px normal)

**Compact Mode (XS/SM):**
- Smaller timer circle
- Icon-only buttons
- Single-letter mode buttons
- No session counter
- Minimal spacing

## Usage in Other Widgets

To add responsive sizing to any widget:

```typescript
import { useWidgetSize, getResponsiveTextSize, isCompactMode } from '../../lib/useWidgetSize';
import { cn } from '../../lib/utils';

const MyWidget: React.FC<WidgetProps> = ({ id }) => {
    const { ref, size } = useWidgetSize();
    const textSizes = getResponsiveTextSize(size);
    const compact = isCompactMode(size);

    return (
        <WidgetWrapper id={id} title="My Widget">
            <div ref={ref} className={cn("h-full", textSizes.spacing)}>
                <h2 className={textSizes.title}>Title</h2>
                <p className={textSizes.body}>Body text</p>
                {!compact && <p className={textSizes.small}>Details</p>}
            </div>
        </WidgetWrapper>
    );
};
```

## Benefits

1. **No Layout Breaking** - Widgets remain usable at any size
2. **Automatic Adaptation** - No manual configuration needed
3. **Consistent Scaling** - All widgets follow same sizing rules
4. **Better UX** - Content always fits properly
5. **Compact Mode** - Hides non-essential info when space is limited
6. **Performance** - Uses ResizeObserver for efficient tracking

## Technical Details

### ResizeObserver

- Monitors widget dimensions in real-time
- Triggers updates only when size changes
- Automatically cleans up on unmount
- More efficient than polling or window resize events

### Grid Unit Calculation

Approximates grid units based on:
- Row height: 80px
- Margin: 16px
- Total per unit: ~96px

Formula: `Math.round(pixels / 96)`

### Compact Mode Detection

Compact mode activates when:
- Size category is XS or SM
- Widget area ≤ 9 grid units
- Typically 3x3 or smaller

## Future Enhancements

Potential improvements:
- Add more size breakpoints
- Widget-specific size overrides
- Orientation detection (portrait/landscape)
- Density modes (comfortable/compact/dense)
- Custom size thresholds per widget type
