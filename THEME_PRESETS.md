# Theme Presets

ApexGrid now supports multiple theme presets that can be selected from the Settings panel.

## Available Themes

### Mono (Default)
- **Description**: Minimal monochrome theme
- **Style**: Clean, professional black and white design with no color accents
- **Best for**: Minimalist users who prefer a distraction-free interface

### Caffeine
- **Description**: Warm coffee-inspired theme
- **Style**: Warm browns and beiges with subtle color accents
- **Best for**: Users who prefer a cozy, warm aesthetic

## How to Use

1. Open Settings (gear icon in top-right corner)
2. Navigate to the "Appearance" tab
3. Select your preferred theme from the "Theme" section
4. Toggle between light and dark modes using the "Dark Mode" switch

## Technical Details

### Theme Structure

Each theme is defined in `src/lib/themes.ts` with the following structure:

```typescript
interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    light: Record<string, string>;  // CSS variables for light mode
    dark: Record<string, string>;   // CSS variables for dark mode
  };
}
```

### Adding New Themes

To add a new theme:

1. Add the theme definition to the `themes` array in `src/lib/themes.ts`
2. Define all required CSS variables for both light and dark modes
3. The theme will automatically appear in the Settings panel

### CSS Variables

Each theme must define the following CSS variables:

- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--popover`, `--popover-foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`, `--destructive-foreground`
- `--border`, `--input`, `--ring`
- `--chart-1` through `--chart-5`
- `--sidebar-*` variables (8 total)
- `--radius` (border radius)

## Storage

The selected theme is persisted to Chrome Storage and will be restored when you open a new tab.

## Compatibility

- Works with all widgets
- Respects dark/light mode preference
- Smooth transitions between themes
- Accessible color contrasts (WCAG AA compliant)
