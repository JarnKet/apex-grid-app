import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { RefreshCw, Settings, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
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
    fetchHoroscope,
    getZodiacInfo,
    ZODIAC_SIGNS,
    type ZodiacSign,
    type HoroscopeData
} from '../../services/horoscopeApi';

interface HoroscopeWidgetData {
    horoscope: HoroscopeData | null;
    selectedSign: ZodiacSign;
    lastFetched: number;
}

const DEFAULT_DATA: HoroscopeWidgetData = {
    horoscope: null,
    selectedSign: 'aries',
    lastFetched: 0,
};

/**
 * HoroscopeWidget - Daily horoscope readings
 * Shows daily horoscope, lucky numbers, mood, and compatibility
 */
const HoroscopeWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const widgetData = (data as HoroscopeWidgetData) || DEFAULT_DATA;
    const { horoscope, selectedSign, lastFetched } = widgetData;

    // Cache duration: 12 hours (horoscope changes daily)
    const CACHE_DURATION = 12 * 60 * 60 * 1000;

    const zodiacInfo = getZodiacInfo(selectedSign);

    /**
     * Fetch horoscope data
     */
    const fetchHoroscopeData = async (sign: ZodiacSign = selectedSign) => {
        setLoading(true);
        setError(null);

        try {
            const horoscopeData = await fetchHoroscope(sign);

            const newData: HoroscopeWidgetData = {
                horoscope: horoscopeData,
                selectedSign: sign,
                lastFetched: Date.now(),
            };

            onDataChange?.(newData);
        } catch (err) {
            console.error('Failed to fetch horoscope:', err);
            setError('Failed to load horoscope. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Initialize or refresh horoscope data
     */
    useEffect(() => {
        const shouldFetch = !lastFetched || Date.now() - lastFetched > CACHE_DURATION;

        if (shouldFetch && !loading) {
            fetchHoroscopeData();
        }
    }, []);

    /**
     * Handle sign change
     */
    const handleSignChange = (sign: ZodiacSign) => {
        setSettingsOpen(false);
        fetchHoroscopeData(sign);
    };

    /**
     * Manual refresh
     */
    const handleRefresh = () => {
        fetchHoroscopeData();
    };

    return (
        <WidgetWrapper
            id={id}
            title="Daily Horoscope"
            icon={<Sparkles className="h-4 w-4" />}
            actions={
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleRefresh}
                        disabled={loading}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
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
                                <DialogTitle>Select Your Zodiac Sign</DialogTitle>
                                <DialogDescription>
                                    Choose your zodiac sign to see your daily horoscope
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-3 gap-2 py-4">
                                {ZODIAC_SIGNS.map((zodiac) => (
                                    <button
                                        key={zodiac.sign}
                                        onClick={() => handleSignChange(zodiac.sign)}
                                        className={`p-3 rounded-lg border-2 transition-all text-center ${selectedSign === zodiac.sign
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{zodiac.emoji}</div>
                                        <div className="text-xs font-medium">{zodiac.label}</div>
                                        <div className="text-[10px] text-muted-foreground">
                                            {zodiac.dates}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <DialogFooter>
                                <Button onClick={() => setSettingsOpen(false)}>Done</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            }
        >
            <div className="flex flex-col h-full">
                {/* Loading state */}
                {loading && !horoscope && (
                    <div className="flex items-center justify-center h-full">
                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="flex flex-col items-center justify-center h-full space-y-3">
                        <Sparkles className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground text-center">{error}</p>
                        <Button variant="outline" size="sm" onClick={handleRefresh}>
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Horoscope display */}
                {!loading && !error && horoscope && zodiacInfo && (
                    <div className="flex-1 overflow-y-auto widget-scrollbar space-y-4">
                        {/* Sign header */}
                        <div className="text-center pb-3 border-b border-border">
                            <div className="text-4xl mb-2">{zodiacInfo.emoji}</div>
                            <h3 className="text-lg font-semibold">{zodiacInfo.label}</h3>
                            <p className="text-xs text-muted-foreground">{zodiacInfo.dates}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {horoscope.current_date}
                            </p>
                        </div>

                        {/* Horoscope description */}
                        <div>
                            <p className="text-sm leading-relaxed">{horoscope.description}</p>
                        </div>

                        {/* Details grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-muted/50">
                                <div className="text-xs text-muted-foreground mb-1">Mood</div>
                                <div className="text-sm font-medium">{horoscope.mood}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                                <div className="text-xs text-muted-foreground mb-1">
                                    Lucky Number
                                </div>
                                <div className="text-sm font-medium">{horoscope.lucky_number}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                                <div className="text-xs text-muted-foreground mb-1">Lucky Color</div>
                                <div className="text-sm font-medium capitalize">{horoscope.color}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                                <div className="text-xs text-muted-foreground mb-1">Lucky Time</div>
                                <div className="text-sm font-medium">{horoscope.lucky_time}</div>
                            </div>
                        </div>

                        {/* Compatibility */}
                        <div className="p-3 rounded-lg bg-muted/50">
                            <div className="text-xs text-muted-foreground mb-1">
                                Compatibility
                            </div>
                            <div className="text-sm font-medium capitalize">
                                {horoscope.compatibility}
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && !horoscope && (
                    <div className="flex flex-col items-center justify-center h-full space-y-3">
                        <Sparkles className="h-12 w-12 text-muted-foreground" />
                        <div className="text-center">
                            <p className="text-sm font-medium">No Horoscope Yet</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Select your zodiac sign to get started
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSettingsOpen(true)}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <Settings className="h-3 w-3 mr-2" />
                            Choose Sign
                        </Button>
                    </div>
                )}
            </div>
        </WidgetWrapper>
    );
};

export const HoroscopeWidget = React.memo(HoroscopeWidgetComponent);
