import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { WidgetWrapper } from '../WidgetWrapper';
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
import { useWidgetSize, getResponsiveTextSize, isCompactMode } from '../../lib/useWidgetSize';
import { cn } from '../../lib/utils';

interface ClockData {
    showSeconds: boolean;
    dateFormat: 'full' | 'short' | 'numeric' | 'none';
    hour12: boolean;
}

const DEFAULT_DATA: ClockData = {
    showSeconds: true,
    dateFormat: 'full',
    hour12: true,
};

/**
 * ClockWidget displays the current time and date with configurable settings
 * - Configurable seconds display
 * - Multiple date format options
 * - 12/24 hour format toggle
 */
const ClockWidgetComponent: React.FC<WidgetProps> = ({ id, data = DEFAULT_DATA, onDataChange }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { ref, size } = useWidgetSize();

    const clockData: ClockData = { ...DEFAULT_DATA, ...data };
    const textSizes = getResponsiveTextSize(size);
    const compact = isCompactMode(size);

    useEffect(() => {
        setCurrentTime(new Date());
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const handleSettingChange = (key: keyof ClockData, value: any) => {
        const newData = { ...clockData, [key]: value };
        onDataChange?.(newData);
    };

    // Format time based on settings
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        ...(clockData.showSeconds && { second: '2-digit' }),
        hour12: clockData.hour12,
    });

    // Format date based on settings
    const getDateFormatter = () => {
        switch (clockData.dateFormat) {
            case 'full':
                return new Intl.DateTimeFormat('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
            case 'short':
                return new Intl.DateTimeFormat('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                });
            case 'numeric':
                return new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                });
            case 'none':
                return null;
            default:
                return new Intl.DateTimeFormat('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
        }
    };

    const dateFormatter = getDateFormatter();
    const formattedTime = timeFormatter.format(currentTime);
    const formattedDate = dateFormatter ? dateFormatter.format(currentTime) : null;

    return (
        <WidgetWrapper
            id={id}
            title="Clock"
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
                            <DialogTitle>Clock Settings</DialogTitle>
                            <DialogDescription>
                                Customize how the clock displays time and date
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium">Show Seconds</label>
                                    <p className="text-xs text-muted-foreground">
                                        Display seconds in time
                                    </p>
                                </div>
                                <Switch
                                    checked={clockData.showSeconds}
                                    onCheckedChange={(checked) => handleSettingChange('showSeconds', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium">12-Hour Format</label>
                                    <p className="text-xs text-muted-foreground">
                                        Use 12-hour (AM/PM) format
                                    </p>
                                </div>
                                <Switch
                                    checked={clockData.hour12}
                                    onCheckedChange={(checked) => handleSettingChange('hour12', checked)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date Format</label>
                                <p className="text-xs text-muted-foreground mb-2">
                                    Choose how to display the date
                                </p>
                                <div className="space-y-2">
                                    {[
                                        { value: 'full', label: 'Full', example: 'Saturday, November 15, 2025' },
                                        { value: 'short', label: 'Short', example: 'Sat, Nov 15, 2025' },
                                        { value: 'numeric', label: 'Numeric', example: '11/15/2025' },
                                        { value: 'none', label: 'None', example: 'Hide date' },
                                    ].map((format) => (
                                        <label
                                            key={format.value}
                                            className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors"
                                        >
                                            <input
                                                type="radio"
                                                name="dateFormat"
                                                value={format.value}
                                                checked={clockData.dateFormat === format.value}
                                                onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                                                className="h-4 w-4"
                                            />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium">{format.label}</div>
                                                <div className="text-xs text-muted-foreground">{format.example}</div>
                                            </div>
                                            {clockData.dateFormat === format.value && (
                                                <span className="text-primary text-sm">✓</span>
                                            )}
                                        </label>
                                    ))}
                                </div>
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
            <div ref={ref} className={cn("flex flex-col items-center justify-center h-full", textSizes.spacing)}>
                <time
                    className={cn(textSizes.display, "font-bold tracking-tight")}
                    dateTime={currentTime.toISOString()}
                    aria-label={`Current time: ${formattedTime}`}
                >
                    {formattedTime}
                </time>
                {formattedDate && !compact && (
                    <time
                        className={cn(textSizes.body, "text-muted-foreground")}
                        dateTime={currentTime.toISOString().split('T')[0]}
                        aria-label={`Current date: ${formattedDate}`}
                    >
                        {formattedDate}
                    </time>
                )}
            </div>
        </WidgetWrapper>
    );
};

// Memoize component to prevent unnecessary re-renders
export const ClockWidget = React.memo(ClockWidgetComponent);
