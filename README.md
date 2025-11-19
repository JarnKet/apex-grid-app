# ApexGrid - Chrome New Tab Extension

A beautiful, customizable dashboard that replaces your Chrome new tab page with drag-and-drop widgets.

## Features

- 🎯 Drag-and-drop widget positioning
- 📏 Resizable widgets
- 🕐 Clock widget
- 📅 Calendar widget
- ✅ Todo list widget
- 🔗 Quick links widget
- 💬 Daily quote widget
- 💱 Currency exchange widget
- 🎨 Multiple themes and customizable backgrounds
- 🌓 Dark/light mode support
- ☁️ Cross-device sync via Chrome Storage

## Tech Stack

- React 19 + TypeScript
- Vite (Chrome extension build)
- Tailwind CSS + shadcn/ui
- react-grid-layout
- Zustand (state management)
- date-fns

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev

# Build extension
pnpm run build

# Type check
pnpm run type-check
```

### Extension Icons

The project includes placeholder PNG icons. For production, generate proper icons from `public/icons/icon.svg`:

```bash
# Using ImageMagick
magick public/icons/icon.svg -resize 16x16 public/icons/icon16.png
magick public/icons/icon.svg -resize 48x48 public/icons/icon48.png
magick public/icons/icon.svg -resize 128x128 public/icons/icon128.png
```

See `public/icons/README.md` for more options.

## Installation

1. Build the extension: `pnpm run build`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist` folder

For detailed testing instructions, see [EXTENSION_TESTING.md](./EXTENSION_TESTING.md).

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── widgets/         # Widget implementations
│   ├── Dashboard.tsx    # Main dashboard
│   ├── GridLayout.tsx   # Grid wrapper
│   └── SettingsPanel.tsx
├── stores/              # Zustand stores
├── services/            # API clients & storage
├── types/               # TypeScript types
└── lib/                 # Utilities
```

## License

MIT
