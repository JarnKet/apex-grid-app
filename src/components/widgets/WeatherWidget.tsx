import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { RefreshCw, MapPin, Wind, Droplets, CloudSun, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { Switch } from '../ui/Switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/Dialog';
import type { WidgetProps } from '../../types/widget';
import { fetchWeather, fetchWeatherForecast, getUserLocation, getWeatherDescription, type WeatherData, type ForecastDay } from '../../services/weatherApi';
import { useWidgetSize, getResponsiveTextSize, isCompactMode } from '../../lib/useWidgetSize';
import { cn } from '../../lib/utils';

interface WeatherSettings {
    unit: 'C' | 'F';
    showWeekly: boolean;
}

interface WeatherWidgetData {
    weather: WeatherData;
    forecast?: ForecastDay[];
    lastFetched: number;
    settings: WeatherSettings;
}

const DEFAULT_SETTINGS: WeatherSettings = {
    unit: 'F',
    showWeekly: false,
};

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
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { ref, size } = useWidgetSize();

    const widgetData = data as WeatherWidgetData | undefined;
    const weather = widgetData?.weather;
    const forecast = widgetData?.forecast;
    const lastFetched = widgetData?.lastFetched || 0;
    const settings = widgetData?.settings || DEFAULT_SETTINGS;

    const textSizes = getResponsiveTextSize(size);
    const compact = isCompactMode(size);

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
            const [weatherData, forecastData] = await Promise.all([
                fetchWeather(location.latitude, location.longitude),
                settings.showWeekly ? fetchWeatherForecast(location.latitude, location.longitude) : Promise.resolve(undefined),
            ]);

            const newData: WeatherWidgetData = {
                weather: weatherData,
                forecast: forecastData,
                lastFetched: Date.now(),
                settings,
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

    const handleSettingChange = async (key: keyof WeatherSettings, value: any) => {
        const newSettings = { ...settings, [key]: value };

        // If enabling weekly forecast and we don't have forecast data, fetch it
        if (key === 'showWeekly' && value === true && !forecast && weather) {
            setLoading(true);
            try {
                const location = await getUserLocation();
                const forecastData = await fetchWeatherForecast(location.latitude, location.longitude);
                const newData: WeatherWidgetData = {
                    weather: weather!,
                    forecast: forecastData,
                    lastFetched,
                    settings: newSettings,
                };
                onDataChange?.(newData);
            } catch (err) {
                console.error('Failed to fetch forecast:', err);
            } finally {
                setLoading(false);
            }
        } else {
            const newData: WeatherWidgetData = {
                weather: weather!,
                forecast,
                lastFetched,
                settings: newSettings,
            };
            onDataChange?.(newData);
        }
    };

    const convertTemp = (tempF: number): number => {
        if (settings.unit === 'C') {
            return Math.round((tempF - 32) * 5 / 9);
        }
        return Math.round(tempF);
    };

    const convertSpeed = (mph: number): string => {
        if (settings.unit === 'C') {
            return `${Math.round(mph * 1.60934)} km/h`;
        }
        return `${Math.round(mph)} mph`;
    };

    return (
        <WidgetWrapper
            id={id}
            title="Weather"
            icon={<CloudSun className="h-4 w-4" />}
            actions={
                <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                        >
                            <Settings className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Weather Settings</DialogTitle>
                            <DialogDescription>
                                Customize weather display preferences
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Temperature Unit</label>
                                <p className="text-xs text-muted-foreground mb-2">
                                    Choose between Celsius or Fahrenheit
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant={settings.unit === 'C' ? 'default' : 'outline'}
                                        className="flex-1"
                                        onClick={() => handleSettingChange('unit', 'C')}
                                    >
                                        Celsius (°C)
                                    </Button>
                                    <Button
                                        variant={settings.unit === 'F' ? 'default' : 'outline'}
                                        className="flex-1"
                                        onClick={() => handleSettingChange('unit', 'F')}
                                    >
                                        Fahrenheit (°F)
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium">Show Weekly Forecast</label>
                                    <p className="text-xs text-muted-foreground">
                                        Display 7-day forecast (requires larger widget)
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.showWeekly}
                                    onCheckedChange={(checked) => handleSettingChange('showWeekly', checked)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button onClick={() => setSettingsOpen(false)}>
                                Done
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            }
        >
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
                    <div ref={ref} className="flex flex-col h-full justify-between">
                        {!compact && (
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className={textSizes.icon} />
                                    <span className={cn(textSizes.small, "text-muted-foreground")}>{weather.location}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={fetchWeatherData}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onTouchStart={(e) => e.stopPropagation()}
                                    disabled={loading}
                                    className="h-7 w-7"
                                    aria-label="Refresh weather"
                                >
                                    <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>
                        )}

                        <div className="flex items-center justify-center flex-1">
                            <div className="text-center">
                                <div className={cn(textSizes.display, "mb-2")}>{weatherDesc.icon}</div>
                                <div className={cn(textSizes.display, "font-bold mb-1")}>
                                    {convertTemp(weather.temperature)}°{settings.unit}
                                </div>
                                {!compact && (
                                    <div className={cn(textSizes.small, "text-muted-foreground")}>
                                        {weatherDesc.description}
                                    </div>
                                )}
                            </div>
                        </div>

                        {!compact && (
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                                    <Wind className={textSizes.icon} />
                                    <div>
                                        <div className={cn(textSizes.small, "text-muted-foreground")}>Wind</div>
                                        <div className={cn(textSizes.small, "font-medium")}>{convertSpeed(weather.windSpeed)}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                                    <Droplets className={textSizes.icon} />
                                    <div>
                                        <div className={cn(textSizes.small, "text-muted-foreground")}>Humidity</div>
                                        <div className={cn(textSizes.small, "font-medium")}>{weather.humidity}%</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {settings.showWeekly && !compact && forecast && (
                            <div className="mt-4 pt-4 border-t border-border">
                                <div className={cn(textSizes.small, "font-medium mb-3")}>7-Day Forecast</div>
                                <div className="grid grid-cols-7 gap-1">
                                    {forecast.map((day, index) => {
                                        const dayDesc = getWeatherDescription(day.weatherCode);
                                        return (
                                            <div
                                                key={day.date}
                                                className="flex flex-col items-center p-1 rounded-md hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="text-[10px] font-medium text-muted-foreground mb-1">
                                                    {index === 0 ? 'Today' : day.dayOfWeek}
                                                </div>
                                                <div className="text-lg mb-1">{dayDesc.icon}</div>
                                                <div className="text-xs font-medium">
                                                    {convertTemp(day.tempMax)}°
                                                </div>
                                                <div className="text-[10px] text-muted-foreground">
                                                    {convertTemp(day.tempMin)}°
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </WidgetWrapper>
    );
};

// Memoize component to prevent unnecessary re-renders
export const WeatherWidget = React.memo(WeatherWidgetComponent);
