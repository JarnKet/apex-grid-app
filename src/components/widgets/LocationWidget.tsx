import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { MapPin, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import type { WidgetProps } from '../../types/widget';

interface LocationData {
    ip: string;
    city: string;
    region: string;
    country: string;
    isp: string;
    timezone: string;
    lastFetched: number;
}

const LocationWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const locationData = data as LocationData | undefined;
    const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

    const fetchLocation = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('https://ipapi.co/json/');

            if (!response.ok) {
                throw new Error('Failed to fetch location');
            }

            const data = await response.json();

            const newData: LocationData = {
                ip: data.ip,
                city: data.city,
                region: data.region,
                country: data.country_name,
                isp: data.org,
                timezone: data.timezone,
                lastFetched: Date.now(),
            };

            onDataChange?.(newData);
        } catch (err) {
            setError('Failed to load location data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const shouldFetch = !locationData?.lastFetched ||
            Date.now() - locationData.lastFetched > CACHE_DURATION;

        if (shouldFetch && !loading) {
            fetchLocation();
        }
    }, []);

    return (
        <WidgetWrapper
            id={id}
            title="Location Info"
            icon={<MapPin className="h-4 w-4" />}
            actions={
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={fetchLocation}
                    disabled={loading}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            }
        >
            <div className="flex flex-col h-full p-3 space-y-3">
                {loading && !locationData && (
                    <div className="flex items-center justify-center h-full">
                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}

                {error && (
                    <div className="text-center text-destructive text-sm py-8">
                        {error}
                    </div>
                )}

                {locationData && (
                    <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-muted/50">
                            <div className="text-xs text-muted-foreground mb-1">IP Address</div>
                            <div className="text-sm font-mono font-medium">{locationData.ip}</div>
                        </div>

                        <div className="p-3 rounded-lg bg-muted/50">
                            <div className="text-xs text-muted-foreground mb-1">Location</div>
                            <div className="text-sm font-medium">
                                {locationData.city}, {locationData.region}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                {locationData.country}
                            </div>
                        </div>

                        <div className="p-3 rounded-lg bg-muted/50">
                            <div className="text-xs text-muted-foreground mb-1">ISP</div>
                            <div className="text-sm font-medium">{locationData.isp}</div>
                        </div>

                        <div className="p-3 rounded-lg bg-muted/50">
                            <div className="text-xs text-muted-foreground mb-1">Timezone</div>
                            <div className="text-sm font-medium">{locationData.timezone}</div>
                        </div>
                    </div>
                )}
            </div>
        </WidgetWrapper>
    );
};

export const LocationWidget = React.memo(LocationWidgetComponent);
