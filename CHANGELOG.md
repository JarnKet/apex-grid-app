# ApexGrid Changelog

## Latest Update - Widget Gallery

### New Widget Gallery Feature

**App Drawer Style Widget Management**
- Completely redesigned widget management with a dedicated Widget Gallery
- Separated from Settings panel for better UX
- New "+" button in the top-right corner (next to Settings)

**Features:**
- **Category Filtering**: Browse widgets by All, Productivity, Information, or Finance
- **Visual Cards**: Each widget displayed with icon, name, and description
- **Preview Panel**: Click any widget to see detailed information and features
- **Status Indicators**: "Added" badges show which widgets are already on your dashboard
- **One-Click Add**: Add widgets instantly with a single button click
- **Responsive Grid**: Beautiful 3-column grid layout (adapts to screen size)

**Widget Categories:**
- **Productivity**: Clock, Calendar, Todo List, Quick Links
- **Information**: Weather, Daily Quote, Tech News (RSS)
- **Finance**: Crypto & Gold

**Settings Panel Changes:**
- Removed widget toggles from Settings
- Settings now focused on appearance and personalization only
- Cleaner, more focused interface

## Recent Updates

### Features Added

1. **RSS Widget Now Visible**
   - Added RSS widget to default widgets list
   - Added RSS widget to default layout (full width at bottom)

2. **Real-Time Clock**
   - Clock widget now updates every second instead of every minute
   - Shows hours, minutes, and seconds

3. **Improved Widget Sizes**
   - Calendar widget: Increased from 3x2 to 4x3 grid units
   - Todo widget: Increased from 3x2 to 4x3 grid units
   - Quote widget: Increased from 6x1 to 4x3 grid units
   - Better default layout for improved usability

4. **Crypto & Gold Widget**
   - Replaced Currency widget with new Crypto & Gold widget
   - Shows Bitcoin, Ethereum, and Gold prices
   - Displays 24-hour price changes with trend indicators
   - Uses CoinGecko API (free tier, no API key required)
   - Auto-refreshes every 5 minutes

5. **Weather Widget**
   - New weather widget showing current conditions
   - Displays temperature, weather description, wind speed, and humidity
   - Uses browser geolocation to get user's location
   - Uses Open-Meteo API (free, no API key required)
   - Auto-refreshes every 30 minutes

6. **Lucide Icons**
   - Replaced emoji icons with Lucide React icons throughout the app
   - Settings panel now uses Search icon instead of emoji
   - Widget remove button now uses X icon from Lucide
   - More consistent and professional appearance

7. **Larger Settings Modal**
   - Settings panel now takes up 90% of viewport width and height
   - Better visibility and easier to use on all screen sizes

8. **Fixed Remove Button**
   - Widget remove (X) button now works correctly
   - Added event propagation prevention to avoid conflicts with drag-and-drop

### Technical Changes

- Updated `WidgetType` to include 'crypto', 'weather', and removed 'currency'
- Created `cryptoApi.ts` service for fetching cryptocurrency and gold prices
- Created `weatherApi.ts` service for fetching weather data
- Created `CryptoWidget.tsx` component
- Created `WeatherWidget.tsx` component
- Updated `manifest.json` with new API permissions:
  - Added geolocation permission
  - Added host permissions for CoinGecko and Open-Meteo APIs
  - Removed ExchangeRate-API permission
- Updated default layout configuration in `layout.ts`
- Updated default widgets in `useWidgetStore.ts`

### Default Layout

The new default layout is:
- Row 1: Clock (3x2), Weather (3x2), Quick Links (3x2), Crypto (3x2)
- Row 2-3: Calendar (4x3), Todo (4x3), Quote (4x3)
- Row 4-5: RSS Feed (12x3, full width)

All widgets are draggable and resizable as before.
