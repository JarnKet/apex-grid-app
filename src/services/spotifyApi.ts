// Spotify API service with OAuth authentication

export interface SpotifyTrack {
    name: string;
    artist: string;
    album: string;
    albumArt: string;
    duration: number;
    progress: number;
    isPlaying: boolean;
    uri: string;
}

export interface SpotifyAuthTokens {
    accessToken: string;
    refreshToken?: string;
    expiresAt: number;
}

export class SpotifyApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SpotifyApiError';
    }
}

/**
 * Spotify OAuth configuration
 * Uses environment variables set by the extension developer
 */
export interface SpotifyConfig {
    clientId: string;
    clientSecret: string;
}

/**
 * Get Spotify config from environment variables
 */
export function getSpotifyConfig(): SpotifyConfig {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new SpotifyApiError(
            'Spotify credentials not configured. Please contact the extension developer.'
        );
    }

    return {
        clientId,
        clientSecret,
    };
}

/**
 * Get the redirect URI for OAuth
 */
export function getRedirectUri(): string {
    // In development, chrome.runtime.id might be undefined
    // Get it safely or use a placeholder
    const extensionId = chrome?.runtime?.id;

    if (!extensionId) {
        throw new SpotifyApiError(
            'Extension ID not available. Please load the extension in Chrome first.'
        );
    }

    return `https://${extensionId}.chromiumapp.org/`;
}

/**
 * Generate authorization URL for Spotify OAuth
 */
export function getAuthorizationUrl(clientId?: string): string {
    const config = clientId ? { clientId, clientSecret: '' } : getSpotifyConfig();
    const actualClientId = clientId || config.clientId;
    const redirectUri = getRedirectUri();
    const scopes = [
        'user-read-currently-playing',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-recently-played',
        'playlist-read-private',
        'playlist-read-collaborative',
    ].join(' ');

    const params = new URLSearchParams({
        client_id: actualClientId,
        response_type: 'code',
        redirect_uri: redirectUri,
        scope: scopes,
        show_dialog: 'true',
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

/**
 * Launch OAuth flow using chrome.identity
 * Uses app-wide credentials from environment variables
 */
export async function authenticateSpotify(): Promise<string> {
    return new Promise((resolve, reject) => {
        const config = getSpotifyConfig();
        const authUrl = getAuthorizationUrl(config.clientId);

        chrome.identity.launchWebAuthFlow(
            {
                url: authUrl,
                interactive: true,
            },
            (redirectUrl) => {
                if (chrome.runtime.lastError) {
                    reject(new SpotifyApiError(chrome.runtime.lastError.message || 'Authentication failed'));
                    return;
                }

                if (!redirectUrl) {
                    reject(new SpotifyApiError('No redirect URL received'));
                    return;
                }

                try {
                    // Extract authorization code from redirect URL
                    const url = new URL(redirectUrl);
                    const code = url.searchParams.get('code');

                    if (!code) {
                        reject(new SpotifyApiError('No authorization code received'));
                        return;
                    }

                    resolve(code);
                } catch (error) {
                    reject(new SpotifyApiError('Failed to parse redirect URL'));
                }
            }
        );
    });
}

/**
 * Exchange authorization code for access token
 * Uses app-wide credentials from environment variables
 */
export async function exchangeCodeForToken(code: string): Promise<SpotifyAuthTokens> {
    const config = getSpotifyConfig();
    const redirectUri = getRedirectUri();

    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
    });

    const credentials = btoa(`${config.clientId}:${config.clientSecret}`);

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${credentials}`,
            },
            body: params.toString(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new SpotifyApiError(error.error_description || 'Failed to get access token');
        }

        const data = await response.json();

        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresAt: Date.now() + data.expires_in * 1000,
        };
    } catch (error) {
        throw new SpotifyApiError(
            error instanceof Error ? error.message : 'Failed to exchange code for token'
        );
    }
}

/**
 * Refresh access token using refresh token
 * Uses app-wide credentials from environment variables
 */
export async function refreshAccessToken(refreshToken: string): Promise<SpotifyAuthTokens> {
    const config = getSpotifyConfig();
    const params = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
    });

    const credentials = btoa(`${config.clientId}:${config.clientSecret}`);

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${credentials}`,
            },
            body: params.toString(),
        });

        if (!response.ok) {
            throw new SpotifyApiError('Failed to refresh token');
        }

        const data = await response.json();

        return {
            accessToken: data.access_token,
            refreshToken: refreshToken, // Keep existing refresh token
            expiresAt: Date.now() + data.expires_in * 1000,
        };
    } catch (error) {
        throw new SpotifyApiError(
            error instanceof Error ? error.message : 'Failed to refresh token'
        );
    }
}

/**
 * Get currently playing track
 */
export async function getCurrentlyPlaying(accessToken: string): Promise<SpotifyTrack | null> {
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (response.status === 204 || response.status === 404) {
            // No track currently playing
            return null;
        }

        if (!response.ok) {
            throw new SpotifyApiError('Failed to get currently playing track');
        }

        const data = await response.json();

        if (!data.item) {
            return null;
        }

        return {
            name: data.item.name,
            artist: data.item.artists.map((a: any) => a.name).join(', '),
            album: data.item.album.name,
            albumArt: data.item.album.images[0]?.url || '',
            duration: data.item.duration_ms,
            progress: data.progress_ms || 0,
            isPlaying: data.is_playing,
            uri: data.item.uri,
        };
    } catch (error) {
        throw new SpotifyApiError(
            error instanceof Error ? error.message : 'Failed to get currently playing track'
        );
    }
}

/**
 * Control playback (play/pause)
 */
export async function togglePlayback(accessToken: string, play: boolean): Promise<void> {
    const endpoint = play
        ? 'https://api.spotify.com/v1/me/player/play'
        : 'https://api.spotify.com/v1/me/player/pause';

    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok && response.status !== 204) {
            throw new SpotifyApiError('Failed to control playback');
        }
    } catch (error) {
        throw new SpotifyApiError(
            error instanceof Error ? error.message : 'Failed to control playback'
        );
    }
}

/**
 * Skip to next track
 */
export async function skipToNext(accessToken: string): Promise<void> {
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/next', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok && response.status !== 204) {
            throw new SpotifyApiError('Failed to skip track');
        }
    } catch (error) {
        throw new SpotifyApiError(
            error instanceof Error ? error.message : 'Failed to skip track'
        );
    }
}

/**
 * Skip to previous track
 */
export async function skipToPrevious(accessToken: string): Promise<void> {
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/previous', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok && response.status !== 204) {
            throw new SpotifyApiError('Failed to skip track');
        }
    } catch (error) {
        throw new SpotifyApiError(
            error instanceof Error ? error.message : 'Failed to skip track'
        );
    }
}
