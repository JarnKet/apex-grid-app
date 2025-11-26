import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { Settings, Music, Play, Pause, SkipForward, SkipBack, LogIn } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Switch } from '../ui/Switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/Dialog';
import type { WidgetProps } from '../../types/widget';
import {
    authenticateSpotify,
    exchangeCodeForToken,
    refreshAccessToken,
    getCurrentlyPlaying,
    togglePlayback,
    skipToNext,
    skipToPrevious,
    type SpotifyTrack,
    type SpotifyAuthTokens,
    type SpotifyConfig,
} from '../../services/spotifyApi';

interface SpotifyWidgetData {
    mode: 'embed' | 'oauth';
    // Embed mode
    embedUrl?: string;
    // OAuth mode
    tokens?: SpotifyAuthTokens;
    currentTrack?: SpotifyTrack;
    lastFetched?: number;
}

const DEFAULT_DATA: SpotifyWidgetData = {
    mode: 'embed',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M',
};

/**
 * SpotifyWidget - Shows currently playing track or embeds Spotify player
 * Supports both OAuth (currently playing) and embed modes
 */
const SpotifyWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Settings state
    const [tempMode, setTempMode] = useState<'embed' | 'oauth'>('embed');
    const [tempEmbedUrl, setTempEmbedUrl] = useState('');

    const widgetData = (data as SpotifyWidgetData) || DEFAULT_DATA;
    const { mode, embedUrl, tokens, currentTrack } = widgetData;

    // Poll for currently playing track
    useEffect(() => {
        if (mode !== 'oauth' || !tokens) return;

        const fetchCurrentTrack = async () => {
            try {
                // Check if token is expired
                if (tokens.expiresAt < Date.now() && tokens.refreshToken) {
                    const newTokens = await refreshAccessToken(tokens.refreshToken);
                    const track = await getCurrentlyPlaying(newTokens.accessToken);

                    onDataChange?.({
                        ...widgetData,
                        tokens: newTokens,
                        currentTrack: track || undefined,
                        lastFetched: Date.now(),
                    });
                } else {
                    const track = await getCurrentlyPlaying(tokens.accessToken);

                    onDataChange?.({
                        ...widgetData,
                        currentTrack: track || undefined,
                        lastFetched: Date.now(),
                    });
                }
            } catch (err) {
                console.error('Failed to fetch current track:', err);
                setError('Failed to fetch current track');
            }
        };

        fetchCurrentTrack();
        const interval = setInterval(fetchCurrentTrack, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, [mode, tokens?.accessToken]);

    const handleAuthenticate = async () => {
        setLoading(true);
        setError(null);

        try {
            // Check if chrome.runtime is available
            if (!chrome?.runtime?.id) {
                throw new Error('Extension not properly loaded. Please reload the extension.');
            }

            const code = await authenticateSpotify();
            const newTokens = await exchangeCodeForToken(code);

            onDataChange?.({
                mode: 'oauth',
                tokens: newTokens,
            });

            setSettingsOpen(false);
        } catch (err) {
            console.error('Authentication failed:', err);
            setError(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePlayPause = async () => {
        if (!tokens || !currentTrack) return;

        try {
            await togglePlayback(tokens.accessToken, !currentTrack.isPlaying);
        } catch (err) {
            console.error('Failed to toggle playback:', err);
        }
    };

    const handleNext = async () => {
        if (!tokens) return;

        try {
            await skipToNext(tokens.accessToken);
        } catch (err) {
            console.error('Failed to skip track:', err);
        }
    };

    const handlePrevious = async () => {
        if (!tokens) return;

        try {
            await skipToPrevious(tokens.accessToken);
        } catch (err) {
            console.error('Failed to skip track:', err);
        }
    };

    const handleSaveSettings = () => {
        if (tempMode === 'embed') {
            if (!tempEmbedUrl.trim()) {
                setError('Please enter a Spotify URL');
                return;
            }

            onDataChange?.({
                mode: 'embed',
                embedUrl: tempEmbedUrl.trim(),
            });
        }

        setSettingsOpen(false);
        setError(null);
    };

    const handleOpenSettings = () => {
        setTempMode(mode);
        setTempEmbedUrl(embedUrl || '');
        setError(null);
        setSettingsOpen(true);
    };

    const formatTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <WidgetWrapper
            id={id}
            title="Spotify"
            icon={<Music className="h-4 w-4" />}
            actions={
                <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleOpenSettings}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                        >
                            <Settings className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Spotify Settings</DialogTitle>
                            <DialogDescription>
                                Configure Spotify integration
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {/* Mode Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mode</label>
                                <div className="flex gap-2">
                                    <Button
                                        variant={tempMode === 'embed' ? 'default' : 'outline'}
                                        className="flex-1"
                                        onClick={() => setTempMode('embed')}
                                    >
                                        Embed Player
                                    </Button>
                                    <Button
                                        variant={tempMode === 'oauth' ? 'default' : 'outline'}
                                        className="flex-1"
                                        onClick={() => setTempMode('oauth')}
                                    >
                                        Currently Playing
                                    </Button>
                                </div>
                            </div>

                            {/* Embed Mode Settings */}
                            {tempMode === 'embed' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Spotify URL</label>
                                    <Input
                                        placeholder="https://open.spotify.com/playlist/..."
                                        value={tempEmbedUrl}
                                        onChange={(e) => setTempEmbedUrl(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Paste any Spotify playlist, album, or track URL
                                    </p>
                                </div>
                            )}

                            {/* OAuth Mode Settings */}
                            {tempMode === 'oauth' && (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                                        <p className="text-sm font-medium">Connect Your Spotify Account</p>
                                        <p className="text-xs text-muted-foreground">
                                            Click the button below to authorize ApexGrid to access your Spotify playback information.
                                        </p>
                                    </div>
                                    {!tokens && (
                                        <Button
                                            onClick={handleAuthenticate}
                                            disabled={loading}
                                            className="w-full"
                                        >
                                            <LogIn className="h-4 w-4 mr-2" />
                                            {loading ? 'Connecting...' : 'Connect Spotify'}
                                        </Button>
                                    )}
                                    {tokens && (
                                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                                            <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                                ✓ Connected to Spotify
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Your account is connected and ready to use
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {error && (
                                <p className="text-sm text-destructive">{error}</p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                                Cancel
                            </Button>
                            {tempMode === 'embed' && (
                                <Button onClick={handleSaveSettings}>Save</Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            }
        >
            <div className="flex flex-col h-full">
                {/* Embed Mode */}
                {mode === 'embed' && embedUrl && (
                    <iframe
                        src={embedUrl}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="rounded-md"
                    />
                )}

                {/* OAuth Mode - Currently Playing */}
                {mode === 'oauth' && tokens && currentTrack && (
                    <div className="flex flex-col h-full p-4 space-y-4">
                        {/* Album Art */}
                        {currentTrack.albumArt && (
                            <img
                                src={currentTrack.albumArt}
                                alt={currentTrack.album}
                                className="w-full aspect-square object-cover rounded-lg"
                            />
                        )}

                        {/* Track Info */}
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg truncate">{currentTrack.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
                            <p className="text-xs text-muted-foreground truncate">{currentTrack.album}</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                            <div className="w-full bg-muted rounded-full h-1">
                                <div
                                    className="bg-primary h-1 rounded-full transition-all"
                                    style={{
                                        width: `${(currentTrack.progress / currentTrack.duration) * 100}%`,
                                    }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{formatTime(currentTrack.progress)}</span>
                                <span>{formatTime(currentTrack.duration)}</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePrevious}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <SkipBack className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="default"
                                size="icon"
                                className="h-12 w-12"
                                onClick={handlePlayPause}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                {currentTrack.isPlaying ? (
                                    <Pause className="h-6 w-6" />
                                ) : (
                                    <Play className="h-6 w-6" />
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleNext}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <SkipForward className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* OAuth Mode - No Track Playing */}
                {mode === 'oauth' && tokens && !currentTrack && (
                    <div className="flex flex-col items-center justify-center h-full space-y-3">
                        <Music className="h-12 w-12 text-muted-foreground" />
                        <div className="text-center">
                            <p className="text-sm font-medium">No Track Playing</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Start playing music on Spotify
                            </p>
                        </div>
                    </div>
                )}

                {/* OAuth Mode - Not Authenticated */}
                {mode === 'oauth' && !tokens && (
                    <div className="flex flex-col items-center justify-center h-full space-y-3">
                        <Music className="h-12 w-12 text-muted-foreground" />
                        <div className="text-center">
                            <p className="text-sm font-medium">Connect Spotify</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Configure your credentials in settings
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleOpenSettings}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <Settings className="h-3 w-3 mr-2" />
                            Open Settings
                        </Button>
                    </div>
                )}
            </div>
        </WidgetWrapper>
    );
};

export const SpotifyWidget = React.memo(SpotifyWidgetComponent);
