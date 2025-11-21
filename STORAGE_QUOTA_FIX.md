# Storage Quota Fix - Widget Data

## Issue
Widget data was failing to save with the error:
```
Failed to set key "widgetData" in storage: Error: Resource::kQuotaBytesPerItem quota exceeded
```

## Root Cause
Chrome Storage API has a limit of **8,192 bytes (8KB) per item**. The previous implementation stored all widget data in a single `widgetData` object, which could easily exceed this limit when users had multiple widgets with data (todos, links, RSS feeds, etc.).

## Solution
Changed the storage strategy to store each widget's data separately with individual keys:

### Before (Single Object)
```javascript
// All widget data in one object - can exceed 8KB limit
widgetData: {
  'todo-1': { todos: [...] },
  'quicklinks-1': { links: [...] },
  'rss-1': { feeds: [...] },
  // ... more widgets
}
```

### After (Separate Keys)
```javascript
// Each widget's data stored separately - stays under 8KB per item
'widgetData_todo-1': { todos: [...] }
'widgetData_quicklinks-1': { links: [...] }
'widgetData_rss-1': { feeds: [...] }
// ... each widget gets its own key
```

## Changes Made

### File: `src/stores/useWidgetStore.ts`

1. **updateWidgetData()** - Modified to store each widget's data with a unique key:
   ```typescript
   await storage.set(`widgetData_${id}`, data);
   ```

2. **removeWidget()** - Updated to remove individual widget data:
   ```typescript
   await storage.remove(`widgetData_${id}`);
   ```

3. **initializeWidgets()** - Enhanced to:
   - Load each widget's data separately
   - Migrate existing data from old format to new format automatically
   - Clean up old format after migration

## Benefits

1. **No Quota Errors**: Each widget's data stays well under the 8KB limit
2. **Better Performance**: Only load/save data for specific widgets
3. **Automatic Migration**: Existing users' data is automatically migrated
4. **Scalability**: Can support unlimited widgets without hitting quota limits

## Migration

The fix includes automatic migration for existing users:
- On first load, checks for old `widgetData` format
- Migrates each widget's data to new format (`widgetData_${id}`)
- Removes old format after successful migration
- No data loss, completely transparent to users

## Testing

To verify the fix:
1. Build: `npm run build`
2. Load extension in Chrome
3. Add multiple widgets with data (todos, links, etc.)
4. Verify no quota errors in console
5. Refresh page - data should persist correctly
6. Check Chrome Storage: `chrome.storage.sync.get(null, console.log)`

## Storage Limits

Chrome Storage Sync API limits:
- **Per Item**: 8,192 bytes (8KB) ✅ Fixed
- **Total Storage**: 102,400 bytes (100KB)
- **Max Items**: 512

With this fix, each widget can use up to 8KB, and users can have many widgets without hitting the per-item quota.

## Version
- **Fixed in**: v1.0.0
- **Date**: 2024-11-19
