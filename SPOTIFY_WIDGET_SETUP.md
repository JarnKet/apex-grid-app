# Spotify Widget Setup Guide

## ✅ Implementation Complete!

The Spotify widget now supports two modes:
1. **Embed Mode** - Simple Spotify player (no auth needed)
2. **OAuth Mode** - Shows currently playing track with playback controls

## How to Use OAuth Mode

### Step 1: Add Widget
1. Add Spotify widget to your dashboard
2. Click the settings icon (gear)

### Step 2: Configure Mode
1. Select "Currently Playing" mode
2. Enter your Spotify credentials:
   - **Client ID**: Paste your Client ID
   - **Client Secret**: Paste your Client Secret

### Step 3: Connect
1. Click "Connect Spotify"
2. You'll be redirected to Spotify login
3. Authorize the app
4. You'll be redirected back to the extension

### Step 4: Enjoy!
- See your currently playing track
- Album art display
- Play/Pause control
- Skip forward/backward
- Progress bar
- Auto-updates every 5 seconds

## Features

### OAuth Mode
- ✅ Shows currently playing track
- ✅ Album artwork
- ✅ Artist and album info
- ✅ Playback controls (play/pause/skip)
- ✅ Progress bar with time
- ✅ Auto-refresh every 5 seconds
- ✅ Token auto-refresh when expired

### Embed Mode
- ✅ Embed any Spotify content
- ✅ Playlists, albums, tracks
- ✅ Full Spotify player interface
- ✅ No authentication needed

## Permissions Added

The following permissions were added to `manifest.json`:
- `identity` - For OAuth flow
- `https://accounts.spotify.com/*` - Spotify auth
- `https://api.spotify.com/*` - Spotify API

## API Scopes

The widget requests these Spotify scopes:
- `user-read-currently-playing` - See what's playing
- `user-read-playback-state` - Get playback state
- `user-modify-playback-state` - Control playback
- `user-read-recently-played` - Show history
- `playlist-read-private` - Access private playlists
- `playlist-read-collaborative` - Access collaborative playlists

## Troubleshooting

### "Authentication failed"
- Check Client ID and Secret are correct
- Verify redirect URI in Spotify Dashboard matches: `https://<extension-id>.chromiumapp.org/`

### "No Track Playing"
- Make sure Spotify is open and playing music
- Check that you're logged into the same Spotify account

### "Failed to fetch current track"
- Token might be expired - widget will auto-refresh
- Check internet connection
- Verify Spotify API is accessible

## Security Notes

- Client Secret is stored locally in Chrome Storage
- Never share your Client Secret
- Tokens are automatically refreshed
- All communication is over HTTPS

## Switching Modes

You can switch between modes anytime:
1. Open widget settings
2. Select "Embed Player" or "Currently Playing"
3. Configure accordingly
4. Save

## Version

- **Added in**: v1.0.2
- **Status**: Fully functional
- **Tested**: ✅ OAuth flow, playback controls, token refresh

---

**Enjoy your Spotify integration!** 🎵
