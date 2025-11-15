# Geist Mono Font Setup

## Overview

ApexGrid now uses **Geist Mono** from Vercel as the primary font family, giving the dashboard a modern, technical, and clean monospace aesthetic.

## Implementation

### Font Loading

The font is loaded via Google Fonts CDN in `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap" rel="stylesheet">
```

### Font Application

The font is applied globally through CSS variables in `src/index.css`:

```css
body {
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}

:root {
  --font-sans: 'Geist Mono', ui-monospace, monospace;
  --font-serif: 'Geist Mono', ui-monospace, monospace;
  --font-mono: 'Geist Mono', ui-monospace, monospace;
}
```

### Fallback Fonts

The font stack includes fallbacks for cases where Geist Mono fails to load:
1. `ui-monospace` - System UI monospace font
2. `SFMono-Regular` - macOS system monospace
3. `SF Mono` - macOS alternative
4. `Menlo` - macOS fallback
5. `Monaco` - macOS older fallback
6. `Consolas` - Windows monospace
7. `Liberation Mono` - Linux monospace
8. `Courier New` - Universal fallback
9. `monospace` - Generic monospace

## Font Weights Available

Geist Mono supports variable font weights from 100 to 900, allowing for:
- Thin (100)
- Extra Light (200)
- Light (300)
- Regular (400)
- Medium (500)
- Semi Bold (600)
- Bold (700)
- Extra Bold (800)
- Black (900)

## Benefits

- **Modern aesthetic** - Clean, technical look
- **Excellent readability** - Designed for code and data
- **Consistent spacing** - Monospace ensures alignment
- **Professional appearance** - Used by Vercel and modern dev tools
- **Variable font** - Smooth weight transitions and smaller file size

## Performance

- Font is preconnected for faster loading
- Uses `display=swap` to prevent FOIT (Flash of Invisible Text)
- Fallback fonts ensure content is always readable
