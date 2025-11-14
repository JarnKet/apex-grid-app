# Testing ApexGrid Chrome Extension

## Build the Extension

```bash
npm run build
```

This creates a `dist` folder with all extension files.

## Load Extension in Chrome

### Step 1: Open Chrome Extensions Page
1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)

### Step 2: Load Unpacked Extension
1. Click "Load unpacked" button
2. Navigate to the `dist` folder in this project
3. Select the `dist` folder and click "Select Folder"

### Step 3: Verify Installation
- ApexGrid should appear in your extensions list
- The extension should show:
  - Name: ApexGrid
  - Version: 1.0.0
  - Description: Transform your new tab into a beautiful, productive dashboard

## Test New Tab Override

### Test 1: Open New Tab
1. Open a new tab in Chrome (Ctrl+T or Cmd+T)
2. The ApexGrid dashboard should load instead of the default new tab
3. Verify the dashboard displays within 1 second

### Test 2: First-Run Experience
1. On first load, the dashboard should display with default widgets:
   - Clock widget
   - Calendar widget
   - Todo widget
   - Quick Links widget
   - Quote widget
   - Currency widget

### Test 3: Layout Persistence
1. Drag a widget to a new position
2. Close the tab
3. Open a new tab
4. Verify the widget is in the new position (layout persisted)

### Test 4: Widget Functionality
- **Clock**: Should display current time and update every minute
- **Calendar**: Should show current month with today highlighted
- **Todo**: Should allow adding, completing, and deleting tasks
- **Quick Links**: Should allow adding and clicking links
- **Quote**: Should display a daily quote
- **Currency**: Should display exchange rates

### Test 5: Settings
1. Click the settings button
2. Toggle dark/light theme
3. Verify theme changes immediately
4. Close and reopen tab
5. Verify theme preference persisted

### Test 6: Storage Sync
1. Make changes to the dashboard (move widgets, add todos, etc.)
2. Check Chrome DevTools > Application > Storage > Chrome Storage
3. Verify data is stored in `chrome.storage.sync`

## Troubleshooting

### Extension Won't Load
- Check that `dist/manifest.json` exists
- Verify manifest.json is valid JSON
- Check Chrome DevTools console for errors

### New Tab Not Overriding
- Verify `chrome_url_overrides.newtab` is set to `index.html` in manifest
- Try reloading the extension
- Check for conflicts with other new tab extensions

### Widgets Not Working
- Open Chrome DevTools (F12) on the new tab page
- Check Console for JavaScript errors
- Verify API permissions in manifest.json

### Storage Not Persisting
- Check that "storage" permission is granted
- Verify Chrome Storage API is available
- Check storage quota (sync storage has limits)

## Development Testing

### Hot Reload During Development
```bash
npm run dev
```

Then load the extension from the `dist` folder. Note: You'll need to manually reload the extension after changes.

### Debugging
1. Right-click the new tab page
2. Select "Inspect"
3. Use Chrome DevTools to debug

## Production Checklist

Before publishing to Chrome Web Store:

- [ ] Replace placeholder icons with proper PNG icons from SVG
- [ ] Test on multiple screen sizes
- [ ] Test with slow network (API failures)
- [ ] Test storage quota limits
- [ ] Verify all permissions are necessary
- [ ] Test cross-device sync
- [ ] Run accessibility audit
- [ ] Test with screen reader
- [ ] Verify WCAG AA compliance
- [ ] Test in Chrome stable, beta, and dev channels
