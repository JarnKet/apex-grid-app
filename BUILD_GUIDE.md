# Build and Deployment Guide

## Building the Extension

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Production
```bash
npm run build
```

This creates a `dist` folder with:
- `manifest.json` - Extension configuration
- `index.html` - Main page
- `assets/` - Bundled JavaScript and CSS
- `icons/` - Extension icons (16px, 48px, 128px)

### 3. Verify Build
```bash
npm run verify
```

## Loading in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `dist` folder
5. Open a new tab to see ApexGrid

## Build Configuration

The build is configured in `vite.config.ts`:
- Bundles React app for production
- Copies `manifest.json` to dist
- Copies `icons/` folder to dist
- Optimizes assets for fast loading

## Icon Generation

Current icons are placeholders. For production:

```bash
# See public/icons/README.md for instructions
```

## Troubleshooting

**Build fails**: Run `npm install` and try again
**Extension won't load**: Check `npm run verify` output
**New tab not working**: Disable other new tab extensions

See [EXTENSION_TESTING.md](./EXTENSION_TESTING.md) for detailed testing.
