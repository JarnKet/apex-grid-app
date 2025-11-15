# Theme Presets

ApexGrid now supports multiple theme presets that can be selected from the Settings panel.

## Available Themes

ApexGrid now includes 17 carefully crafted themes, each with unique color palettes and styling:

### 1. Mono (Default)
- **Description**: Minimal monochrome theme
- **Style**: Clean, professional black and white design with no color accents, sharp corners (0rem radius)
- **Best for**: Minimalist users who prefer a distraction-free interface

### 2. Violet Bloom
- **Description**: Elegant purple theme with soft shadows
- **Style**: Beautiful purple/violet color palette with rounded corners (1.4rem radius)
- **Best for**: Users who love vibrant, modern designs with a touch of elegance

### 3. Vintage Paper
- **Description**: Classic aged paper aesthetic
- **Style**: Warm sepia tones with subtle shadows (0.25rem radius), reminiscent of old documents and vintage books
- **Best for**: Users who appreciate classic, nostalgic designs with a literary feel

### 4. Twitter
- **Description**: Iconic blue social media theme
- **Style**: Clean white/black backgrounds with signature Twitter blue accents (1.3rem radius)
- **Best for**: Users who love the familiar, modern social media aesthetic

### 5. Tangerine
- **Description**: Fresh and vibrant orange theme
- **Style**: Energetic orange accents with clean backgrounds (0.75rem radius)
- **Best for**: Users who want a bright, energizing workspace with a pop of color

### 6. T3 Chat
- **Description**: Modern pink and magenta theme
- **Style**: Soft pink backgrounds with vibrant magenta accents (0.5rem radius)
- **Best for**: Users who love modern, playful designs with a chat-app aesthetic

### 7. Supabase
- **Description**: Clean green developer theme
- **Style**: Signature Supabase green with clean, minimal design (0.5rem radius)
- **Best for**: Developers who love the Supabase aesthetic and green color schemes

### 8. Sunset Horizon
- **Description**: Warm sunset-inspired theme
- **Style**: Beautiful orange and yellow sunset colors with soft shadows (0.625rem radius)
- **Best for**: Users who love warm, calming sunset aesthetics

### 9. Starry Night
- **Description**: Deep blue with golden stars theme
- **Style**: Inspired by Van Gogh's masterpiece with deep blues and golden yellows (0.5rem radius)
- **Best for**: Users who love artistic, dreamy aesthetics with a night sky feel

### 10. Soft Pop
- **Description**: Playful pastel colors theme
- **Style**: Vibrant purple, teal, and yellow with bold black borders (1rem radius)
- **Best for**: Users who love fun, energetic designs with a modern pop art feel

### 11. Sage Garden
- **Description**: Calming nature-inspired greens
- **Style**: Soft sage and mint greens with subtle shadows (0.35rem radius)
- **Best for**: Users who want a peaceful, natural aesthetic for focused work

### 12. Retro Arcade
- **Description**: Nostalgic 80s gaming vibes
- **Style**: Vibrant pink, cyan, and orange with sharp corners (0.25rem radius)
- **Best for**: Users who love retro gaming aesthetics and bold, energetic colors

### 13. Pastel Dream
- **Description**: Soft dreamy pastel purples
- **Style**: Gentle purple and pink pastels with extra rounded corners (1.5rem radius)
- **Best for**: Users who love soft, dreamy aesthetics with a whimsical feel

### 14. Notebook
- **Description**: Handwritten paper aesthetic
- **Style**: Grayscale with handwritten font feel, like writing in a notebook (0.625rem radius)
- **Best for**: Users who love the simplicity of pen and paper with a personal touch

### 15. Claymorphism
- **Description**: 3D clay-like soft shadows
- **Style**: Soft purple accents with prominent 3D shadows for depth (1.25rem radius)
- **Best for**: Users who love modern, tactile designs with a 3D sculpted feel

### 16. Neo Brutalism
- **Description**: Bold hard shadows and edges
- **Style**: Pure black/white with vibrant colors, hard shadows, zero border radius (0px radius)
- **Best for**: Users who love bold, unapologetic design with maximum contrast

### 17. Caffeine
- **Description**: Warm coffee-inspired theme
- **Style**: Warm browns and beiges with subtle color accents (0.5rem radius)
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
