# Changelog

All notable changes to ApexGrid will be documented in this file.

## [1.0.2] - 2025-11-27

### Added

- **Toast Notifications**: Integrated Sonner toast notifications across all widgets for better user feedback
  - Success and error messages for all user actions
  - Authentication status notifications
  - Data loading and error state notifications
- **RSS Widget Custom Feeds**: Users can now add and manage custom RSS feed URLs
  - Persistent storage of custom feeds using Chrome storage API
  - Easy-to-use interface for adding new feeds
  - Validation for RSS feed URLs
- **Improved User Feedback**: Enhanced feedback mechanisms across all widgets
  - Clear success/error messages for API calls
  - Loading states for asynchronous operations
  - Better error handling and user guidance

### Fixed

- **Spotify Widget Playback Controls**: Resolved issues with pause, next, and previous buttons in "currently playing" mode
  - Fixed playback control functionality
  - Improved authentication flow with toast notifications
  - Better error handling for Spotify API calls
- **RSS Feed Management**: Fixed RSS feed loading and storage mechanisms
  - Proper data persistence using Chrome storage
  - Improved feed parsing and display
- **Weather Widget**: Enhanced error handling and user notifications
- **General Stability**: Various bug fixes and performance improvements

### Improved

- **Chrome Web Store Compliance**: Updated extension to meet all Chrome Web Store policies
  - Proper permissions declarations
  - Clear user consent for data access
  - Transparent privacy practices
- **User Experience**: Overall UX improvements across all widgets
  - More intuitive interactions
  - Better visual feedback
  - Smoother animations and transitions
- **Code Quality**: Refactored components for better maintainability
  - Improved error handling
  - Better TypeScript types
  - More consistent code structure

## [1.0.1] - Previous Version

### Initial Features

- Beautiful customizable dashboard for Chrome new tab
- Weather widget with location-based forecasts
- Spotify integration for music control
- RSS feed reader
- Crypto price tracker
- Quote of the day
- ToDo list
- Clock and date display
- Customizable backgrounds
- Multi-language support

---

_For more information, visit our [GitHub repository](https://github.com/JarnKet/apex-grid-app)_
