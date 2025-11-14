# Implementation Plan

- [x] 1. Initialize project structure and dependencies





  - Create Vite + React + TypeScript project configured for Chrome extension
  - Install and configure Tailwind CSS and shadcn/ui
  - Install react-grid-layout, Zustand, and date-fns dependencies
  - Create directory structure for components, stores, services, and types
  - Configure Vite build for browser extension output
  - Create manifest.json with Chrome extension configuration
  - _Requirements: 12.1, 12.2_

- [x] 2. Set up type definitions and core interfaces





  - Create widget type definitions (WidgetType, Widget, WidgetData interfaces)
  - Create layout type definitions (LayoutItem, Layout interfaces)
  - Create storage schema type definition (StorageSchema interface)
  - Define default layout configuration with initial widget positions
  - _Requirements: 1.5, 2.4, 3.4_

- [x] 3. Implement storage service layer





  - Create storage service with get, set, getAll, and clear methods
  - Implement Chrome Storage API abstraction using chrome.storage.sync
  - Add error handling for storage quota exceeded scenarios
  - Add data validation before storage operations
  - _Requirements: 1.4, 2.4, 3.4, 11.1_

- [x] 4. Create Zustand state management stores





- [x] 4.1 Implement layout store


  - Create useLayoutStore with layout state and setLayout action
  - Implement updateLayout action that persists to Chrome Storage
  - Add layout initialization from storage on app load
  - _Requirements: 1.4, 1.5, 2.4_

- [x] 4.2 Implement widget store


  - Create useWidgetStore with widgets and widgetData state
  - Implement addWidget action that creates new widget with default config
  - Implement removeWidget action that deletes widget and its data
  - Implement updateWidgetData action that persists widget-specific data
  - Add widget initialization from storage on app load
  - _Requirements: 3.2, 3.3, 3.4, 6.4, 7.5_

- [x] 4.3 Implement settings store


  - Create useSettingsStore with theme and background state
  - Implement setTheme action that persists theme preference
  - Implement setBackground action that persists background setting
  - Add settings initialization from storage on app load
  - Apply theme class to document root on theme change
  - _Requirements: 10.2, 10.3, 10.4_

- [x] 5. Build grid layout system





- [x] 5.1 Create GridLayout wrapper component


  - Wrap react-grid-layout with ApexGrid-specific configuration
  - Configure 12-column grid with 80px row height
  - Enable drag-and-drop with custom drag handle selector
  - Enable resize with southeast handle
  - Implement onLayoutChange handler that updates layout store
  - Add visual feedback for drag operations
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.5_

- [x] 5.2 Create base widget wrapper component


  - Create WidgetWrapper component with drag handle
  - Add shadcn/ui Card component for consistent widget styling
  - Implement widget header with title and remove button
  - Add error boundary for widget crash isolation
  - _Requirements: 3.3, 12.1_
- [x] 6. Implement Clock Widget




- [ ] 6. Implement Clock Widget

  - Create ClockWidget component displaying current time and date
  - Use Intl.DateTimeFormat for time and date formatting
  - Implement setInterval to update time every 60 seconds
  - Display time with minute-level precision
  - Display date with day, month, and year
  - Clean up interval on component unmount
  - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [x] 7. Implement Calendar Widget






- [x] 7.1 Create calendar grid and date display

  - Create CalendarWidget component with monthly grid view
  - Use date-fns to calculate days in month and starting day
  - Render day-of-week labels for all columns
  - Render all dates for current month in grid layout
  - Highlight current date with distinct styling
  - _Requirements: 5.1, 5.2, 5.4_

- [x] 7.2 Add calendar navigation


  - Add previous and next month navigation buttons
  - Implement month change handler that updates displayed month
  - Update calendar grid when month changes
  - Implement automatic month update when date changes
  - _Requirements: 5.3, 5.5_
-

- [x] 8. Implement Todo Widget




- [x] 8.1 Create todo list UI and state management


  - Create TodoWidget component with task list display
  - Add input field and submit button for new tasks
  - Implement task item component with checkbox and delete button
  - Display tasks in creation order
  - _Requirements: 6.1, 6.3, 6.5_

- [x] 8.2 Implement todo data persistence


  - Generate unique IDs for new tasks
  - Implement task creation that updates widget store
  - Implement checkbox toggle that updates task completion state
  - Implement task deletion that removes task from store
  - Persist all task changes to Chrome Storage via updateWidgetData
  - _Requirements: 6.2, 6.4_
-

- [x] 9. Implement Quick Links Widget




- [x] 9.1 Create quick links UI


  - Create QuickLinksWidget component with links grid display
  - Render clickable link items with title
  - Implement link click handler that opens URL in current tab
  - Add button to open add/edit link dialog
  - _Requirements: 7.2, 7.5_

- [x] 9.2 Implement link management

  - Create link dialog using shadcn/ui Dialog component
  - Add form inputs for link title and URL
  - Implement URL validation and sanitization
  - Implement add link action that creates new link
  - Implement edit link action that updates existing link
  - Implement delete link action that removes link
  - Persist all link changes to Chrome Storage via updateWidgetData
  - _Requirements: 7.1, 7.3, 7.4_
-

- [x] 10. Implement Quote Widget



- [x] 10.1 Create quote API service


  - Create quoteApi service with fetchQuote function
  - Implement fetch call to Quotable.io API
  - Parse API response and return Quote object
  - Implement retry logic with exponential backoff
  - Add error handling for network failures
  - _Requirements: 8.1, 8.5_


- [x] 10.2 Create quote widget with caching

  - Create QuoteWidget component displaying quote text and author
  - Fetch quote from API on component mount
  - Cache fetched quote with timestamp in widget data
  - Check cache age and only fetch new quote after 24 hours
  - Display cached quote immediately while fetching update
  - Display fallback quote from local constant on API failure
  - _Requirements: 8.2, 8.3, 8.4_
-

- [x] 11. Implement Currency Exchange Widget





- [x] 11.1 Create currency API service

  - Create currencyApi service with fetchExchangeRates function
  - Implement fetch call to ExchangeRate-API
  - Parse API response and extract USD, THB, LAK rates
  - Return rates object with lastUpdate timestamp
  - Implement retry logic with exponential backoff
  - Add error handling for network failures
  - _Requirements: 9.1, 9.5_


- [x] 11.2 Create currency widget with auto-refresh

  - Create CurrencyWidget component displaying exchange rates
  - Fetch rates from API on component mount
  - Cache fetched rates with timestamp in widget data
  - Display USD, THB, and LAK exchange rates
  - Display last update timestamp
  - Implement 60-minute auto-refresh using setInterval
  - Display cached rates on API failure
  - Clean up interval on component unmount
  - _Requirements: 9.2, 9.3, 9.4_
-

- [x] 12. Create Dashboard and widget rendering



- [x] 12.1 Implement widget renderer


  - Create WidgetRenderer component that maps widget type to component
  - Implement switch/case for all widget types
  - Pass widget ID and data props to widget components
  - Pass onDataChange callback to widgets for data updates
  - Wrap each widget in WidgetWrapper component
  - _Requirements: 3.5, 12.1_

- [x] 12.2 Create Dashboard container


  - Create Dashboard component as main layout container
  - Connect to layout store and widget store
  - Render GridLayout with current layout configuration
  - Map enabled widgets to WidgetRenderer components
  - Implement layout change handler that updates layout store
  - Initialize stores from Chrome Storage on mount
  - _Requirements: 1.3, 1.4, 1.5, 12.2, 12.3_
-

- [x] 13. Implement Settings Panel




- [x] 13.1 Create settings UI


  - Create SettingsPanel component using shadcn/ui Dialog
  - Add theme toggle switch for dark/light mode
  - Add background customization input (color picker or image URL)
  - Display list of available widget types
  - Add enable/disable toggle for each widget type
  - Add button to open settings panel in Dashboard
  - _Requirements: 10.1, 10.5_

- [x] 13.2 Implement settings actions


  - Connect settings panel to settings store and widget store
  - Implement theme toggle that calls setTheme action
  - Implement background change that calls setBackground action
  - Implement widget enable/disable that calls addWidget or removeWidget
  - Apply theme changes immediately to document root
  - Persist all settings changes to Chrome Storage
  - _Requirements: 10.2, 10.3, 3.2, 3.3_


- [x] 14. Create App root and initialization




  - Create App component as root component
  - Implement initial data load from Chrome Storage
  - Initialize all stores with stored data or defaults
  - Apply saved theme on app load
  - Render Dashboard component
  - Add global error boundary
  - _Requirements: 1.5, 10.4, 12.1, 12.2_
-

- [x] 15. Configure Tailwind theme and styling




  - Configure Tailwind dark mode with class strategy
  - Define dark mode color palette (background, card, text, border, accent)
  - Define light mode color palette
  - Add custom CSS for react-grid-layout styling
  - Style drag handles and resize handles
  - Add animations for widget interactions
  - Ensure WCAG AA color contrast compliance
  - _Requirements: 10.1, 10.2, 10.4_

- [x] 16. Build and package extension





  - Configure Vite build output for Chrome extension structure
  - Ensure manifest.json is copied to dist folder
  - Create extension icons in required sizes (16, 48, 128)
  - Test extension loading in Chrome
  - Verify new tab override works correctly
  - Test extension installation and first-run experience
  - _Requirements: 12.1_
-

- [x] 17. Implement performance optimizations




  - Add React.memo to widget components
  - Implement debouncing for layout change events
  - Implement throttling for resize/drag events
  - Add lazy loading for off-screen widgets
  - Optimize re-renders with proper dependency arrays
  - _Requirements: 12.1, 12.2, 12.4, 12.5_
-

- [x] 18. Add accessibility features




  - Add ARIA labels to all interactive elements
  - Implement keyboard navigation for widget management
  - Add focus indicators for all focusable elements
  - Test with screen reader
  - Add prefers-reduced-motion support
  - _Requirements: 1.1, 2.1, 3.2_

- [x] 19. Write core functionality tests





  - Write unit tests for storage service functions
  - Write unit tests for Zustand store actions
  - Write component tests for widget rendering
  - Write integration tests for widget data persistence
  - Write integration tests for layout sync
  - _Requirements: 1.4, 2.4, 3.4, 6.4, 7.5_
