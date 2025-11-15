# Search Bar Redesign

## Overview

The search bar has been redesigned to be more minimal and functional by:
1. **Integrating the greeting** into the search bar placeholder
2. **Adding an inline search engine selector** for quick switching

## Changes Made

### 1. Greeting Integration
- Removed the separate `Greeting` component from the dashboard
- Greeting message now appears in the search bar placeholder
- Format: `"Good morning, [Name]! What would you like to search?"`
- Updates automatically based on time of day
- Personalizes with user's name if set

### 2. Search Engine Selector
- **Inline dropdown** on the left side of the search bar
- Shows current engine icon and name
- Click to reveal dropdown menu with all available engines
- Visual indicator (✓) shows selected engine
- Instantly switches engine without opening settings

### 3. Visual Improvements
- **More compact layout** - Removed large greeting text
- **Better use of space** - Search bar is now the focal point
- **Intuitive UX** - Engine selector works like modern AI chat interfaces
- **Smooth animations** - Dropdown fades in/slides down
- **Click-outside to close** - Menu closes when clicking elsewhere

## Features

### Search Engine Selector
- **Position**: Left side of search bar
- **Display**: Icon + Name (name hidden on mobile)
- **Engines**: Google, Bing, DuckDuckGo, Yahoo
- **Icons**: Emoji icons for visual recognition
- **Dropdown**: Appears below button with smooth animation

### Placeholder Text
- **Dynamic greeting** based on time:
  - Morning (5 AM - 11 AM): "Good morning"
  - Afternoon (12 PM - 4 PM): "Good afternoon"
  - Evening (5 PM - 8 PM): "Good evening"
  - Night (9 PM - 4 AM): "Good night"
- **Personalization**: Includes user's name if configured
- **Call to action**: "What would you like to search?"

### Responsive Design
- **Desktop**: Shows full engine name + icon
- **Mobile**: Shows icon only to save space
- **Touch-friendly**: Larger tap targets for mobile

## User Benefits

1. **Less Visual Clutter** - One component instead of two
2. **Faster Engine Switching** - No need to open settings
3. **Better Context** - Greeting provides time awareness
4. **More Screen Space** - More room for widgets
5. **Modern UX** - Familiar pattern from AI chat interfaces

## Technical Details

### State Management
- Uses `useSettingsStore` for engine preference
- Persists engine selection to Chrome Storage
- Updates immediately on selection

### Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- Focus management for dropdown
- Semantic HTML structure

### Performance
- Greeting updates every 60 seconds
- Click-outside detection with cleanup
- Minimal re-renders with proper hooks

## Files Modified

- `src/components/SearchBar.tsx` - Complete redesign
- `src/components/Dashboard.tsx` - Removed Greeting component
- `src/components/Greeting.tsx` - No longer used (can be deleted)

## Future Enhancements

Potential improvements:
- Add keyboard shortcuts (e.g., Ctrl+K to focus)
- Add search suggestions/autocomplete
- Add recent searches history
- Add more search engines (Brave, Ecosia, etc.)
- Add custom search engine support
