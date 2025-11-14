# Technology Stack

## Core Technologies

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite (configured for Chrome extension)
- **UI Library**: shadcn/ui + Tailwind CSS
- **Grid System**: react-grid-layout
- **State Management**: Zustand
- **Date Utilities**: date-fns
- **Storage**: Chrome Storage API (sync namespace)

## External APIs

- **Quotes**: Quotable.io API (https://api.quotable.io/random)
- **Currency**: ExchangeRate-API (https://api.exchangerate-api.com/v4/latest/USD)

## Browser Extension

- **Manifest**: Version 3
- **Permissions**: storage
- **Host Permissions**: api.quotable.io, api.exchangerate-api.com
- **Override**: chrome_url_overrides.newtab

## Development Commands

Since the project is not yet implemented, these are the expected commands:

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build extension
npm run build

# Type checking
npm run type-check

# Run tests
npm run test
```

## Build Configuration

- Vite configured to output Chrome extension structure
- manifest.json copied to dist folder
- Icons generated in sizes: 16px, 48px, 128px
- Output optimized for production with code splitting

## Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for formatting (if configured)
- Functional React components with hooks
- Zustand for state management (no Redux/Context API)
