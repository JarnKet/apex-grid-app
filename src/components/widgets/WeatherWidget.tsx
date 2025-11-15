import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { RefreshCw, MapPin, Wind, Droplets, CloudSun } from 'lucide-react';
import { Button } from '../ui/Button';
import type { WidgetProps } from '../../types/widget';
import { fetchWeather, getUserLocation, getWeatherDescription, type WeatherData } from '../../services/weatherApi';

interface WeatherWidgetData {
    weather: WeatherData;
    lastFetched: number;
}

/**
 * WeatherWidget displays current weather conditions
 * - Uses Open-Meteo API (free, no API key required)
 * - Gets user location via browser geolocation
 * - Caches weather data for 30 minutes
 * - Shows temperature, conditions, wind, and humidity
 */
const WeatherWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const widgetData = data as WeatherWidgetData | undefined;
    const weather = widgetData?.weather;
    const lastFetched = widgetData?.lastFetched || 0;

    // Cache duration: 30 minutes
    const CACHE_DURATION = 30 * 60 * 1000;

    /**
     * Fetch weather data
     */
    const fetchWeatherData = async () => {
        setLoading(true);
        setError(null);

        try {
            const location = await getUserLocation();
            const weatherData = await fetchWeather(location.latitude, location.longitude);

            const newData: WeatherWidgetData = {
                weather: weatherData,
                lastFetched: Date.now(),
            };

            onDataChange?.(newData);
        } catch (err) {
            console.error('Failed to fetch weather:', err);
            setError(err instanceof Error ? err.message : 'Failed to load weather');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Initialize or refresh weather data
     */
    useEffect(() => {
        const shouldFetch = !lastFetched || Date.now() - lastFetched > CACHE_DURATION;

        if (shouldFetch && !loading) {
            fetchWeatherData();
        }
    }, []);

    const weatherDesc = weather ? getWeatherDescription(weather.weatherCode) : null;

    return (
        <WidgetWrapper id={id} title="Weather">
            <div className="flex flex-col h-full">
                {/* Loading state */}
                {loading && !weather && (
                    <div className="flex items-center justify-center h-full">
                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="flex flex-col items-center justify-center h-full space-y-3">
                        <CloudSun className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground text-center">{error}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchWeatherData}
                            disabled={loading}
                        >
                            <RefreshCw className="h-3 w-3 mr-2" />
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Weather display */}
                {!loading && !error && weather && weatherDesc && (
                    <div className="flex flex-col h-full justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{weather.location}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={fetchWeatherData}
                                disabled={loading}
                                className="h-7 w-7"
                                aria-label="Refresh weather"
                            >
                                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>

                        <div className="flex items-center justify-center flex-1">
                            <div className="text-center">
                                <div className="text-5xl mb-2">{weatherDesc.icon}</div>
                                <div className="text-4xl font-bold mb-1">{weather.temperature}°F</div>
                                <div className="text-sm text-muted-foreground">{weatherDesc.description}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                                <Wind className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <div className="text-xs text-muted-foreground">Wind</div>
                                    <div className="text-sm font-medium">{weather.windSpeed} mph</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                                <Droplets className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <div className="text-xs text-muted-foreground">Humidity</div>
                                    <div className="text-sm font-medium">{weather.humidity}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </WidgetWrapper>
    );
};

// Memoize component to prevent unnecessary re-renders
export const WeatherWidget = React.memo(WeatherWidgetComponent);
