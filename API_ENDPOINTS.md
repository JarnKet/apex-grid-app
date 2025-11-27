# API Endpoints Documentation - ApexGrid v1.0.2

This document provides a comprehensive overview of all external API endpoints used by ApexGrid Chrome Extension.

## 📊 Overview

ApexGrid uses 8 different API services to provide rich widget functionality without storing user data on external servers. All API calls are made directly from the extension, and user preferences are stored locally using Chrome's storage API.

---

## 🎯 Core Widget APIs

### 1. Quotable.io - Daily Quotes Widget

**Endpoint:** `https://api.quotable.io/*`

**Purpose:** Provides inspirational and motivational daily quotes

**Data Retrieved:**

- Quote text
- Author name
- Quote tags/categories

**Personal Data Sent:** None

**Documentation:** [quotable.io](https://github.com/lukePeavey/quotable)

---

### 2. RSS2JSON - News Feed Widget

**Endpoint:** `https://api.rss2json.com/*`

**Purpose:** Converts RSS/Atom feeds to JSON format for easy consumption

**Data Retrieved:**

- News article titles
- Article descriptions
- Publication dates
- Article links
- Featured images

**Personal Data Sent:** RSS feed URLs only (user-configured or defaults)

**Documentation:** [rss2json.com](https://rss2json.com/)

---

### 3. CoinGecko - Cryptocurrency Widget

**Endpoint:** `https://api.coingecko.com/*`

**Purpose:** Real-time cryptocurrency market data

**Data Retrieved:**

- Cryptocurrency prices
- Market capitalization
- 24-hour price changes
- Trading volumes
- Price charts

**Personal Data Sent:** None

**Documentation:** [CoinGecko API](https://www.coingecko.com/en/api)

---

### 4. Open-Meteo - Weather Widget

**Endpoint:** `https://api.open-meteo.com/*`

**Purpose:** Weather forecasts and current conditions

**Data Retrieved:**

- Current temperature
- Weather conditions (sunny, cloudy, rainy, etc.)
- Humidity levels
- Wind speed and direction
- 7-day forecast

**Personal Data Sent:** Geographic coordinates (latitude/longitude) only

**Documentation:** [Open-Meteo](https://open-meteo.com/)

---

### 5. Picsum Photos - Background Images

**Endpoint:** `https://picsum.photos/*`

**Purpose:** High-quality random background images for the dashboard

**Data Retrieved:**

- Random curated photographs
- Image metadata (photographer name, original source)

**Personal Data Sent:** None

**Documentation:** [Lorem Picsum](https://picsum.photos/)

---

## 🔧 Supporting APIs

### 6. IPAPI.co - Geolocation Service

**Endpoint:** `https://ipapi.co/*`

**Purpose:** Automatic location detection for weather widget

**Data Retrieved:**

- City name
- Country
- Geographic coordinates (latitude/longitude)
- Timezone

**Personal Data Sent:** User's IP address (automatically sent with HTTP request)

**Documentation:** [ipapi.co](https://ipapi.co/)

**Privacy Note:** Only used for initial location detection. Users can change location manually.

---

### 7. GitHub API - Version Updates

**Endpoint:** `https://api.github.com/*`

**Purpose:** Check for extension updates and version information

**Data Retrieved:**

- Latest release version
- Release notes
- Update availability

**Personal Data Sent:** None

**Documentation:** [GitHub REST API](https://docs.github.com/en/rest)

---

### 8. Spotify API - Music Widget

**Endpoints:**

- `https://accounts.spotify.com/*` (Authentication)
- `https://api.spotify.com/*` (Music Data & Playback)

**Purpose:** Display currently playing music and provide playback controls

**Data Retrieved:**

- Currently playing track information
- Track metadata (artist, album, duration)
- Playback state (playing/paused)
- User playlists (optional)
- Album artwork

**Personal Data Sent:**

- OAuth authentication tokens (stored locally in Chrome storage)
- Playback control commands

**Documentation:** [Spotify Web API](https://developer.spotify.com/documentation/web-api)

**Authentication:** Uses OAuth 2.0 authentication flow. Tokens are stored securely in Chrome's local storage and never sent to external servers.

---

## 🔒 Privacy & Security

### Data Collection Principles

1. **Minimal Data Collection**

   - Only collect data necessary for widget functionality
   - No tracking or analytics of user behavior
   - No user profiling or data mining

2. **Local Storage Only**

   - All user preferences stored in Chrome's local storage API
   - No cloud backup or external database
   - Data cleared when extension is uninstalled

3. **No Data Sharing**

   - No data sold or shared with third parties
   - API calls made directly from extension to service providers
   - No intermediary servers or data collection points

4. **Transparency**
   - All API endpoints clearly documented
   - Users can inspect network traffic
   - Open-source codebase (optional disclosure)

### Security Measures

1. **HTTPS Only**

   - All API calls made over secure HTTPS connections
   - No unencrypted data transmission

2. **Token Security**

   - OAuth tokens stored securely in Chrome storage
   - Tokens never exposed in logs or error messages
   - Automatic token refresh when expired

3. **Content Security Policy**
   - Strict CSP implemented in manifest.json
   - No inline scripts or unsafe evaluations
   - Limited external script sources

---

## 📝 Host Permissions Justification

The following host permissions are declared in `manifest.json`:

```json
"host_permissions": [
  "https://api.quotable.io/*",       // Daily quotes
  "https://api.rss2json.com/*",      // News feeds
  "https://api.coingecko.com/*",     // Crypto prices
  "https://api.open-meteo.com/*",    // Weather data
  "https://picsum.photos/*",         // Background images
  "https://ipapi.co/*",              // Geolocation
  "https://api.github.com/*",        // Version checks
  "https://accounts.spotify.com/*",  // Spotify auth
  "https://api.spotify.com/*"        // Spotify data
]
```

Each permission is essential for the corresponding widget functionality and follows the principle of least privilege.

---

## 🔄 API Usage Patterns

### Rate Limiting

- **Quotable.io**: 1 request per day (cached for 24 hours)
- **RSS2JSON**: 1 request per hour per feed
- **CoinGecko**: 1 request per minute (free tier limits)
- **Open-Meteo**: 1 request per hour for weather updates
- **Picsum Photos**: 1 request per background change
- **IPAPI.co**: 1 request on first load (cached indefinitely)
- **GitHub API**: 1 request per day for version check
- **Spotify API**: Real-time when widget is active, respects Spotify rate limits

### Caching Strategy

All API responses are cached locally to:

- Reduce network requests
- Improve performance
- Respect API rate limits
- Work offline when possible

---

## 📞 Support & Contact

For questions about API usage, privacy practices, or data handling:

- **GitHub Issues**: [https://github.com/JarnKet/apex-grid-app/issues](https://github.com/JarnKet/apex-grid-app/issues)
- **Email**: (Add your support email)
- **Documentation**: See README.md and other project docs

---

**Last Updated:** November 27, 2025  
**Version:** 1.0.2  
**Status:** Ready for Chrome Web Store Submission
