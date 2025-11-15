import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { Image, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import type { WidgetProps } from '../../types/widget';

interface UnsplashImage {
    url: string;
    author: string;
    authorUrl: string;
    downloadUrl: string;
    lastFetched: number;
}

const UnsplashWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const imageData = data as UnsplashImage | undefined;
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    const fetchImage = async () => {
        setLoading(true);
        setError(null);

        try {
            // Using Unsplash Source API (no API key required)
            const randomId = Math.floor(Math.random() * 1000);
            const imageUrl = `https://source.unsplash.com/800x600/?nature,landscape&sig=${randomId}`;

            const newData: UnsplashImage = {
                url: imageUrl,
                author: 'Unsplash',
                authorUrl: 'https://unsplash.com',
                downloadUrl: imageUrl,
                lastFetched: Date.now(),
            };

            onDataChange?.(newData);
        } catch (err) {
            setError('Failed to load image');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const shouldFetch = !imageData?.lastFetched ||
            Date.now() - imageData.lastFetched > CACHE_DURATION;

        if (shouldFetch && !loading) {
            fetchImage();
        }
    }, []);

    return (
        <WidgetWrapper
            id={id}
            title="Inspiration"
            icon={<Image className="h-4 w-4" />}
            actions={
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={fetchImage}
                    disabled={loading}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            }
        >
            <div className="relative h-full w-full">
                {loading && !imageData && (
                    <div className="flex items-center justify-center h-full">
                        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}

                {error && (
                    <div className="flex items-center justify-center h-full text-destructive text-sm">
                        {error}
                    </div>
                )}

                {imageData && (
                    <div className="relative h-full w-full group">
                        <img
                            src={imageData.url}
                            alt="Inspirational"
                            className="w-full h-full object-cover rounded-md"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a
                                href={imageData.authorUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-white flex items-center gap-1"
                            >
                                Photo by {imageData.author}
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </WidgetWrapper>
    );
};

export const UnsplashWidget = React.memo(UnsplashWidgetComponent);
