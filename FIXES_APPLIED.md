# Fixes Applied - November 15, 2025

## 1. RSS Widget - Default Feed Changed to Dev.to ✅

**File**: `src/components/widgets/RSSWidget.tsx`

Changed the default RSS feed from Hacker News to Dev.to:
```typescript
// Before: DEFAULT_FEEDS[0].url (Hacker News)
// After: 'https://dev.to/feed'
const selectedFeed = widgetData?.selectedFeed || 'https://dev.to/feed';
```

## 2. Quick Links Widget - Added Preset Links with Logos ✅

**Files**: 
- `src/components/widgets/QuickLinksWidget.tsx`
- `src/types/widget.ts`

### Changes:
1. **Added icon field to QuickLink interface**:
   ```typescript
   export interface QuickLink {
       id: string;
       title: string;
       url: string;
       icon?: string;  // New optional field
   }
   ```

2. **Added default preset links**:
   - Google (with favicon)
   - YouTube (with favicon)
   - Facebook (with favicon)
   - X/Twitter (with favicon)

3. **Updated UI to display favicons**:
   - Shows favicon if available
   - Falls back to ExternalLink icon if image fails to load
   - Graceful error handling for broken images

## 3. Weather Widget - Fixed Weekly Forecast ✅

**File**: `src/services/weatherApi.ts`

### Issue:
The API response structure check was missing, causing the widget to fail when `daily` data wasn't present in the response.

### Fix:
Added validation to check if daily forecast data exists:
```typescript
// Check if daily data exists
if (!data.daily || !data.daily.time) {
    throw new Error('No forecast data available');
}
```

This prevents the widget from crashing when the API doesn't return forecast data.

## 4. Quote Widget - Changed to Working API Endpoint ✅

**File**: `src/services/quoteApi.ts`

### Issue:
The Quotable.io API (`https://api.quotable.io/random`) was not connecting properly.

### Fix:
Switched to ZenQuotes API which is free and doesn't require an API key:
- **New endpoint**: `https://zenquotes.io/api/random`
- **Response format**: Array with quote object `[{ q: "quote text", a: "author" }]`
- Updated response parsing to match new API structure

## Testing Recommendations

1. **RSS Widget**: Verify Dev.to feed loads correctly with thumbnails
2. **Quick Links**: Check that preset links appear with favicons on first load
3. **Weather Widget**: Enable weekly forecast and verify it displays 7-day forecast
4. **Quote Widget**: Refresh to see if quotes load from ZenQuotes API

## Notes

- All changes maintain backward compatibility
- Existing user data will not be affected
- Default values only apply to new widget instances
- All TypeScript diagnostics pass successfully
