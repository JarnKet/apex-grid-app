# CLAUDE.md - AI Assistant Guide for ApexGrid

This document provides comprehensive guidance for AI assistants working on the ApexGrid codebase. It covers architecture, conventions, workflows, and important context to help maintain code quality and consistency.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack & Dependencies](#tech-stack--dependencies)
3. [Codebase Structure](#codebase-structure)
4. [Development Workflows](#development-workflows)
5. [Coding Conventions](#coding-conventions)
6. [Architecture Patterns](#architecture-patterns)
7. [Testing Guidelines](#testing-guidelines)
8. [Chrome Extension Specifics](#chrome-extension-specifics)
9. [Common Tasks & Examples](#common-tasks--examples)
10. [Important Files Reference](#important-files-reference)

---

## Project Overview

**ApexGrid** is a Chrome extension that replaces the new tab page with a beautiful, customizable dashboard featuring draggable and resizable widgets.

### Key Features
- Drag-and-drop widget positioning with persistent layouts
- Resizable widgets with react-grid-layout
- 32+ widget types including:
  - **Core Widgets**: Clock, Calendar, Todo, Quick Links, Quote, RSS Feed
  - **Financial**: Currency Exchange, Crypto Tracker, TradingView (Ticker, Chart, Mini, Market)
  - **Productivity**: Pomodoro Timer, Counter, Countdown, Life Progress, API Tester
  - **Lifestyle**: Water Tracker, Meditation Timer, Horoscope, Dictionary
  - **Integration**: Spotify (with OAuth), GitHub Activity, Weather
  - **Utilities**: World Clock, Unit Converter, QR Code Generator, Color Palette, Unsplash Images, Location
- Advanced theme system with 50+ customizable themes
- Widget Gallery for easy widget discovery and addition
- Preset Layouts for quick dashboard setup
- Dark/light mode support with dynamic backgrounds
- Cross-device sync via Chrome Storage API
- Full accessibility support with ARIA labels and keyboard navigation
- Reduced motion support for accessibility

### Project Goals
- Provide a productive, aesthetically pleasing new tab experience
- Maintain high performance and responsiveness
- Ensure full accessibility compliance
- Support cross-browser Chrome extension standards

---

## Tech Stack & Dependencies

### Core Technologies
- **React 19** - UI framework with latest features
- **TypeScript ~5.9.3** - Type safety with strict mode enabled
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 3** - Utility-first styling with custom design system

### Key Libraries
- **react-grid-layout 1.4.4** - Drag-and-drop grid system
- **Zustand 5.0.2** - Lightweight state management
- **Radix UI** - Accessible UI primitives (Dialog, Switch, Checkbox, Label)
- **lucide-react 0.553.0** - Icon library
- **react-icons 5.5.0** - Additional icon library
- **date-fns 4.1.0** - Date manipulation
- **recharts 2.15.4** - Chart components for data visualization
- **clsx + tailwind-merge** - Conditional className utilities
- **class-variance-authority 0.7.1** - Component variant management

### Development Tools
- **Vitest 4** - Unit testing framework
- **@testing-library/react 16** - Testing utilities
- **ESLint 9** - Linting with TypeScript support
- **jsdom** - DOM testing environment

### Chrome APIs
- **chrome.storage.sync** - Cross-device data persistence
- **chrome.tabs** - New tab override functionality
- **chrome.identity** - OAuth 2.0 authentication (for Spotify integration)

---

## Codebase Structure

```
D:\Code Playground\apex-grid-app\
├── public/
│   ├── manifest.json          # Chrome extension manifest (v3)
│   └── icons/                 # Extension icons (16, 48, 128)
├── scripts/
│   └── verify-build.mjs       # Build verification script
├── src/
│   ├── assets/                # Static assets
│   ├── components/
│   │   ├── ui/                # Reusable UI components (shadcn-style)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Switch.tsx
│   │   │   ├── label.tsx
│   │   │   └── chart.tsx      # Recharts wrapper components
│   │   ├── widgets/           # Widget implementations (32+ widgets)
│   │   │   ├── CalendarWidget.tsx
│   │   │   ├── ClockWidget.tsx
│   │   │   ├── CurrencyWidget.tsx
│   │   │   ├── QuickLinksWidget.tsx
│   │   │   ├── QuoteWidget.tsx
│   │   │   ├── TodoWidget.tsx
│   │   │   ├── RSSWidget.tsx
│   │   │   ├── WeatherWidget.tsx
│   │   │   ├── SpotifyWidget.tsx (OAuth integration)
│   │   │   ├── GitHubWidget.tsx
│   │   │   ├── CryptoWidget.tsx
│   │   │   ├── HoroscopeWidget.tsx
│   │   │   ├── PomodoroWidget.tsx
│   │   │   ├── WorldClockWidget.tsx
│   │   │   ├── CurrencyConverterWidget.tsx
│   │   │   ├── UnitConverterWidget.tsx
│   │   │   ├── QRCodeWidget.tsx
│   │   │   ├── WaterTrackerWidget.tsx
│   │   │   ├── DictionaryWidget.tsx
│   │   │   ├── ColorPaletteWidget.tsx
│   │   │   ├── MeditationWidget.tsx
│   │   │   ├── LocationWidget.tsx
│   │   │   ├── APITesterWidget.tsx
│   │   │   ├── UnsplashWidget.tsx
│   │   │   ├── LifeProgressWidget.tsx
│   │   │   ├── CounterWidget.tsx
│   │   │   ├── CountdownWidget.tsx
│   │   │   ├── TradingViewTickerWidget.tsx
│   │   │   ├── TradingViewChartWidget.tsx
│   │   │   ├── TradingViewMiniWidget.tsx
│   │   │   ├── TradingViewMarketWidget.tsx
│   │   │   └── index.ts       # Widget exports
│   │   ├── Dashboard.tsx      # Main dashboard container
│   │   ├── ErrorBoundary.tsx  # Error handling wrapper
│   │   ├── GridLayout.tsx     # react-grid-layout wrapper
│   │   ├── Greeting.tsx       # Time-based greeting component
│   │   ├── SettingsPanel.tsx  # Settings UI with theme selector
│   │   ├── WidgetRenderer.tsx # Widget factory component
│   │   ├── WidgetWrapper.tsx  # Shared widget container
│   │   ├── WidgetGallery.tsx  # Widget selection gallery
│   │   └── PresetSelector.tsx # Preset layout selector
│   ├── lib/
│   │   ├── utils.ts           # Utility functions (cn helper)
│   │   ├── themes.ts          # Theme definitions (50+ themes)
│   │   ├── backgroundPatterns.ts  # Dynamic background patterns
│   │   ├── presetLayouts.ts   # Preset dashboard layouts
│   │   ├── widgetDefaults.ts  # Default widget configurations
│   │   ├── useKeyboardNavigation.ts  # Keyboard accessibility
│   │   └── useWidgetSize.ts   # Widget size management hook
│   ├── services/
│   │   ├── storage.ts         # Chrome Storage API abstraction
│   │   ├── quoteApi.ts        # Quote fetching service
│   │   ├── currencyApi.ts     # Currency exchange API
│   │   ├── weatherApi.ts      # Weather data API
│   │   ├── spotifyApi.ts      # Spotify OAuth & API integration
│   │   ├── githubApi.ts       # GitHub activity API
│   │   ├── horoscopeApi.ts    # Horoscope data API
│   │   ├── cryptoApi.ts       # Cryptocurrency data API
│   │   └── rssApi.ts          # RSS feed parser
│   ├── stores/                # Zustand state management
│   │   ├── useLayoutStore.ts  # Grid layout state
│   │   ├── useSettingsStore.ts  # App settings (theme, etc.)
│   │   └── useWidgetStore.ts  # Widget state and data
│   ├── test/
│   │   ├── setup.ts           # Vitest test setup
│   │   └── integration/       # Integration tests
│   ├── types/
│   │   ├── index.ts           # Shared type exports
│   │   ├── layout.ts          # Grid layout types
│   │   ├── storage.ts         # Storage schema types
│   │   └── widget.ts          # Widget types
│   ├── App.tsx                # Root application component
│   └── main.tsx               # React entry point
├── index.html                 # Entry HTML (new tab page)
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript project references
├── tsconfig.app.json          # App TypeScript config (strict mode)
├── tsconfig.node.json         # Node scripts TypeScript config
├── vite.config.ts             # Vite build configuration
├── vitest.config.ts           # Vitest test configuration
├── tailwind.config.js         # Tailwind CSS theme customization
├── eslint.config.js           # ESLint configuration
└── postcss.config.js          # PostCSS configuration
```

### Directory Organization Principles
- **components/ui/** - Generic, reusable UI primitives following shadcn patterns
- **components/widgets/** - Domain-specific widget implementations
- **stores/** - Zustand stores for state management (one store per domain)
- **services/** - External API integrations and Chrome API abstractions
- **types/** - TypeScript type definitions organized by domain
- **lib/** - Pure utility functions and custom hooks

---

## Development Workflows

### Setup & Installation
```bash
# Install dependencies (uses pnpm)
pnpm install

# Start dev server (runs on http://localhost:5173)
pnpm run dev

# Build for production
pnpm run build

# Verify build output
pnpm run verify
```

### Testing Workflow
```bash
# Run all tests once
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Generate coverage report
pnpm run test:coverage
```

### Linting & Type Checking
```bash
# Run ESLint
pnpm run lint

# TypeScript type checking (via build)
pnpm run build
```

### Chrome Extension Development
1. Run `pnpm run build` to create the `dist/` folder
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked" and select the `dist/` folder
5. Open a new tab to test the extension
6. After code changes, rebuild and click "Reload" in extensions page

### Git Workflow
- Branch naming: `claude/claude-md-*` for AI-driven changes
- Commit messages: Descriptive, imperative mood (e.g., "Add currency widget")
- Push with: `git push -u origin <branch-name>`

---

## Coding Conventions

### TypeScript Standards
- **Strict mode enabled** - All TypeScript strict flags are on
- **No `any` types** - Use proper typing or `unknown` with type guards
- **Interface over type** - Prefer `interface` for object shapes
- **Explicit return types** - Add return types to all exported functions
- **Path aliases** - Use `@/` for imports: `import { Widget } from '@/types/widget'`

### React Patterns
- **Functional components only** - No class components
- **TypeScript with React.FC** - Use `React.FC<Props>` for component typing
- **Hooks conventions**:
  - Custom hooks start with `use` prefix
  - Place hooks at top of component
  - Always include dependency arrays
- **Memoization** - Use `React.memo()` for widgets to prevent unnecessary re-renders
- **Props destructuring** - Destructure props in function signature

### Component Structure Example
```typescript
import React, { useState, useEffect } from 'react';
import type { WidgetProps } from '@/types/widget';
import { WidgetWrapper } from '../WidgetWrapper';

/**
 * ExampleWidget displays example data
 * - Feature 1 description
 * - Feature 2 description
 */
const ExampleWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const [state, setState] = useState<string>('');

    useEffect(() => {
        // Effect logic
    }, []);

    return (
        <WidgetWrapper id={id} title="Example">
            <div className="flex flex-col">
                {/* Widget content */}
            </div>
        </WidgetWrapper>
    );
};

// Memoize to prevent unnecessary re-renders
export const ExampleWidget = React.memo(ExampleWidgetComponent);
```

### Styling Conventions
- **Tailwind CSS only** - No inline styles or CSS files
- **CSS-in-JS variables** - Use Tailwind theme tokens (e.g., `bg-background`, `text-foreground`)
- **Dark mode support** - Use semantic color tokens that adapt to theme
- **Responsive design** - Mobile-first approach with responsive utilities
- **Animation classes** - Use predefined Tailwind animations from config

### File Naming
- **Components** - PascalCase: `ClockWidget.tsx`, `WidgetWrapper.tsx`
- **Utilities** - camelCase: `utils.ts`, `timeBasedGradients.ts`
- **Types** - camelCase: `widget.ts`, `layout.ts`
- **Tests** - Match source file: `ClockWidget.test.tsx`

### Import Order
1. React and external libraries
2. Internal types (from `@/types`)
3. Internal components (from `@/components`)
4. Internal utilities (from `@/lib`, `@/services`, `@/stores`)
5. Relative imports (`./ or ../`)

Example:
```typescript
import React, { useState } from 'react';
import { format } from 'date-fns';
import type { Widget } from '@/types/widget';
import { Button } from '@/components/ui/Button';
import { useWidgetStore } from '@/stores/useWidgetStore';
import { cn } from '@/lib/utils';
```

### Comments & Documentation
- **JSDoc for exports** - All exported functions, components, and types
- **Inline comments for complexity** - Explain non-obvious logic
- **Component descriptions** - Multi-line comment above component explaining features
- **TODO comments** - Use `// TODO:` for future improvements

---

## Architecture Patterns

### State Management with Zustand

**Store Pattern:**
```typescript
import { create } from 'zustand';

interface ExampleStore {
    data: string;
    setData: (data: string) => void;
    initializeData: () => Promise<void>;
}

export const useExampleStore = create<ExampleStore>((set) => ({
    data: '',

    // Synchronous updates
    setData: (data: string) => {
        set({ data });
    },

    // Async operations with error handling
    initializeData: async () => {
        try {
            const result = await fetchData();
            set({ data: result });
        } catch (error) {
            console.error('Failed to initialize:', error);
        }
    },
}));
```

**Usage in Components:**
```typescript
const data = useExampleStore((state) => state.data);
const setData = useExampleStore((state) => state.setData);
```

### Chrome Storage Integration

**Storage Service Pattern** (`src/services/storage.ts`):
- Type-safe wrapper around `chrome.storage.sync`
- Validation before writes
- Retry logic with exponential backoff
- Custom error types for quota and validation errors

**Usage Example:**
```typescript
import { storage } from '@/services/storage';

// Get data
const layout = await storage.get<Layout>('layout');

// Set data (with validation and retry)
await storage.set('layout', newLayout);

// Error handling
try {
    await storage.set('widgets', widgets);
} catch (error) {
    if (error instanceof StorageQuotaExceededError) {
        // Handle quota error
    }
}
```

### Widget Architecture

**Widget Interface** (`src/types/widget.ts`):
```typescript
export interface WidgetProps {
    id: string;           // Unique widget instance ID
    data?: any;           // Widget-specific data
    onDataChange?: (data: any) => void;  // Callback for data updates
}
```

**Widget Implementation Pattern:**
1. Create component in `src/components/widgets/`
2. Wrap with `WidgetWrapper` for consistent UI
3. Use `React.memo()` for performance
4. Handle data persistence via `onDataChange` callback
5. Export from `src/components/widgets/index.ts`
6. Add widget type to `WidgetType` union in `src/types/widget.ts`

**WidgetWrapper Benefits:**
- Consistent card styling and spacing
- Built-in accessibility features
- Responsive layout handling
- Theme integration

### Grid Layout System

**Integration with react-grid-layout:**
- Layout state managed in `useLayoutStore`
- Persisted to Chrome Storage on every change
- Default layout defined in `src/types/layout.ts`
- Grid configuration:
  - 12 columns
  - 10px row height
  - 16px margin between items
  - Breakpoints for responsive behavior

**Layout Item Structure:**
```typescript
interface LayoutItem {
    i: string;      // Widget ID (must match widget.id)
    x: number;      // Grid column position (0-11)
    y: number;      // Grid row position
    w: number;      // Width in grid units (1-12)
    h: number;      // Height in grid units
    minW?: number;  // Minimum width
    minH?: number;  // Minimum height
}
```

### API Integration Pattern

**External API Services** (see `src/services/quoteApi.ts`, `currencyApi.ts`):
- Use `fetch` API for HTTP requests
- Implement caching to reduce API calls
- Store cached data in widget data store
- Add cache expiration logic
- Handle errors gracefully with fallbacks

**Example:**
```typescript
export async function fetchQuote(): Promise<Quote> {
    try {
        const response = await fetch('https://api.quotable.io/random');
        if (!response.ok) throw new Error('Failed to fetch');
        return await response.json();
    } catch (error) {
        console.error('Quote API error:', error);
        return { text: 'Default quote', author: 'Unknown' };
    }
}
```

---

## Testing Guidelines

### Testing Framework
- **Vitest** - Fast unit test runner with Jest-compatible API
- **@testing-library/react** - Component testing utilities
- **jsdom** - Browser environment simulation

### Test File Organization
- Co-located with source files: `ClockWidget.test.tsx` next to `ClockWidget.tsx`
- Integration tests in `src/test/integration/`
- Test setup in `src/test/setup.ts`

### Testing Patterns

**Component Testing:**
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClockWidget } from './ClockWidget';

describe('ClockWidget', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    it('should render current time', () => {
        vi.setSystemTime(new Date('2024-01-15T14:30:00'));
        render(<ClockWidget id="clock-1" />);

        expect(screen.getByRole('time')).toBeInTheDocument();
    });
});
```

**Store Testing:**
```typescript
import { describe, it, expect } from 'vitest';
import { useLayoutStore } from './useLayoutStore';

describe('useLayoutStore', () => {
    it('should update layout', () => {
        const { setLayout, layout } = useLayoutStore.getState();
        const newLayout = [{ i: 'test', x: 0, y: 0, w: 2, h: 2 }];

        setLayout(newLayout);
        expect(useLayoutStore.getState().layout).toEqual(newLayout);
    });
});
```

### Testing Best Practices
- **Test behavior, not implementation** - Focus on user interactions
- **Use semantic queries** - Prefer `getByRole`, `getByLabelText` over `getByTestId`
- **Mock timers** - Use `vi.useFakeTimers()` for time-dependent components
- **Mock Chrome APIs** - Mock `chrome.storage` in tests (see `src/test/setup.ts`)
- **Avoid snapshot tests** - Prefer explicit assertions
- **Test accessibility** - Verify ARIA labels and keyboard navigation

### Coverage Expectations
- Aim for >80% coverage on critical paths
- All stores should be 100% covered
- UI components should cover major user interactions
- Excluded from coverage: config files, test utilities, type definitions

---

## Chrome Extension Specifics

### Manifest V3 Configuration

**File:** `public/manifest.json`

Key aspects:
- `manifest_version: 3` - Uses latest Chrome extension standard
- `chrome_url_overrides.newtab` - Replaces new tab page
- `permissions`:
  - `storage` - Chrome Storage API for data persistence
  - `geolocation` - Location data for Weather and Location widgets
  - `identity` - OAuth 2.0 for Spotify authentication
- `host_permissions` - API endpoints for CORS bypass:
  - `api.quotable.io` - Quote API
  - `dummyjson.com` - Horoscope and other data
  - `api.rss2json.com` - RSS feed parsing
  - `api.coingecko.com` - Cryptocurrency data
  - `api.open-meteo.com` - Weather data
  - `picsum.photos` - Unsplash images
  - `ipapi.co` - IP-based location
  - `api.github.com` - GitHub activity
  - `accounts.spotify.com` & `api.spotify.com` - Spotify OAuth & API
- `content_security_policy` - Allows TradingView and Spotify iframes

### Chrome Storage API

**Important Constraints:**
- **Sync storage quota:** 102,400 bytes total
- **Per-item quota:** 8,192 bytes
- **Max items:** ~512 items
- **Sync frequency:** Automatically synced across devices

**CRITICAL: Storage Optimization**
Due to the 102KB limit, ApexGrid implements several optimization strategies:
- Widget data is stored separately from widget configuration
- Large data items (themes, TradingView configs) are kept in code, not storage
- Unused widgets are removed from storage to free space
- Regular cleanup of stale data
- See `STORAGE_QUOTA_FIX.md` for detailed optimization strategies

**Storage Keys Used:**
- `layout` - Grid layout configuration (array)
- `widgets` - Widget list with enabled states (array)
- `widgetData` - Widget-specific data (object with widget IDs as keys)
- `settings` - App settings like theme (object)
- `spotifyTokens` - Spotify OAuth tokens (if authenticated)

### Build Process

**Vite Configuration** (`vite.config.ts`):
- Custom plugin copies `manifest.json` to `dist/`
- Custom plugin copies `public/icons/` to `dist/icons/`
- Path alias `@` -> `./src` for imports
- Output configuration for consistent chunk names

**Build Output:**
```
dist/
├── index.html
├── manifest.json
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── assets/
    ├── index.js
    ├── index.css
    └── [vendor chunks]
```

### Extension Icons
- Icons must be PNG format (not SVG)
- Required sizes: 16x16, 48x48, 128x128
- SVG source available at `public/icons/icon.svg`
- Generate PNGs using ImageMagick (see README.md)

### Testing in Chrome
1. Build: `pnpm run build`
2. Load unpacked extension from `dist/` folder
3. Open new tab to test
4. Check console for errors: DevTools → Console
5. Check storage: DevTools → Application → Storage → Chrome Storage

### Chrome Web Store Compliance
ApexGrid follows strict Chrome Web Store policies:
- **No remote code execution**: All code is bundled, no eval() or Function()
- **Secure OAuth**: Spotify OAuth uses chrome.identity API
- **Privacy compliance**: No tracking, no analytics, no external data collection
- **Content Security Policy**: Strict CSP in manifest.json
- **Permissions justification**: Only requests necessary permissions (storage, identity)
- See `CHROME_STORE_POLICY_FIX.md` and `POLICY_COMPLIANCE_SUMMARY.md` for details

---

## New Features in v1.0+

### Widget Gallery
The Widget Gallery (`src/components/WidgetGallery.tsx`) provides a visual interface for users to browse and add widgets to their dashboard. Features:
- Categorized widget display (Productivity, Lifestyle, Financial, etc.)
- Search functionality
- Preview of widget functionality
- One-click widget addition
- Accessible via Settings Panel

### Theme System
ApexGrid now includes an advanced theme system (`src/lib/themes.ts`) with 50+ pre-configured themes:
- **Categories**: Sunset, Ocean, Forest, Neon, Minimal, Pastel, Vibrant, Dark, Gradient
- **Dynamic backgrounds**: Pattern-based backgrounds with customizable colors
- **Full dark mode support**: All themes work in both light and dark modes
- **Theme persistence**: Saved to Chrome Storage and synced across devices

### Preset Layouts
Users can choose from pre-configured dashboard layouts (`src/lib/presetLayouts.ts`):
- **Minimal**: Simple clock and date layout
- **Productivity**: Focus on tasks and time management
- **Developer**: GitHub, API tester, and coding tools
- **Financial**: Crypto, currency, and TradingView widgets
- **Lifestyle**: Weather, horoscope, meditation, water tracking

### Spotify Integration
Full OAuth 2.0 integration with Spotify API (`src/services/spotifyApi.ts`):
- Display currently playing track
- Playback controls (play, pause, skip)
- Album artwork display
- Artist and track information
- Secure token management via chrome.identity
- See `SPOTIFY_OAUTH_SETUP.md` and `SPOTIFY_WIDGET_SETUP.md` for setup instructions

### Weather Widget
Real-time weather data integration:
- Current weather conditions
- Temperature, humidity, wind speed
- Weather icons
- Location-based forecasts
- API key required (stored securely in Chrome Storage)

### TradingView Integration
Embedded TradingView widgets for financial markets:
- **Ticker Widget**: Real-time price tickers
- **Chart Widget**: Interactive price charts
- **Mini Widget**: Compact market overview
- **Market Widget**: Market summary dashboard
- All widgets use TradingView's official embed code

### GitHub Activity Widget
Display GitHub contribution activity:
- Repository activity
- Recent commits
- Contribution graphs
- Public profile data
- Configurable username

---

## Common Tasks & Examples

### Adding a New Widget

1. **Create Widget Component** (`src/components/widgets/NewWidget.tsx`):
```typescript
import React from 'react';
import type { WidgetProps } from '@/types/widget';
import { WidgetWrapper } from '../WidgetWrapper';

const NewWidgetComponent: React.FC<WidgetProps> = ({ id }) => {
    return (
        <WidgetWrapper id={id} title="New Widget">
            <div className="p-4">
                {/* Widget content */}
            </div>
        </WidgetWrapper>
    );
};

export const NewWidget = React.memo(NewWidgetComponent);
```

2. **Export Widget** (`src/components/widgets/index.ts`):
```typescript
export { NewWidget } from './NewWidget';
```

3. **Add Widget Type** (`src/types/widget.ts`):
```typescript
export type WidgetType =
    | 'clock' | 'calendar' | 'todo' | 'quicklinks' | 'quote' | 'rss'
    | 'weather' | 'pomodoro' | 'tradingview-ticker' | 'tradingview-chart'
    | 'tradingview-mini' | 'tradingview-market' | 'spotify' | 'horoscope'
    | 'github' | 'worldclock' | 'currency' | 'water' | 'qrcode'
    | 'unitconverter' | 'dictionary' | 'unsplash' | 'colorpalette'
    | 'meditation' | 'location' | 'apitester' | 'lifeprogress'
    | 'counter' | 'countdown' | 'new'; // Add your new widget type
```

4. **Add to Widget Renderer** (`src/components/WidgetRenderer.tsx`):
```typescript
case 'new':
    return <NewWidget id={widget.id} />;
```

5. **Add to Widget Gallery** (`src/components/WidgetGallery.tsx`):
```typescript
// Add to appropriate category
{
    type: 'new',
    name: 'New Widget',
    description: 'Description of what this widget does',
    icon: <Icon className="w-6 h-6" />,
    category: 'Productivity' // or Lifestyle, Financial, Utilities, Integration
}
```

6. **Add Default Configuration** (`src/lib/widgetDefaults.ts`):
```typescript
case 'new':
    return { w: 4, h: 3, minW: 2, minH: 2 };
```

7. **Create Tests** (`src/components/widgets/NewWidget.test.tsx`):
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NewWidget } from './NewWidget';

describe('NewWidget', () => {
    it('should render', () => {
        render(<NewWidget id="new-1" />);
        expect(screen.getByText('New Widget')).toBeInTheDocument();
    });
});
```

### Adding a New Store

1. **Create Store File** (`src/stores/useNewStore.ts`):
```typescript
import { create } from 'zustand';

interface NewStore {
    data: string;
    setData: (data: string) => void;
}

export const useNewStore = create<NewStore>((set) => ({
    data: '',
    setData: (data) => set({ data }),
}));
```

2. **Add Types** (`src/types/storage.ts` - if persisted):
```typescript
export interface StorageSchema {
    // ... existing keys
    newData: string;
}
```

3. **Integrate with Storage** (if needed):
```typescript
import { storage } from '@/services/storage';

export const useNewStore = create<NewStore>((set) => ({
    data: '',

    initializeData: async () => {
        const data = await storage.get<string>('newData');
        if (data) set({ data });
    },

    setData: async (data) => {
        set({ data });
        await storage.set('newData', data);
    },
}));
```

### Adding a UI Component

1. **Create Component** (`src/components/ui/NewComponent.tsx`):
```typescript
import React from 'react';
import { cn } from '@/lib/utils';

export interface NewComponentProps {
    className?: string;
    children?: React.ReactNode;
}

export const NewComponent: React.FC<NewComponentProps> = ({
    className,
    children
}) => {
    return (
        <div className={cn('base-styles', className)}>
            {children}
        </div>
    );
};
```

2. **Follow shadcn Patterns:**
- Use `cn()` utility for className merging
- Accept `className` prop for customization
- Use semantic Tailwind tokens (e.g., `bg-background` not `bg-white`)
- Support dark mode automatically through theme tokens

### Updating Chrome Storage Schema

1. **Update Type Definition** (`src/types/storage.ts`):
```typescript
export interface StorageSchema {
    layout: Layout;
    widgets: Widget[];
    widgetData: WidgetData;
    settings: Settings;
    newField: NewType;  // Add new field
}
```

2. **Add Validation** (`src/services/storage.ts`):
```typescript
function validateData(key: string, value: any): void {
    // ... existing validations

    if (key === 'newField' && typeof value !== 'expected-type') {
        throw new StorageValidationError('newField must be expected-type');
    }
}
```

3. **Add Migration Logic** (if needed for existing users):
```typescript
// In store initialization
const data = await storage.get<NewType>('newField');
if (!data) {
    // Set default for first-time users
    await storage.set('newField', defaultValue);
}
```

### Widget-Specific Best Practices

**For API-Based Widgets** (Weather, GitHub, Crypto, etc.):
- Implement caching with timestamp to reduce API calls
- Add loading states to show data is being fetched
- Handle network errors gracefully with fallback UI
- Respect API rate limits (use exponential backoff if needed)
- Store cached data in widgetData via onDataChange callback

Example pattern:
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
    const fetchData = async () => {
        // Check cache first
        if (data && Date.now() - data.timestamp < CACHE_DURATION) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const result = await apiCall();
            onDataChange?.({ ...result, timestamp: Date.now() });
        } catch (err) {
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, []);
```

**For OAuth Widgets** (Spotify):
- Use chrome.identity.launchWebAuthFlow for OAuth
- Store tokens in chrome.storage.sync
- Implement token refresh logic
- Handle authentication errors with clear UI
- Provide logout functionality
- See `SPOTIFY_OAUTH_SETUP.md` for reference implementation

**For Embedded Content Widgets** (TradingView):
- Use iframe with proper CSP configuration
- Add iframe URLs to content_security_policy in manifest
- Implement loading states while iframe loads
- Handle iframe errors and timeouts
- Provide fallback content if embed fails

**For User Input Widgets** (Todo, Quick Links, Counter):
- Validate user input before storing
- Implement optimistic UI updates for better UX
- Debounce storage writes to avoid quota issues
- Provide clear feedback for actions (add, delete, edit)
- Implement undo functionality when appropriate

**For Timer Widgets** (Pomodoro, Meditation, Countdown):
- Use setInterval for timer updates
- Clear intervals on component unmount
- Store timer state in localStorage for persistence
- Provide audio/visual notifications when timer completes
- Support pause/resume functionality

**For Data Visualization Widgets** (Life Progress, Crypto Charts):
- Use Recharts components from `src/components/ui/chart.tsx`
- Optimize data before rendering (reduce points if needed)
- Add responsive sizing with useWidgetSize hook
- Provide tooltips for data points
- Support different time ranges/views

### Handling API Integrations

1. **Create Service File** (`src/services/newApi.ts`):
```typescript
export interface ApiResponse {
    data: string;
}

export async function fetchFromApi(): Promise<ApiResponse> {
    try {
        const response = await fetch('https://api.example.com/data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API fetch failed:', error);
        throw error;
    }
}
```

2. **Add Host Permission** (if needed in `public/manifest.json`):
```json
{
    "host_permissions": [
        "https://api.example.com/*"
    ]
}
```

3. **Implement Caching:**
```typescript
interface CachedData {
    data: ApiResponse;
    timestamp: number;
}

const CACHE_DURATION = 3600000; // 1 hour

export async function fetchWithCache(widgetId: string): Promise<ApiResponse> {
    const cached = useWidgetStore.getState().getWidgetData<CachedData>(widgetId);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    const data = await fetchFromApi();
    const cachedData: CachedData = { data, timestamp: Date.now() };

    await useWidgetStore.getState().setWidgetData(widgetId, cachedData);
    return data;
}
```

---

## Important Files Reference

### Configuration Files

| File | Purpose | Notes |
|------|---------|-------|
| `package.json` | Dependencies and scripts | Uses pnpm, React 19, Vite 7 |
| `tsconfig.json` | TypeScript project config | Uses project references |
| `tsconfig.app.json` | App TypeScript config | Strict mode, path aliases |
| `vite.config.ts` | Vite build config | Custom plugin for manifest |
| `vitest.config.ts` | Test configuration | jsdom, coverage settings |
| `tailwind.config.js` | Tailwind theme | Custom animations, colors |
| `eslint.config.js` | Linting rules | TypeScript, React hooks |
| `public/manifest.json` | Chrome extension manifest | Manifest V3 |

### Core Application Files

| File | Purpose | Line Reference |
|------|---------|----------------|
| `src/main.tsx` | React entry point | App mount point |
| `src/App.tsx` | Root component | Main app structure |
| `src/components/Dashboard.tsx` | Main dashboard | Widget grid container |
| `src/components/GridLayout.tsx` | Grid wrapper | react-grid-layout integration |

### State Management

| File | Purpose | Key Functions |
|------|---------|---------------|
| `src/stores/useLayoutStore.ts` | Layout state | `setLayout`, `updateLayout`, `initializeLayout` |
| `src/stores/useWidgetStore.ts` | Widget state | `addWidget`, `removeWidget`, `setWidgetData` |
| `src/stores/useSettingsStore.ts` | App settings | `setTheme`, `initializeSettings` |

### Services & Utilities

| File | Purpose | Key Exports |
|------|---------|-------------|
| `src/services/storage.ts` | Chrome Storage wrapper | `storage.get`, `storage.set` |
| `src/services/quoteApi.ts` | Quote fetching | `fetchQuote` |
| `src/services/currencyApi.ts` | Currency exchange | `fetchCurrencyRates` |
| `src/services/weatherApi.ts` | Weather data | `fetchWeather` |
| `src/services/spotifyApi.ts` | Spotify OAuth & API | `authenticateSpotify`, `fetchNowPlaying` |
| `src/services/githubApi.ts` | GitHub activity | `fetchGitHubActivity` |
| `src/services/horoscopeApi.ts` | Horoscope data | `fetchHoroscope` |
| `src/services/cryptoApi.ts` | Cryptocurrency | `fetchCryptoData` |
| `src/services/rssApi.ts` | RSS feed parser | `fetchRSSFeed` |
| `src/lib/utils.ts` | Utility functions | `cn` (className merge) |
| `src/lib/themes.ts` | Theme system | 50+ theme definitions |
| `src/lib/backgroundPatterns.ts` | Dynamic backgrounds | Background pattern logic |
| `src/lib/presetLayouts.ts` | Preset layouts | Pre-configured dashboard layouts |
| `src/lib/widgetDefaults.ts` | Widget defaults | Default widget configurations |
| `src/lib/useWidgetSize.ts` | Widget sizing | Widget size management hook |
| `src/lib/useKeyboardNavigation.ts` | Keyboard a11y | Keyboard navigation hook |

### Type Definitions

| File | Purpose | Key Types |
|------|---------|-----------|
| `src/types/widget.ts` | Widget types | `Widget`, `WidgetType`, `WidgetProps` |
| `src/types/layout.ts` | Layout types | `Layout`, `LayoutItem` |
| `src/types/storage.ts` | Storage schema | `StorageSchema` |

### Documentation

| File | Purpose |
|------|---------|
| `README.md` | Project overview and setup |
| `CLAUDE.md` | AI assistant guide (this file) |
| `WARP.md` | Warp terminal specific documentation |
| `SPOTIFY_OAUTH_SETUP.md` | Spotify OAuth integration guide |
| `SPOTIFY_WIDGET_SETUP.md` | Spotify widget configuration |
| `CHROME_STORE_SUBMISSION.md` | Chrome Web Store submission guide |
| `CHROME_STORE_POLICY_FIX.md` | Policy compliance fixes |
| `POLICY_COMPLIANCE_SUMMARY.md` | Compliance requirements summary |
| `RESUBMISSION_CHECKLIST.md` | Pre-submission checklist |
| `STORAGE_QUOTA_FIX.md` | Storage optimization guide |
| `UPDATE_GUIDE.md` | Version update instructions |

---

## Tips for AI Assistants

### Before Starting Any Task

1. **Understand the context:**
   - This is a Chrome extension with strict security policies
   - Storage is limited to 102KB - optimize data structures
   - All API calls must have host_permissions in manifest
   - OAuth must use chrome.identity, not popup windows
   - No remote code execution allowed

2. **Check existing implementations:**
   - Look for similar widgets before creating new ones
   - Review existing API services for patterns
   - Check how other widgets handle caching and errors
   - Follow established patterns for consistency

3. **Plan storage usage:**
   - Estimate data size before implementing
   - Use widgetData for widget-specific storage
   - Keep theme data in code, not storage
   - Implement cleanup for stale data

### When Making Changes

1. **Read relevant context first:**
   - Check existing patterns in similar files
   - Review type definitions before modifying
   - Read tests to understand expected behavior
   - Check CLAUDE.md sections relevant to your task

2. **Maintain consistency:**
   - Follow existing naming conventions
   - Match code style (formatting, imports, etc.)
   - Use established patterns (store structure, component layout)
   - Follow the component structure example in this document

3. **Test your changes:**
   - Write tests for new functionality
   - Run existing tests to ensure nothing breaks
   - Test in actual Chrome extension environment when possible
   - Test both light and dark modes
   - Test with different screen sizes
   - Check Chrome Storage quota usage

4. **Update documentation:**
   - Update this file (CLAUDE.md) if adding new patterns
   - Update README.md if changing user-facing features
   - Add JSDoc comments to new exports
   - Update relevant .md files for major features

### Common Pitfalls to Avoid

1. **Chrome API Assumptions:**
   - Don't assume `localStorage` works - use `chrome.storage`
   - Remember storage quota limits (102KB for sync storage)
   - Handle storage errors gracefully
   - Don't store large objects - optimize data structures
   - Use `chrome.storage.sync` for user settings, not `chrome.storage.local`

2. **State Management:**
   - Don't bypass stores for Chrome Storage access
   - Always validate data before storage writes
   - Don't forget error handling in async store actions
   - Avoid circular dependencies between stores
   - Use Zustand's `get()` method to access other store values

3. **Styling:**
   - Avoid hardcoded colors - use theme tokens from `themes.ts`
   - Don't forget dark mode support (test both modes)
   - Test responsive behavior on different screen sizes
   - Use Tailwind's semantic classes (bg-background, text-foreground)
   - Avoid inline styles - use Tailwind utility classes

4. **Performance:**
   - Memoize widgets with `React.memo()` to prevent re-renders
   - Avoid unnecessary re-renders by using proper dependency arrays
   - Use lazy loading for heavy components if needed
   - Debounce API calls and storage writes
   - Cache API responses when possible

5. **Accessibility:**
   - Add ARIA labels to interactive elements
   - Ensure keyboard navigation works (Tab, Enter, Escape)
   - Test with screen readers when possible
   - Support reduced motion preferences
   - Use semantic HTML elements (button, nav, etc.)

6. **Widget Development:**
   - Always export widgets from `src/components/widgets/index.ts`
   - Add widget type to `WidgetType` union in `src/types/widget.ts`
   - Register widget in `WidgetRenderer.tsx` switch statement
   - Add widget to `widgetDefaults.ts` for default configuration
   - Consider widget size constraints (minW, minH in grid layout)
   - Test widget behavior when resized to minimum dimensions

7. **API Integration:**
   - Add API endpoint to `host_permissions` in manifest.json
   - Implement error handling for network failures
   - Add loading states for async operations
   - Cache responses to reduce API calls
   - Respect API rate limits
   - Never expose API keys in client code - use environment variables or user input

8. **OAuth & Security:**
   - Use `chrome.identity` API for OAuth flows (not popup windows)
   - Store tokens securely in chrome.storage
   - Handle token expiration and refresh
   - Never log sensitive data (tokens, API keys)
   - Follow Chrome Web Store security policies

### Quick Reference Commands

```bash
# Development
pnpm run dev              # Start dev server
pnpm run build            # Build extension
pnpm run verify           # Verify build

# Testing
pnpm run test             # Run tests once
pnpm run test:watch       # Watch mode
pnpm run test:coverage    # Coverage report

# Quality
pnpm run lint             # Run ESLint
```

### File Path Patterns

When creating imports, always use path aliases:
```typescript
// ✅ Good
import { Widget } from '@/types/widget';
import { Button } from '@/components/ui/Button';

// ❌ Avoid
import { Widget } from '../../types/widget';
import { Button } from '../ui/Button';
```

### Troubleshooting Common Issues

**Issue: "QUOTA_BYTES_PER_ITEM quota exceeded"**
- **Cause**: A single storage item exceeds 8,192 bytes
- **Solution**: Break data into smaller chunks or optimize data structure
- **Reference**: See `STORAGE_QUOTA_FIX.md` for optimization strategies

**Issue: "QUOTA_BYTES quota exceeded"**
- **Cause**: Total storage exceeds 102,400 bytes
- **Solution**: Remove unused widgets, clear stale data, optimize theme storage
- **Reference**: See `STORAGE_QUOTA_FIX.md`

**Issue: Widgets not rendering after adding new widget type**
- **Cause**: Missing export or missing case in WidgetRenderer
- **Solution**:
  1. Check widget is exported in `src/components/widgets/index.ts`
  2. Verify case statement exists in `WidgetRenderer.tsx`
  3. Confirm WidgetType includes new type in `src/types/widget.ts`

**Issue: Spotify widget not authenticating**
- **Cause**: OAuth configuration missing or invalid
- **Solution**:
  1. Check Spotify Client ID in manifest.json
  2. Verify redirect URI matches extension ID
  3. See `SPOTIFY_OAUTH_SETUP.md` for complete setup
  4. Check chrome.identity permissions in manifest

**Issue: Layout not persisting after refresh**
- **Cause**: Storage write failure or data validation error
- **Solution**:
  1. Check browser console for storage errors
  2. Verify layout data structure matches `Layout` type
  3. Test storage quota with DevTools → Application → Storage

**Issue: API calls failing with CORS errors**
- **Cause**: Missing host_permissions in manifest.json
- **Solution**: Add API endpoint to `host_permissions` array in manifest.json

**Issue: Dark mode colors not working**
- **Cause**: Using hardcoded colors instead of theme tokens
- **Solution**: Replace hardcoded colors with Tailwind theme classes:
  - Use `bg-background` instead of `bg-white`
  - Use `text-foreground` instead of `text-black`
  - Check `src/lib/themes.ts` for available tokens

**Issue: Widget not updating after data change**
- **Cause**: Missing dependency in useEffect or memo preventing re-render
- **Solution**:
  1. Check useEffect dependency arrays
  2. Verify React.memo() is comparing props correctly
  3. Use React DevTools to debug re-renders

**Issue: Extension not loading after build**
- **Cause**: Build errors or manifest.json not copied
- **Solution**:
  1. Run `pnpm run verify` to check build output
  2. Check dist/ folder contains manifest.json
  3. Review browser console for load errors
  4. Verify all required files are in dist/

### Getting Help

If you encounter issues or need clarification:
1. Check the documentation files listed above
2. Review similar existing implementations
3. Check the test files for usage examples
4. Consult the Chrome Extension documentation for API questions
5. Review the Troubleshooting section above
6. Check browser DevTools console for errors
7. Inspect Chrome Storage in DevTools → Application → Storage

---

**Last Updated:** 2025-11-26
**Project Version:** 1.0.2
**Maintained By:** AI Assistants and Human Developers

This document should be updated whenever significant architectural changes, new patterns, or important conventions are introduced to the codebase.
