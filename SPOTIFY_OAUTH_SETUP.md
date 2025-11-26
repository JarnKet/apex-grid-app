# Spotify OAuth Setup for Chrome Extension

## Getting Your Extension ID

### Method 1: From Installed Extension (Development)
1. Go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Find your extension "ApexGrid"
4. Copy the **ID** (long string like: `abcdefghijklmnopqrstuvwxyz123456`)

### Method 2: From Chrome Web Store (After Publishing)
1. After publishing, your extension will have a permanent ID
2. The URL will be: `https://chrome.google.com/webstore/detail/<extension-id>`

## Redirect URI Configuration

### For Development/Testing
**Redirect URI:**
```
https://<your-extension-id>.chromiumapp.org/
```

**Example:**
```
https://abcdefghijklmnopqrstuvwxyz123456.chromiumapp.org/
```

### For Production (After Publishing)
Use the same format with your published extension ID.

## Spotify Developer Dashboard Setup

1. **Go to Spotify Developer Dashboard**
   - Visit: https://developer.spotify.com/dashboard
   - Log in with your Spotify account

2. **Create an App**
   - Click "Create app"
   - Fill in details:
     - **App name**: ApexGrid
     - **App description**: Chrome extension for customizable dashboard
     - **Website**: Your extension's website or GitHub repo
     - **Redirect URIs**: `https://<extension-id>.chromiumapp.org/`

3. **Get Credentials**
   - After creating, you'll get:
     - **Client ID**: Copy this
     - **Client Secret**: Copy this (keep it secret!)

4. **Configure Settings**
   - Add redirect URI
   - Save changes

## Implementation Options

### Option 1: OAuth with chrome.identity API (Recommended)
Use Chrome's built-in identity API for OAuth flow.

**Pros:**
- Secure, no client secret needed in extension
- Built-in token management
- Better user experience

**Cons:**
- More complex implementation
- Requires manifest changes

### Option 2: Simple Embed (Current Implementation)
Just embed Spotify players without authentication.

**Pros:**
- Simple, no OAuth needed
- Works immediately
- No API limits

**Cons:**
- Limited functionality
- Can't access user's playlists
- Can't control playback

### Option 3: User Provides Access Token
Let users generate their own access token from Spotify.

**Pros:**
- Simple implementation
- No OAuth flow needed
- Full API access

**Cons:**
- Poor user experience
- Tokens expire (need refresh)
- Users must manually get token

## Recommended Approach for ApexGrid

**For v1.0.2 (Current):**
Keep the simple embed approach - it works well for most users.

**For Future Version:**
Implement OAuth with chrome.identity API for advanced features:
- Show user's currently playing track
- Display user's playlists
- Control playback
- Show listening history

## Required Manifest Changes for OAuth

If implementing OAuth, add to `manifest.json`:

```json
{
  "permissions": [
    "identity"
  ],
  "oauth2": {
    "client_id": "YOUR_SPOTIFY_CLIENT_ID.apps.googleusercontent.com",
    "scopes": [
      "user-read-currently-playing",
      "user-read-playback-state",
      "user-modify-playback-state"
    ]
  }
}
```

## Spotify API Scopes Needed

For full functionality:
- `user-read-currently-playing` - See what's playing
- `user-read-playback-state` - Get playback state
- `user-modify-playback-state` - Control playback
- `user-read-recently-played` - Show history
- `playlist-read-private` - Access private playlists
- `playlist-read-collaborative` - Access collaborative playlists

## Testing OAuth Flow

1. **Get Extension ID** from `chrome://extensions/`
2. **Add Redirect URI** in Spotify Dashboard
3. **Test OAuth Flow**:
   ```javascript
   chrome.identity.launchWebAuthFlow({
     url: `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}`,
     interactive: true
   }, (redirectUrl) => {
     // Extract access token from redirectUrl
     const token = new URL(redirectUrl).hash.match(/access_token=([^&]*)/)[1];
   });
   ```

## Current Status

**ApexGrid v1.0.2:**
- ✅ Spotify embed widget (no OAuth)
- ❌ OAuth not implemented yet
- ❌ No API integration

**To Add OAuth:**
1. Get extension ID after publishing
2. Register app in Spotify Dashboard
3. Add redirect URI
4. Implement OAuth flow
5. Update manifest.json
6. Release as v1.1.0

## Quick Answer

**For Spotify Developer Dashboard, use:**
```
https://<your-extension-id>.chromiumapp.org/
```

**To get your extension ID:**
1. Load extension in Chrome
2. Go to `chrome://extensions/`
3. Copy the ID under your extension name

**Note:** The ID changes between development and production, so you'll need to update the redirect URI after publishing to Chrome Web Store.
