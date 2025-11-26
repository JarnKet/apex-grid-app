import React, { useState } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { Settings, Music } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
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

interface SpotifySettings {
    spotifyUrl: string;
    viewMode: 'compact' | 'full';
}

const DEFAULT_SETTINGS: SpotifySettings = {
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M', // Today's Top Hits
    viewMode: 'full',
};

/**
 * Parse Spotify URL to get embed URL
 * Supports: playlists, albums, tracks, podcasts, artists
 */
const getSpotifyEmbedUrl = (url: string): string | null => {
    try {
        // Handle Spotify URIs (spotify:playlist:xxxxx)
        if (url.startsWith('spotify:')) {
            const parts = url.split(':');
            if (parts.length >= 3) {
                const type = parts[1]; // playlist, album, track, etc.
                const id = parts[2];
                return `https://open.spotify.com/embed/${type}/${id}`;
            }
        }

        // Handle Spotify URLs
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('spotify.com')) {
            // Extract path (e.g., /playlist/xxxxx or /album/xxxxx)
            const path = urlObj.pathname;
            return `https://open.spotify.com/embed${path}`;
        }

        return null;
    } catch {
        return null;
    }
};

/**
 * SpotifyWidget - Embedded Spotify player
 * Supports playlists, albums, tracks, podcasts, and artists
 */
const SpotifyWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [tempUrl, setTempUrl] = useState('');
    const [urlError, setUrlError] = useState('');

    const settings: SpotifySettings = data?.settings || DEFAULT_SETTINGS;
    const embedUrl = getSpotifyEmbedUrl(settings.spotifyUrl);

    const handleOpenSettings = () => {
        setTempUrl(settings.spotifyUrl);
        setUrlError('');
        setSettingsOpen(true);
    };

    const handleSaveSettings = () => {
        if (!tempUrl.trim()) {
            setUrlError('Please enter a Spotify URL or URI');
            return;
        }

        const testEmbedUrl = getSpotifyEmbedUrl(tempUrl.trim());
        if (!testEmbedUrl) {
            setUrlError('Invalid Spotify URL. Please use a valid Spotify link.');
            return;
        }

        onDataChange?.({
            settings: {
                ...settings,
                spotifyUrl: tempUrl.trim(),
            },
        });

        setSettingsOpen(false);
        setUrlError('');
    };

    const handleViewModeChange = (mode: 'compact' | 'full') => {
        onDataChange?.({
            settings: {
                ...settings,
                viewMode: mode,
            },
        });
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
                                Configure your Spotify player
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Spotify URL or URI</label>
                                <Input
                                    placeholder="https://open.spotify.com/playlist/..."
                                    value={tempUrl}
                                    onChange={(e) => {
                                        setTempUrl(e.target.value);
                                        setUrlError('');
                                    }}
                                />
                                {urlError && (
                                    <p className="text-xs text-destructive">{urlError}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Paste a Spotify link to a playlist, album, track, or podcast
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">View Mode</label>
                                <div className="flex gap-2">
                                    <Button
                                        variant={settings.viewMode === 'compact' ? 'default' : 'outline'}
                                        className="flex-1"
                                        onClick={() => handleViewModeChange('compact')}
                                    >
                                        Compact
                                    </Button>
                                    <Button
                                        variant={settings.viewMode === 'full' ? 'default' : 'outline'}
                                        className="flex-1"
                                        onClick={() => handleViewModeChange('full')}
                                    >
                                        Full
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Compact mode shows a smaller player
                                </p>
                            </div>

                            <div className="bg-muted/50 p-3 rounded-md text-xs space-y-2">
                                <p className="font-medium">💡 How to get Spotify URLs:</p>
                                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                                    <li>Open Spotify (app or web)</li>
                                    <li>Find a playlist, album, or track</li>
                                    <li>Click "..." → Share → Copy link</li>
                                    <li>Paste the link here</li>
                                </ol>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSaveSettings}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            }
        >
            <div className="h-full w-full flex items-center justify-center">
                {embedUrl ? (
                    <iframe
                        src={embedUrl}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="rounded-md"
                        title="Spotify Player"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 p-4 text-center">
                        <Music className="h-12 w-12 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">No Spotify Content</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Click the settings icon to add a playlist, album, or track
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleOpenSettings}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <Settings className="h-3 w-3 mr-2" />
                            Configure
                        </Button>
                    </div>
                )}
            </div>
        </WidgetWrapper>
    );
};

export const SpotifyWidget = React.memo(SpotifyWidgetComponent);
