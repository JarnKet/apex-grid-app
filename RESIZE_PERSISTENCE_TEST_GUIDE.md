# Resize Persistence Testing Guide

## Overview
This guide provides step-by-step instructions for manually testing the widget resize persistence fix implemented in ApexGrid. The fix ensures that widget resize operations are persisted immediately (without debouncing) to prevent data loss during page refreshes.

## Implementation Summary

### What Was Fixed
- **Problem**: Widget resize changes were lost if the page was refreshed during the 500ms debounce period
- **Solution**: 
  - Resize operations now persist immediately (no debounce)
  - Drag operations continue to use 500ms debounce
  - Added `isResizingRef` to differentiate between resize and drag operations
  - Implemented retry logic with exponential backoff (100ms, 200ms, 400ms)

### Key Components
- `src/components/GridLayout.tsx` - Handles resize/drag events
- `src/services/storage.ts` - Provides retry logic for storage operations

## Prerequisites

1. Build the extension:
   ```bash
   npm run build
   ```

2. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

3. Open a new tab to see ApexGrid dashboard

## Test Cases

### Test Case 1: Basic Resize Persistence
**Objective**: Verify that a single widget resize persists after immediate refresh

**Steps**:
1. Open a new tab (ApexGrid dashboard loads)
2. Identify a widget (e.g., Clock widget)
3. Note the current size of the widget
4. Hover over the bottom-right corner of the widget until you see the resize handle
5. Click and drag the resize handle to make the widget larger (e.g., double the width)
6. Release the mouse button (resize operation completes)
7. **Immediately** press `Ctrl+R` (or `Cmd+R` on Mac) to refresh the page
8. Wait for the page to reload

**Expected Result**:
✅ The widget should maintain its new, larger size after the refresh
✅ The widget should NOT revert to its original size

**Actual Result**: _[Fill in during testing]_

---

### Test Case 2: Multiple Rapid Resizes
**Objective**: Test that multiple consecutive resize operations all persist correctly

**Steps**:
1. Open a new tab (ApexGrid dashboard loads)
2. Select a widget to resize
3. Resize the widget to a larger size (e.g., increase width by 2 columns)
4. Immediately resize the same widget again (e.g., increase height by 1 row)
5. Immediately resize once more (e.g., decrease width by 1 column)
6. Wait 2 seconds (to ensure all operations complete)
7. Refresh the page (`Ctrl+R` or `Cmd+R`)

**Expected Result**:
✅ The widget should reflect the final size from the last resize operation
✅ No intermediate sizes should be visible
✅ The widget should maintain its position

**Actual Result**: _[Fill in during testing]_

---

### Test Case 3: Resize During Debounce Period (Critical Test)
**Objective**: Verify that resize changes persist even when refresh happens during the theoretical debounce window

**Steps**:
1. Open a new tab (ApexGrid dashboard loads)
2. Select a widget to resize
3. Resize the widget (e.g., make it wider)
4. **Within 500ms** of releasing the resize handle, refresh the page
   - Tip: Count "one-Mississippi" and refresh before finishing
   - Or use a stopwatch to time it precisely

**Expected Result**:
✅ The widget should maintain its new size after refresh
✅ The resize should NOT be lost despite the quick refresh
✅ This demonstrates that resize operations bypass the debounce

**Actual Result**: _[Fill in during testing]_

---

### Test Case 4: Drag Operations Still Use Debouncing
**Objective**: Verify that drag operations continue to work with debouncing (not affected by resize fix)

**Steps**:
1. Open a new tab (ApexGrid dashboard loads)
2. Select a widget to move
3. Click and hold the widget's drag handle (usually the header area)
4. Drag the widget to a new position
5. Release the mouse button
6. **Within 500ms** of releasing, refresh the page
   - This tests that drag still uses debounce

**Expected Result**:
⚠️ The widget position change MAY be lost if refresh happens within 500ms
✅ This is expected behavior - drag operations intentionally use debounce
✅ If you wait >500ms before refreshing, the position should persist

**Actual Result**: _[Fill in during testing]_

---

### Test Case 5: Resize Multiple Widgets
**Objective**: Test that resizing multiple different widgets all persist correctly

**Steps**:
1. Open a new tab (ApexGrid dashboard loads)
2. Resize Widget A (e.g., Clock widget) - make it larger
3. Wait 1 second
4. Resize Widget B (e.g., Calendar widget) - make it smaller
5. Wait 1 second
6. Resize Widget C (e.g., Todo widget) - change both width and height
7. Refresh the page

**Expected Result**:
✅ All three widgets should maintain their new sizes
✅ No widgets should revert to original sizes
✅ Widget positions should remain correct (no overlaps)

**Actual Result**: _[Fill in during testing]_

---

### Test Case 6: Resize with Storage Retry Logic
**Objective**: Verify that the retry mechanism works (difficult to test without simulating failures)

**Steps**:
1. Open Chrome DevTools (`F12`)
2. Go to Console tab
3. Resize a widget
4. Check the console for any error messages
5. Refresh the page
6. Verify the resize persisted

**Expected Result**:
✅ No error messages in console (under normal conditions)
✅ If errors occur, they should show retry attempts
✅ Widget size should persist even if retries were needed

**Actual Result**: _[Fill in during testing]_

---

### Test Case 7: Resize and Drag Combined
**Objective**: Test that resize and drag operations work correctly together

**Steps**:
1. Open a new tab (ApexGrid dashboard loads)
2. Resize a widget (make it larger)
3. Wait 1 second
4. Drag the same widget to a new position
5. Wait 1 second (allow debounce to complete)
6. Resize the widget again (make it smaller)
7. Refresh the page immediately

**Expected Result**:
✅ The widget should be in the dragged position
✅ The widget should have the final resized dimensions
✅ Both operations should persist correctly

**Actual Result**: _[Fill in during testing]_

---

### Test Case 8: Extreme Rapid Resize
**Objective**: Stress test the immediate persistence with very rapid resizing

**Steps**:
1. Open a new tab (ApexGrid dashboard loads)
2. Resize a widget very quickly (drag, release, drag, release) 5-10 times in rapid succession
3. Wait 2 seconds for all operations to complete
4. Note the final size
5. Refresh the page

**Expected Result**:
✅ The widget should maintain the final size
✅ No intermediate sizes should appear
✅ No console errors should occur

**Actual Result**: _[Fill in during testing]_

---

## Browser Console Monitoring

During all tests, monitor the browser console for:

1. **Success Messages**: Look for successful storage operations
2. **Error Messages**: Check for any "Failed to persist resize" errors
3. **Retry Attempts**: If storage fails, you should see retry logs
4. **Storage Quota**: Ensure no quota exceeded errors

## Performance Checks

While testing, observe:

1. **Responsiveness**: Resize operations should feel smooth and immediate
2. **No Lag**: There should be no noticeable delay when resizing
3. **No Flickering**: Widgets should not flicker or jump during resize
4. **Smooth Transitions**: Size changes should be smooth

## Troubleshooting

### If Resize Doesn't Persist:

1. Check browser console for errors
2. Verify Chrome Storage API is working:
   - Open DevTools → Application → Storage → Chrome Storage
   - Check if 'layout' key exists and updates
3. Ensure extension has storage permissions
4. Try clearing storage and testing again

### If Drag Doesn't Work:

1. Verify you're clicking the drag handle (widget header)
2. Check that drag handle has class `widget-drag-handle`
3. Ensure no JavaScript errors in console

## Requirements Coverage

This testing plan covers the following requirements:

- **Requirement 1.1**: Widget dimensions update immediately in layout state
- **Requirement 1.2**: Layout persists to Chrome Storage within 500ms (actually immediate for resize)
- **Requirement 1.3**: Widgets restore to saved sizes after refresh
- **Requirement 1.4**: Layout changes not lost during debounce period
- **Requirement 1.5**: Storage retry logic with exponential backoff

## Test Results Summary

| Test Case | Status | Notes |
|-----------|--------|-------|
| 1. Basic Resize Persistence | ⬜ Not Tested | |
| 2. Multiple Rapid Resizes | ⬜ Not Tested | |
| 3. Resize During Debounce | ⬜ Not Tested | |
| 4. Drag Still Uses Debounce | ⬜ Not Tested | |
| 5. Resize Multiple Widgets | ⬜ Not Tested | |
| 6. Storage Retry Logic | ⬜ Not Tested | |
| 7. Resize and Drag Combined | ⬜ Not Tested | |
| 8. Extreme Rapid Resize | ⬜ Not Tested | |

**Legend**: ✅ Pass | ❌ Fail | ⚠️ Partial | ⬜ Not Tested

## Sign-off

**Tester Name**: _________________

**Date**: _________________

**Overall Result**: ⬜ Pass | ⬜ Fail | ⬜ Needs Fixes

**Additional Notes**:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
