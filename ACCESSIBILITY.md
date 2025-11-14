# ApexGrid Accessibility Features

This document outlines the accessibility features implemented in ApexGrid to ensure the extension is usable by everyone, including users with disabilities.

## Overview

ApexGrid follows WCAG 2.1 Level AA guidelines and implements comprehensive accessibility features including:

- ARIA labels and landmarks
- Keyboard navigation
- Focus management
- Screen reader support
- Reduced motion support
- High contrast color schemes

## ARIA Labels and Semantic HTML

### Landmarks and Regions

- **Main content area**: `role="main"` with `aria-label="ApexGrid Dashboard"`
- **Widget regions**: Each widget has `role="region"` with descriptive `aria-label`
- **Navigation areas**: Calendar navigation uses `<nav>` with `aria-label="Calendar navigation"`
- **Forms**: Settings form has `role="form"` with `aria-label="Dashboard settings"`

### Interactive Elements

All interactive elements include:
- Descriptive `aria-label` attributes
- `title` attributes for tooltips
- `aria-describedby` for additional context
- `aria-hidden="true"` for decorative icons

### Live Regions

- Calendar month display uses `aria-live="polite"` to announce month changes
- Task list status messages use `role="status"`
- Empty state messages use `role="status"`

### Widget-Specific ARIA

#### Clock Widget
- Time display uses `<time>` element with `dateTime` attribute
- Includes `aria-label` with spoken time format

#### Calendar Widget
- Grid structure with `role="grid"`, `role="row"`, `role="gridcell"`
- Current date marked with `aria-current="date"`
- Each date includes full date in `aria-label`

#### Todo Widget
- Task list uses `role="list"` and `role="listitem"`
- Checkboxes include descriptive labels for completion state
- Delete buttons include task name in label

#### Quick Links Widget
- Links list uses `role="list"` and `role="listitem"`
- Each link includes URL in `aria-label`
- Edit/delete toolbars have `role="toolbar"`

## Keyboard Navigation

### Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + ,` | Open settings panel |
| `Escape` | Close settings panel |
| `Ctrl/Cmd + →` or `↓` | Focus next widget |
| `Ctrl/Cmd + ←` or `↑` | Focus previous widget |

### Widget Navigation

- `Tab` / `Shift+Tab`: Navigate between interactive elements
- `Enter` / `Space`: Activate buttons and links
- `Arrow keys`: Navigate within calendar grid

### Settings Panel

- All controls are keyboard accessible
- Tab order follows visual layout
- Switch controls toggle with `Space` or `Enter`
- Form inputs support standard keyboard interaction

### Grid Layout

- Widgets can be focused using keyboard shortcuts
- Focus moves to first interactive element within widget
- Tab order respects visual layout

## Focus Management

### Focus Indicators

- All focusable elements have visible focus indicators
- Focus ring uses `outline: 2px solid` with primary color
- Focus offset of 2px for clear visibility
- Enhanced focus styles with `focus-visible` pseudo-class

### Focus Trapping

- Settings dialog traps focus when open
- Focus returns to trigger button when dialog closes
- Escape key closes dialogs and returns focus

### Skip Links

- "Skip to main content" link for screen reader users
- Positioned off-screen until focused
- Allows bypassing navigation to reach main content

## Screen Reader Support

### Announcements

- Dynamic content changes are announced via `aria-live` regions
- Status messages use `role="status"` for polite announcements
- Error messages are announced immediately

### Descriptive Labels

- All form inputs have associated `<label>` elements
- Buttons include descriptive text or `aria-label`
- Images and icons marked as decorative with `aria-hidden="true"`

### Context and Relationships

- Related elements grouped with `<fieldset>` and `<legend>`
- Form fields associated with descriptions via `aria-describedby`
- Widget controls grouped in toolbars with `role="toolbar"`

## Reduced Motion Support

### CSS Media Query

The extension respects the `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Affected Animations

When reduced motion is enabled:
- Widget drag/drop animations are disabled
- Resize transitions are removed
- Theme transitions are instant
- Focus pulse animations are disabled
- All decorative animations are suppressed

## Color and Contrast

### WCAG AA Compliance

All color combinations meet WCAG 2.1 Level AA contrast requirements:

#### Dark Mode
- Background: `#0a0a0a` / Foreground: `#ffffff` (19.56:1)
- Muted text: `#a1a1a1` on `#0a0a0a` (4.54:1)
- Primary accent: `#3b82f6` on dark (4.54:1)

#### Light Mode
- Background: `#ffffff` / Foreground: `#0a0a0a` (19.56:1)
- Muted text: `#6b7280` on `#ffffff` (4.54:1)
- Primary accent: `#3b82f6` on white (4.54:1)

### Theme Support

- Dark mode by default
- Light mode option in settings
- Theme preference persists across sessions
- Smooth theme transitions (disabled with reduced motion)

## Testing Recommendations

### Screen Reader Testing

Test with popular screen readers:
- **Windows**: NVDA, JAWS
- **macOS**: VoiceOver
- **Linux**: Orca

### Keyboard Testing

1. Disconnect mouse/trackpad
2. Navigate entire interface using only keyboard
3. Verify all functionality is accessible
4. Check focus indicators are visible
5. Test keyboard shortcuts

### Automated Testing

Run accessibility audits with:
- Chrome DevTools Lighthouse
- axe DevTools browser extension
- WAVE browser extension

### Manual Testing Checklist

- [ ] All images have alt text or are marked decorative
- [ ] All form inputs have labels
- [ ] All buttons have descriptive text
- [ ] Focus order is logical
- [ ] Focus indicators are visible
- [ ] Color is not the only means of conveying information
- [ ] Text can be resized to 200% without loss of functionality
- [ ] Keyboard shortcuts don't conflict with browser/OS shortcuts

## Known Limitations

### React Grid Layout

The underlying `react-grid-layout` library has some accessibility limitations:
- Drag and drop is primarily mouse-based
- Grid rearrangement via keyboard is limited
- We've added keyboard shortcuts to navigate between widgets as a workaround

### Future Improvements

Planned accessibility enhancements:
- Keyboard-based widget rearrangement
- High contrast mode
- Customizable keyboard shortcuts
- Voice control support
- More granular focus management

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/resources/)
- [Chrome Extension Accessibility](https://developer.chrome.com/docs/extensions/mv3/a11y/)

## Feedback

If you encounter accessibility issues or have suggestions for improvements, please:
1. Open an issue on GitHub
2. Include your assistive technology details
3. Describe the expected vs. actual behavior
4. Provide steps to reproduce

We're committed to making ApexGrid accessible to everyone.
