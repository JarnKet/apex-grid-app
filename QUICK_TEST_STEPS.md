# Quick Test Steps for Resize Persistence

## Setup (One-time)

1. **Build the extension**:
   ```bash
   npm run build
   ```

2. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `dist` folder from this project
   - You should see "ApexGrid" extension loaded

3. **Open a new tab** - You should see the ApexGrid dashboard

## Quick Test (5 minutes)

### Test 1: Immediate Refresh After Resize ⭐ CRITICAL
This is the main bug fix - resize should persist even with immediate refresh.

1. Open a new tab (ApexGrid loads)
2. Find any widget (Clock, Calendar, etc.)
3. Hover over bottom-right corner → see resize handle (↘️)
4. Drag to make widget bigger
5. **IMMEDIATELY** press `Ctrl+R` (Windows) or `Cmd+R` (Mac)
6. ✅ **PASS**: Widget stays at new size
7. ❌ **FAIL**: Widget reverts to original size

### Test 2: Drag Still Works
This verifies we didn't break drag functionality.

1. Click and hold a widget's header (the drag handle)
2. Drag it to a new position
3. Release
4. Wait 1 second (let debounce complete)
5. Refresh the page
6. ✅ **PASS**: Widget is in new position
7. ❌ **FAIL**: Widget reverted to old position

### Test 3: Multiple Resizes
Tests that rapid resizing works correctly.

1. Resize a widget (make it wider)
2. Immediately resize again (make it taller)
3. Immediately resize again (make it narrower)
4. Refresh the page
5. ✅ **PASS**: Widget has the final size from step 3
6. ❌ **FAIL**: Widget has wrong size or reverted

## What to Look For

### ✅ Success Indicators:
- Resize feels smooth and responsive
- Widget size persists after refresh
- No console errors
- Drag still works normally

### ❌ Failure Indicators:
- Widget reverts to old size after refresh
- Console shows "Failed to persist resize" errors
- Resize feels laggy or unresponsive
- Widgets overlap or have wrong positions

## Checking Console

1. Press `F12` to open DevTools
2. Go to "Console" tab
3. Look for:
   - ✅ No errors = Good
   - ⚠️ Retry messages = Retry logic working (acceptable)
   - ❌ "Failed to persist" = Problem

## Troubleshooting

**If resize doesn't persist:**
1. Check DevTools Console for errors
2. Go to DevTools → Application → Storage → Chrome Storage
3. Look for "layout" key - it should update when you resize
4. Try reloading the extension:
   - Go to `chrome://extensions/`
   - Click the refresh icon on ApexGrid
   - Open new tab and test again

**If you can't resize:**
1. Make sure you're dragging from the bottom-right corner
2. Look for the resize cursor (↘️)
3. Check that the widget isn't at maximum size

## Report Results

After testing, update the task status:
- ✅ All tests pass → Task complete
- ❌ Any test fails → Report which test failed and what happened

## Full Testing Guide

For comprehensive testing, see: `RESIZE_PERSISTENCE_TEST_GUIDE.md`
