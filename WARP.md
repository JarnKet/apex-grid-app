# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

ApexGrid is a Chrome new tab extension providing a customizable dashboard with draggable/resizable widgets. Built with React 19, TypeScript, Vite, and Tailwind CSS.

## Development Commands

### Setup
```pwsh
pnpm install
```

### Development
```pwsh
# Start dev server (with hot reload)
pnpm run dev

# Build extension for production
pnpm run build

# Verify build output
pnpm run verify

# Type checking
tsc -b
```

### Testing
```pwsh
# Run all tests once
pnpm test

# Watch mode for test development
pnpm test:watch

# Generate coverage report
pnpm test:coverage

# Run single test file
pnpm vitest src/stores/useLayoutStore.test.ts
```

### Linting
```pwsh
pnpm run lint
```

### Loading Extension in Chrome
After building (`pnpm run build`):
1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder

## Architecture

### State Management - Zustand Stores

All application state is managed through three Zustand stores with Chrome Storage sync:

- **`useLayoutStore`** - Grid layout positions (react-grid-layout format)
- **`useWidgetStore`** - Widget instances and widget-specific data (todos, links, cached API responses)
- **`useSettingsStore`** - App preferences (theme, background, userName)

**Key Pattern**: All stores follow the same initialization flow:
1. Component mounts and calls `initialize*()` method
2. Store loads data from Chrome Storage via `storage.get()`
3. Store sets `isInitialized: true` when complete
4. All mutations call corresponding Chrome Storage `storage.set()` immediately for sync

### Chrome Storage Integration

**Service**: `src/services/storage.ts`

The storage service abstracts Chrome Storage API with:
- Type-safe get/set operations
- Automatic retry logic with exponential backoff (3 attempts)
- Validation for schema types (layout must be array, settings must be object, etc.)
- Quota exceeded error handling
- Uses `chrome.storage.sync` for cross-device synchronization

**Important**: All data persistence happens through this service. Never call `chrome.storage.*` directly.

### Grid Layout System

**Components**: `Dashboard.tsx`, `GridLayout.tsx`

- Uses `react-grid-layout` with 12-column grid, 80px row height
- Layout state persists to Chrome Storage
- **Resize operations**: Persist immediately (no debounce)
- **Drag operations**: Debounced 500ms to reduce storage writes
- Widgets are draggable via `.widget-drag-handle` class
- Resize handle fixed to southeast corner only

**Layout Format**: Array of `LayoutItem` objects with widget ID (`i`), position (`x`, `y`), and dimensions (`w`, `h`)

### Widget System

**Key Files**: `src/components/WidgetRenderer.tsx`, `src/components/widgets/`

Six widget types: `clock`, `calendar`, `todo`, `quicklinks`, `quote`, `currency`

**Widget Props Pattern**: All widgets receive:
```typescript
{
  id: string,              // Unique widget instance ID
  data?: any,              // Widget-specific data from widgetData store
  onDataChange?: (data: any) => void  // Callback to persist changes
}
```

**Adding a new widget**:
1. Add type to `WidgetType` union in `src/types/widget.ts`
2. Create widget component in `src/components/widgets/`
3. Add to `WidgetRenderer.tsx` switch statement
4. Update `DEFAULT_WIDGETS` and `DEFAULT_LAYOUT` if needed

### Type System

**Location**: `src/types/`

- `widget.ts` - Widget types and widget data schemas
- `layout.ts` - Grid layout types and defaults
- `storage.ts` - Chrome Storage schema types

The type system enforces data structure contracts between stores, components, and Chrome Storage.

### Path Aliases

The project uses `@/` alias for `src/`:
```typescript
import { storage } from '@/services/storage';
```

Configured in `vite.config.ts` and `vitest.config.ts`.

## Testing

**Framework**: Vitest with React Testing Library
**Setup**: `src/test/setup.ts` (includes jsdom and Chrome API mocks)

Tests co-located with implementation files (e.g., `ClockWidget.test.tsx` next to `ClockWidget.tsx`)

**Chrome API Mocking**: All tests mock `chrome.storage.sync` via setup file. Tests requiring Chrome APIs should use the provided mocks.

## Build System

**Vite Configuration** (`vite.config.ts`):
- Custom plugin copies `manifest.json` and `icons/` to `dist/` on build
- Outputs deterministic filenames for extension compatibility
- Single-page app targeting `index.html`

**Build Output** (`dist/`):
- `manifest.json` - Chrome extension manifest
- `index.html` - Entry point
- `assets/` - Bundled JS/CSS
- `icons/` - Extension icons (16px, 48px, 128px)

## Key Patterns & Conventions

### Component Organization
- UI components in `src/components/ui/` (shadcn/ui based)
- Widget implementations in `src/components/widgets/`
- Top-level components in `src/components/` (Dashboard, GridLayout, etc.)

### Memoization Strategy
Dashboard component uses:
- `useMemo` for expensive computations (filtering enabled widgets, background styles)
- `useCallback` for event handlers passed to children (prevents unnecessary re-renders)
- `useRef` for debounced functions and widget references

### Accessibility Features
- Keyboard navigation: `Alt+,` opens settings, `Alt+.` closes, `Alt+[` / `Alt+]` cycle widget focus
- ARIA roles and labels on grid layout and widgets
- Focus management for keyboard-only users

### Immediate vs Debounced Persistence
- **Immediate**: Widget data changes, resize operations, settings changes
- **Debounced (500ms)**: Drag operations only

This balances UX responsiveness with storage write efficiency.

## Icon Generation

Placeholder PNGs included. For production:
```pwsh
magick public/icons/icon.svg -resize 16x16 public/icons/icon16.png
magick public/icons/icon.svg -resize 48x48 public/icons/icon48.png
magick public/icons/icon.svg -resize 128x128 public/icons/icon128.png
```

See `public/icons/README.md` for alternatives.

## Notable Implementation Details

- **Time-based gradients**: Dashboard background changes based on time of day (morning, afternoon, evening, night)
- **Theme system**: Uses Tailwind's dark mode (class-based) applied to document root
- **Storage quota**: 100KB limit per key in Chrome Storage Sync (enforced by storage service)
- **Widget IDs**: Auto-generated as `{type}-{number}` (e.g., `clock-1`, `todo-2`)
