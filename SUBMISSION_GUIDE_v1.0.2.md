# Chrome Web Store Submission Guide - Version 1.0.2

## 📦 Files Ready for Submission

### Extension Package

- **File**: `apex-grid-v1.0.2.zip` (309 KB)
- **Location**: Root directory of the project
- **Contents**: Complete built extension from `dist/` folder

### Documentation

- **CHANGELOG.md**: Complete changelog documenting all changes in version 1.0.2
- **README.md**: Project documentation
- **CHROME_STORE_POLICY_FIX.md**: Chrome policy compliance documentation
- **POLICY_COMPLIANCE_SUMMARY.md**: Policy compliance summary

---

## 🌐 API Endpoints Used in Version 1.0.2

ApexGrid uses the following external APIs to provide its widget functionality:

### Core Widget APIs

1. **Quotable.io** - Daily Quotes Widget

   - Endpoint: `https://api.quotable.io/*`
   - Purpose: Provides inspirational daily quotes
   - Data: Quote text, author information

2. **RSS2JSON** - News Feed Widget

   - Endpoint: `https://api.rss2json.com/*`
   - Purpose: Converts RSS feeds to JSON format for news display
   - Data: News articles from various RSS feeds

3. **CoinGecko** - Cryptocurrency Widget

   - Endpoint: `https://api.coingecko.com/*`
   - Purpose: Real-time cryptocurrency prices and market data
   - Data: Crypto prices, market caps, 24h changes

4. **Open-Meteo** - Weather Widget

   - Endpoint: `https://api.open-meteo.com/*`
   - Purpose: Provides weather forecasts and current conditions
   - Data: Temperature, weather conditions, forecasts

5. **Picsum Photos** - Background Images
   - Endpoint: `https://picsum.photos/*`
   - Purpose: Random beautiful background images
   - Data: High-quality images for dashboard backgrounds

### Supporting APIs

6. **IPAPI.co** - Geolocation Service

   - Endpoint: `https://ipapi.co/*`
   - Purpose: Location detection for weather widget
   - Data: City, country, coordinates

7. **GitHub API** - Version Updates (Optional)

   - Endpoint: `https://api.github.com/*`
   - Purpose: Check for extension updates
   - Data: Repository information

8. **Spotify API** - Music Widget
   - Endpoints:
     - `https://accounts.spotify.com/*` (Authentication)
     - `https://api.spotify.com/*` (Playback & data)
   - Purpose: Display currently playing music and playback controls
   - Data: Track info, playback state, user playlists

**Privacy Note**: All API calls are made directly from the extension. No user data is stored on external servers. All preferences and settings are saved locally using Chrome's storage API.

---

## 🚀 Submission Steps

### 1. Pre-Submission Checklist

- [x] Version bumped to 1.0.2 in `manifest.json`
- [x] All files built and packaged in `apex-grid-v1.0.2.zip`
- [x] Changelog created documenting all changes
- [x] Extension tested locally for functionality
- [ ] Review Chrome Web Store Developer Program Policies

### 2. Upload to Chrome Web Store

#### Login to Developer Dashboard

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Sign in with your Google account

#### Update Your Extension

1. Click on your existing **ApexGrid** extension
2. Click **"Package"** tab on the left sidebar
3. Click **"Upload new package"**
4. Select the file: `apex-grid-v1.0.2.zip`
5. Wait for upload to complete

### 3. Update Store Listing

#### Version Information

In the **"Store Listing"** tab, update:

**What's New (Version 1.0.2):**

```
🎉 New Features:
• Toast notifications for better user feedback across all widgets
• Custom RSS feed management - add your own favorite feeds!
• Improved Spotify widget with better playback controls

🐛 Bug Fixes:
• Fixed Spotify playback controls (pause, next, previous)
• Improved RSS feed loading and storage
• Enhanced error handling across all widgets

✨ Improvements:
• Better user experience with clear success/error messages
• Improved authentication flows
• More stable and reliable performance
```

#### Screenshots (if updating)

- Ensure screenshots show the new features (toast notifications, RSS custom feeds)
- Highlight the improved Spotify widget functionality

### 4. Privacy & Compliance

#### Privacy Practices

Ensure the following are clearly stated in your Chrome Web Store listing:

- **Data Collection**:

  - Location data (via ipapi.co) for weather widget personalization
  - Spotify authentication tokens for music widget (stored locally)
  - User-added custom RSS feed URLs
  - Widget preferences and settings

- **Data Usage**:

  - All data used exclusively for widget functionality
  - No data is sent to external servers except for API calls to provide services
  - No tracking or analytics of user behavior
  - No data sharing with third parties beyond necessary API calls

- **Data Storage**:

  - All user data stored locally using Chrome's storage API
  - No cloud storage or external databases used
  - Users can clear all data by removing the extension

- **Third-party Services**:
  - **Quotable.io**: Daily quotes (no personal data sent)
  - **RSS2JSON**: RSS feed conversion (feed URLs only)
  - **CoinGecko**: Cryptocurrency prices (no personal data sent)
  - **Open-Meteo**: Weather data (location coordinates only)
  - **Picsum Photos**: Background images (no personal data sent)
  - **IPAPI.co**: Location detection (IP address only)
  - **GitHub API**: Version checks (no personal data sent)
  - **Spotify API**: Music playback (requires user authentication, tokens stored locally)

#### Permissions Justification

Make sure to explain each permission:

- `storage`: Save user preferences and widget data
- `geolocation`: Provide accurate weather information
- `identity`: Spotify authentication

### 5. Submit for Review

1. Review all information one final time
2. Click **"Submit for Review"**
3. Wait for Chrome Web Store team to review (typically 1-3 business days)

---

## 📋 Key Changes in Version 1.0.2

### Added

- **Sonner Toast Notifications**: Integrated throughout the app
- **Custom RSS Feeds**: Users can add/manage custom RSS feed URLs
- **Better Feedback**: Success/error messages for all actions

### Fixed

- **Spotify Widget**: Playback controls now work correctly
- **RSS Storage**: Proper data persistence
- **Error Handling**: Better error messages and recovery

### Improved

- **UX**: More intuitive user interactions
- **Code Quality**: Better maintainability and structure
- **Performance**: Optimized loading and data handling

---

## 🔍 Testing Recommendations

### Before Submission

Test the following features:

1. **Spotify Widget**:
   - Authentication flow
   - Play/pause/next/previous controls
   - Toast notifications for errors
2. **RSS Widget**:

   - Add custom RSS feeds
   - Verify feeds are saved and persist
   - Check feed loading and display

3. **Weather Widget**:

   - Geolocation permission
   - Weather data display
   - Error handling

4. **Toast Notifications**:
   - Verify they appear for all actions
   - Check they're informative and helpful

---

## 📞 Support & Resources

### Documentation

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [Chrome Extension Best Practices](https://developer.chrome.com/docs/webstore/best_practices/)
- [Chrome Web Store Policies](https://developer.chrome.com/docs/webstore/program-policies/)

### Project Resources

- GitHub: https://github.com/JarnKet/apex-grid-app
- Issues: Report bugs or feature requests on GitHub

---

## ⚠️ Important Notes

1. **Review Time**: Chrome Web Store reviews typically take 1-3 business days
2. **Policy Compliance**: Ensure all policies are followed to avoid rejection
3. **Communication**: Respond promptly to any reviewer questions
4. **Version Number**: Make sure manifest.json shows version 1.0.2

---

**Good luck with your submission! 🚀**

If you encounter any issues during submission, refer to the Chrome Web Store documentation or reach out to Chrome Web Store support.
