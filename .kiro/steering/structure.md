# Project Structure

## Directory Organization

```
apexgrid/
├── public/
│   ├── manifest.json          # Chrome extension manifest (V3)
│   └── icons/                 # Extension icons (16, 48, 128px)
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn/ui base components
│   │   ├── widgets/          # Widget implementations
│   │   │   ├── ClockWidget.tsx
│   │   │   ├── CalendarWidget.tsx
│   │   │   ├── TodoWidget.tsx
│   │   │   ├── QuickLinksWidget.tsx
│   │   │   ├── QuoteWidget.tsx
│   │   │   └── CurrencyWidget.tsx
│   │   ├── Dashboard.tsx     # Main dashboard container
│   │   ├── GridLayout.tsx    # react-grid-layout wrapper
│   │   ├── WidgetWrapper.tsx # Base widget container
│   │   ├── WidgetRenderer.tsx # Widget type mapper
│   │   └── SettingsPanel.tsx # Settings UI
│   ├── stores/
│   │   ├── useLayoutStore.ts # Layout state (positions, sizes)
│   │   ├── useWidgetStore.ts # Widget data state
│   │   └── useSettingsStore.ts # App settings state
│   ├── services/
│   │   ├── storage.ts        # Chrome Storage API abstraction
│   │   ├── quoteApi.ts       # Quotable.io API client
│   │   └── currencyApi.ts    # ExchangeRate-API client
│   ├── types/
│   │   ├── widget.ts         # Widget type definitions
│   │   ├── layout.ts         # Layout type definitions
│   │   └── storage.ts        # Storage schema types
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   ├── App.tsx               # Root component
│   └── main.tsx              # Entry point
├── .kiro/
│   ├── specs/                # Project specifications
│   └── steering/             # AI assistant guidance
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Component Architecture

### Widget Pattern

All widgets follow a consistent interface:

```typescript
interface WidgetProps {
  id: string;
  data?: any;
  onDataChange?: (data: any) => void;
}
```

Each widget is wrapped in `WidgetWrapper` which provides:
- Drag handle for repositioning
- Card styling for consistency
- Error boundary for isolation
- Remove button in header

### State Management Pattern

- **Layout Store**: Grid positions and sizes
- **Widget Store**: Widget instances and widget-specific data
- **Settings Store**: Theme, background, and app preferences

All stores persist to Chrome Storage API automatically on changes.

### Service Layer Pattern

Services abstract external dependencies:
- `storage.ts`: Chrome Storage API wrapper
- `quoteApi.ts`: Quote fetching with retry logic
- `currencyApi.ts`: Currency fetching with retry logic

## Key Conventions

- Use functional components with hooks (no class components)
- Store state in Zustand, not component state for persistent data
- Wrap external API calls in service layer
- Use TypeScript strict mode
- Implement error boundaries around widgets
- Cache API responses with timestamps
- Debounce layout changes to reduce storage writes
- Use React.memo for widget components
