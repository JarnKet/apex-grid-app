# Preset Layouts & Finance Feeds - November 15, 2025

## Overview

ApexGrid now supports both developers and traders with:
1. **Finance & Trading RSS Feeds** - Added 6 new finance feeds to complement tech news
2. **Preset Dashboard Layouts** - Quick-apply optimized layouts for different user types

---

## 1. Finance & Trading RSS Feeds ✅

### New Finance Feeds Added

**File**: `src/services/rssApi.ts`

Added 6 new finance and trading RSS feeds:

1. **Bloomberg Markets** - `https://feeds.bloomberg.com/markets/news.rss`
   - Global market news and analysis
   
2. **Reuters Finance** - `https://feeds.reuters.com/finance/markets`
   - International financial news
   
3. **CNBC Markets** - `https://feeds.cnbc.com/cnbc/financials/`
   - US market news and analysis
   
4. **MarketWatch** - `https://feeds.marketwatch.com/marketwatch/topstories/`
   - Stock market and investment news
   
5. **Seeking Alpha** - `https://seekingalpha.com/feed.xml`
   - Investment research and analysis
   
6. **Crypto News** - `https://feeds.bloomberg.com/markets/cryptocurrency.rss`
   - Cryptocurrency market news

### Feed Organization

Feeds are now organized into two categories:

**Tech Feeds** (5 feeds):
- Hacker News
- TechCrunch
- The Verge
- Ars Technica
- Dev.to

**Finance Feeds** (6 feeds):
- Bloomberg Markets
- Reuters Finance
- CNBC Markets
- MarketWatch
- Seeking Alpha
- Crypto News

### RSS Widget Updates

**File**: `src/components/widgets/RSSWidget.tsx`

- Feed selector now shows feeds organized by category
- Improved UI with category headers
- Scrollable feed list for better UX
- Easy switching between tech and finance news

---

## 2. Preset Dashboard Layouts ✅

### Preset System

**File**: `src/lib/presetLayouts.ts`

Created a flexible preset system with two initial presets:

#### Developer Preset 💻

**Optimized for**: Software developers, engineers, tech enthusiasts

**Widgets Included**:
- Clock (top left)
- Weather (top center)
- Pomodoro Timer (top right, large)
- Quote (top right)
- Calendar (left side)
- Todo List (center)
- Tech News RSS (bottom, full width)
- Quick Links (right side)

**Layout Features**:
- Focus on productivity tools
- Tech news prominently displayed
- Pomodoro timer for focus sessions
- Quick access to bookmarks

#### Trader Preset 📈

**Optimized for**: Traders, investors, financial analysts

**Widgets Included**:
- Market Ticker (top, full width)
- Trading Chart (main area, large)
- Market Overview (right side)
- Symbol Overview (bottom left)
- Quick Links (bottom center)
- Daily Quote (bottom right)
- Finance News RSS (bottom, full width)
- Clock (bottom right)

**Layout Features**:
- Market ticker at top for quick price checks
- Large trading chart for analysis
- Multi-tab market overview
- Finance news feed
- Compact clock for time reference

### Preset Selector Component

**File**: `src/components/PresetSelector.tsx`

Features:
- Dialog-based preset selection
- Visual preview of each preset
- Shows included widgets for each preset
- One-click apply functionality
- Confirmation message with tips

### Integration with Settings

**File**: `src/components/SettingsPanel.tsx`

- Added "Dashboard Presets" section to Layout tab
- Accessible from Settings panel
- Easy to discover and apply presets
- Future-proof for adding more presets

### Widget Store Updates

**File**: `src/stores/useWidgetStore.ts`

Added new method:
```typescript
setWidgets: (widgets: Widget[]) => void
```

- Allows setting all widgets at once
- Used by preset system
- Automatically persists to storage

---

## How to Use

### Applying a Preset

1. Click the **Settings** icon (⚙️) in top-right corner
2. Go to **Layout** tab
3. Click **Dashboard Presets** section
4. Choose your preset:
   - **Developer** - For tech work and coding
   - **Trader** - For market analysis and trading
5. Click **Apply [Preset] Layout**
6. Dashboard updates instantly

### Switching Between Presets

- Presets can be applied multiple times
- Each application replaces the current layout
- Your widget data is preserved
- Customize after applying if needed

### Future Presets

The system is designed to easily add more presets:
- Analyst preset (data visualization focused)
- Minimalist preset (essential widgets only)
- Crypto trader preset (crypto-specific)
- And more...

---

## Technical Details

### Preset Structure

```typescript
interface PresetLayout {
    id: string;                    // Unique identifier
    name: string;                  // Display name
    description: string;           // User-friendly description
    icon: string;                  // Emoji icon
    widgets: Widget[];             // Widget instances
    layout: Layout;                // Grid layout configuration
}
```

### Data Flow

1. User clicks "Apply Preset"
2. PresetSelector retrieves preset data
3. Updates widget store with new widgets
4. Updates layout store with new layout
5. Persists both to Chrome Storage
6. Dashboard re-renders with new layout

### Storage

- Presets are stored in code (not user storage)
- User's current layout is stored in Chrome Storage
- Applying preset overwrites current layout
- No data loss - just layout change

---

## Benefits

### For Developers
✅ Tech news always visible
✅ Productivity tools (Todo, Pomodoro)
✅ Quick access to bookmarks
✅ Calendar and time management
✅ Inspirational quotes

### For Traders
✅ Real-time market data
✅ Advanced trading charts
✅ Multi-market overview
✅ Financial news feed
✅ Quick symbol lookups

### For All Users
✅ Quick setup with presets
✅ Customizable after applying
✅ Easy to switch between presets
✅ Extensible for future presets
✅ No technical knowledge needed

---

## Future Enhancements

Planned additions:
1. **More Presets**:
   - Analyst preset (data visualization)
   - Minimalist preset (essential only)
   - Crypto trader preset
   - Content creator preset

2. **Preset Management**:
   - Save custom presets
   - Share presets with others
   - Preset versioning
   - Community presets

3. **Smart Presets**:
   - Time-based presets (morning/evening)
   - Context-aware presets
   - AI-suggested presets

---

## Testing Recommendations

1. **Developer Preset**:
   - Verify all 8 widgets load
   - Check tech news feed works
   - Test Pomodoro timer
   - Verify layout spacing

2. **Trader Preset**:
   - Verify market ticker displays properly
   - Check trading chart loads
   - Test market overview tabs
   - Verify finance news feed

3. **Switching**:
   - Apply Developer preset
   - Switch to Trader preset
   - Switch back to Developer
   - Verify no data loss

4. **Customization**:
   - Apply preset
   - Resize widgets
   - Drag widgets
   - Verify changes persist

---

## Notes

- Presets are read-only (defined in code)
- Users can customize after applying
- Applying preset doesn't delete widget data
- RSS feeds require internet connection
- All feeds are free and public
- No API keys required for feeds
