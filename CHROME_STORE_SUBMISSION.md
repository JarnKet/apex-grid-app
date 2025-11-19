# Chrome Web Store Submission Guide

## Extension Information

### Name
ApexGrid

### Tagline
Transform your new tab into a beautiful, customizable widget dashboard

### Description (Short - 132 characters max)
Customizable new tab dashboard with 30+ drag-and-drop widgets, 12 presets, and 17 stunning themes for productivity and personalization.

### Description (Detailed)
ApexGrid replaces your Chrome new tab page with a beautiful, fully customizable dashboard featuring drag-and-drop widgets.

**Key Features:**
• 30+ Widgets: Clock, calendar, todo list, quick links, weather, quotes, currency, crypto, stocks, RSS feeds, and more
• 12 Preset Layouts: Instantly switch between curated dashboard configurations
• 17 Beautiful Themes: Choose from stunning color schemes including Mono, Sunset, Ocean, Forest, and more
• Drag & Drop: Easily rearrange widgets to create your perfect layout
• Resizable Widgets: Customize widget sizes to fit your needs
• Dark/Light Mode: Automatic or manual theme switching
• Custom Backgrounds: Set solid colors, gradients, or patterns
• Cross-Device Sync: Your settings sync across all your Chrome devices
• Responsive Design: Works beautifully on any screen size
• Keyboard Accessible: Full keyboard navigation support

**Perfect For:**
- Productivity enthusiasts who want quick access to essential information
- Users who want a personalized browsing experience
- Anyone looking to replace the default new tab with something beautiful and functional

**Privacy:**
- No data collection or tracking
- All data stored locally in Chrome Storage
- No external servers or analytics
- Open source and transparent

Transform your new tab into a productivity powerhouse with ApexGrid!

### Category
Productivity

### Language
English

### Single Purpose Description
ApexGrid serves a single purpose: to replace the Chrome new tab page with a customizable, widget-based dashboard that provides users with quick access to useful information and tools in a beautiful, organized interface.

## Privacy & Permissions

### Permissions Justification

**storage**
- Required to save user preferences, widget configurations, and dashboard layouts
- Enables cross-device synchronization of settings via Chrome Storage Sync API
- All data is stored locally in the user's Chrome profile

**geolocation**
- Optional permission used only by the Weather widget
- Allows automatic location detection for local weather information
- Users can manually enter location if they prefer not to grant this permission
- Not required for core functionality

### Host Permissions Justification

**https://api.quotable.io/***
- Used by Quote widget to fetch daily inspirational quotes
- Public API, no authentication required

**https://api.rss2json.com/***
- Used by RSS Feed widget to fetch and parse RSS feeds
- Converts RSS/Atom feeds to JSON format

**https://api.coingecko.com/***
- Used by Crypto widget to fetch cryptocurrency prices
- Public API for real-time crypto market data

**https://api.open-meteo.com/***
- Used by Weather widget to fetch weather forecasts
- Free, open-source weather API

**https://picsum.photos/***
- Used for placeholder images in certain widgets
- Lorem Picsum public image service

### Privacy Policy
ApexGrid does not collect, store, or transmit any personal data. All user data (preferences, widget configurations, todo items, quick links) is stored locally using Chrome's Storage API and is never sent to external servers. The extension only makes API calls to third-party services when specific widgets are enabled and only to fetch publicly available data (quotes, weather, crypto prices, etc.).

## Screenshots

Recommended screenshots to include:
1. Default dashboard view with multiple widgets
2. Dark mode showcase
3. Different theme examples (Sunset, Ocean, Forest)
4. Widget gallery showing available widgets
5. Settings panel with customization options
6. Preset layouts demonstration
7. Drag-and-drop functionality
8. Mobile/responsive view

## Promotional Images

### Small Tile (440x280)
- Show ApexGrid logo with tagline
- Clean, minimal design

### Large Tile (920x680)
- Feature-rich dashboard screenshot
- Highlight key widgets and themes

### Marquee (1400x560)
- Hero image showing the extension in action
- Include key features text overlay

## Testing Checklist

Before submission:
- [ ] Build extension: `npm run build`
- [ ] Test in Chrome with unpacked extension
- [ ] Verify all widgets work correctly
- [ ] Test drag-and-drop functionality
- [ ] Test theme switching
- [ ] Test preset layouts
- [ ] Verify settings persistence
- [ ] Test on different screen sizes
- [ ] Check keyboard navigation
- [ ] Verify no console errors
- [ ] Test cross-device sync (if possible)
- [ ] Review all permissions are necessary
- [ ] Ensure no search functionality present
- [ ] Verify single purpose compliance

## Version History

### Version 1.0.0 (Initial Submission)
- Customizable widget-based new tab dashboard
- 30+ widgets including clock, calendar, todo, weather, crypto, stocks
- 12 preset layouts
- 17 themes with dark/light mode
- Drag-and-drop widget positioning
- Resizable widgets
- Custom backgrounds and patterns
- Cross-device sync via Chrome Storage
- Keyboard accessible
- Responsive design

## Support & Contact

- GitHub: [Your GitHub Repository URL]
- Email: [Your Support Email]
- Website: [Your Website URL]

## Notes for Reviewers

This extension has been specifically designed to comply with Chrome Web Store's Single Purpose Policy. The extension serves one clear purpose: replacing the new tab page with a customizable widget dashboard. 

**Previous Rejection Addressed:**
- Completely removed search bar functionality that was present in earlier version
- Extension now focuses solely on providing a widget-based dashboard
- No search functionality or search engine selection present
- All code related to search has been removed

The extension does not:
- Provide search functionality
- Modify browser settings
- Inject content into other pages
- Track user behavior
- Collect personal data

All permissions requested are essential for the core functionality of providing a customizable new tab dashboard with various information widgets.
