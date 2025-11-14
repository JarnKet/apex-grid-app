# Reduced Motion Testing Guide

This guide explains how to test the reduced motion support implementation in ApexGrid.

## What is Reduced Motion?

The `prefers-reduced-motion` CSS media feature detects if the user has requested that the system minimize the amount of non-essential motion it uses. This is important for users with vestibular disorders or motion sensitivity.

## How to Enable Reduced Motion

### Windows

1. **Windows 10/11:**
   - Open Settings → Ease of Access → Display
   - Turn ON "Show animations in Windows"
   - OR: Settings → Accessibility → Visual effects → Animation effects (turn OFF)

### macOS

1. Open System Preferences → Accessibility → Display
2. Check "Reduce motion"

### Linux

1. Depends on desktop environment
2. GNOME: Settings → Universal Access → Reduce Animation
3. KDE: System Settings → Workspace Behavior → General Behavior → Animation speed (set to "Instant")

### Browser DevTools (Chrome/Edge)

1. Open DevTools (F12)
2. Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
3. Type "Show Rendering"
4. In the Rendering panel, find "Emulate CSS media feature prefers-reduced-motion"
5. Select "prefers-reduced-motion: reduce"

### Browser DevTools (Firefox)

1. Open DevTools (F12)
2. Go to Settings (gear icon)
3. Under "Advanced settings", check "Enable accessibility features"
4. In the Inspector, click the "Accessibility" tab
5. Check "Simulate: prefers-reduced-motion"

## What to Test

### 1. Widget Animations

**Without Reduced Motion:**
- Widgets fade in when the dashboard loads
- Widgets scale up slightly on hover
- Smooth transitions when dragging/resizing

**With Reduced Motion:**
- Widgets appear instantly (no fade-in)
- No scale effect on hover
- No transform effects during drag/resize

### 2. Greeting and Search Bar

**Without Reduced Motion:**
- Greeting slides in from top with fade
- Search bar slides in with slight delay
- Smooth animation on appearance

**With Reduced Motion:**
- Both appear instantly
- No slide-in animation
- No fade effect

### 3. Widget Hover Effects

**Without Reduced Motion:**
- Widget lifts up (translateY)
- Widget scales slightly
- Border glow animates smoothly
- Smooth transition (300ms)

**With Reduced Motion:**
- No transform effects
- Border color changes instantly
- No lift or scale effect

### 4. Gradient Transitions

**Without Reduced Motion:**
- Background gradient transitions smoothly (1000ms)
- Time-based gradients fade between periods

**With Reduced Motion:**
- Gradient changes instantly
- No smooth transition

### 5. Grid Layout Interactions

**Without Reduced Motion:**
- Smooth transitions when widgets move (200ms)
- Resize handles fade in on hover
- Placeholder pulses during drag

**With Reduced Motion:**
- Widgets snap to position instantly
- No transition effects
- No pulse animation

### 6. Focus Indicators

**Without Reduced Motion:**
- Focus ring pulses gently
- Smooth fade animation

**With Reduced Motion:**
- Focus ring appears instantly
- No pulse animation

## Testing Checklist

- [ ] Enable reduced motion in browser DevTools
- [ ] Refresh the ApexGrid dashboard
- [ ] Verify widgets appear instantly (no fade-in)
- [ ] Hover over widgets - verify no transform/scale effects
- [ ] Drag a widget - verify no smooth transitions
- [ ] Resize a widget - verify instant size changes
- [ ] Check greeting and search bar - verify instant appearance
- [ ] Wait for time period change - verify instant gradient change
- [ ] Tab through widgets - verify focus ring has no pulse
- [ ] Disable reduced motion and verify animations return

## Expected Behavior

When `prefers-reduced-motion: reduce` is active:

1. **All animations are disabled or reduced to 0.01ms**
2. **All transitions are disabled or reduced to 0.01ms**
3. **Transform effects are removed**
4. **Scroll behavior is set to auto (no smooth scrolling)**
5. **The interface remains fully functional**
6. **No visual information is lost**

## Implementation Details

The reduced motion support is implemented in `src/index.css` using:

```css
@media (prefers-reduced-motion: reduce) {
  /* Global animation/transition disable */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Specific component overrides */
  .widget-glass-hover:hover {
    transform: none !important;
  }

  .animate-fade-in,
  .animate-slide-in-from-top {
    animation: none !important;
  }

  /* ... and more */
}
```

## Accessibility Compliance

This implementation follows:
- **WCAG 2.1 Success Criterion 2.3.3** (Animation from Interactions - Level AAA)
- **WCAG 2.2 Success Criterion 2.2.2** (Pause, Stop, Hide - Level A)
- **CSS Media Queries Level 5** specification for `prefers-reduced-motion`

## Automated Tests

Run the automated tests to verify the CSS rules:

```bash
npm run test src/test/reducedMotion.test.ts
```

These tests verify that:
- Animation durations are set to 0.01ms
- Transitions are disabled
- Transform effects are removed
- All critical CSS rules are present

## Notes

- Reduced motion does NOT mean "no motion" - it means "reduced non-essential motion"
- Essential animations (like loading spinners) may still be shown
- The interface should remain fully functional with reduced motion
- Users should not lose any information or functionality
