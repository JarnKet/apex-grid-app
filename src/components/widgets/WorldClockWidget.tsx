import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { Globe, Plus, Trash2, Settings } from 'lucide-react';
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

interface TimeZone {
    id: string;
    name: string;
    timezone: string;
}

const POPULAR_TIMEZONES: TimeZone[] = [
    { id: '1', name: 'New York', timezone: 'America/New_York' },
    { id: '2', name: 'London', timezone: 'Europe/London' },
    { id: '3', name: 'Tokyo', timezone: 'Asia/Tokyo' },
    { id: '4', name: 'Sydney', timezone: 'Australia/Sydney' },
    { id: '5', name: 'Dubai', timezone: 'Asia/Dubai' },
    { id: '6', name: 'Singapore', timezone: 'Asia/Singapore' },
    { id: '7', name: 'Los Angeles', timezone: 'America/Los_Angeles' },
    { id: '8', name: 'Paris', timezone: 'Europe/Paris' },
    { id: '9', name: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
    { id: '10', name: 'Mumbai', timezone: 'Asia/Kolkata' },
];

interface WorldClockData {
    timezones: TimeZone[];
}

const DEFAULT_TIMEZONES: TimeZone[] = [
    { id: '1', name: 'New York', timezone: 'America/New_York' },
    { id: '2', name: 'London', timezone: 'Europe/London' },
    { id: '3', name: 'Tokyo', timezone: 'Asia/Tokyo' },
];

const WorldClockWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [settingsOpen, setSettingsOpen] = useState(false);

    const widgetData = (data as WorldClockData) || { timezones: DEFAULT_TIMEZONES };
    const timezones = widgetData.timezones || DEFAULT_TIMEZONES;

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const handleAddTimezone = (timezone: TimeZone) => {
        if (!timezones.find(tz => tz.timezone === timezone.timezone)) {
            onDataChange?.({
                timezones: [...timezones, { ...timezone, id: Date.now().toString() }],
            });
        }
    };

    const handleRemoveTimezone = (timezoneId: string) => {
        onDataChange?.({
            timezones: timezones.filter(tz => tz.id !== timezoneId),
        });
    };

    const formatTime = (timezone: string) => {
        return new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        }).format(currentTime);
    };

    const formatDate = (timezone: string) => {
        return new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        }).format(currentTime);
    };

    return (
        <WidgetWrapper
            id={id}
            title="World Clock"
            icon={<Globe className="h-4 w-4" />}
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
                            <DialogTitle>Manage Timezones</DialogTitle>
                            <DialogDescription>
                                Add or remove timezones to display
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div>
                                <h4 className="text-sm font-medium mb-2">Popular Timezones</h4>
                                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                                    {POPULAR_TIMEZONES.map((tz) => (
                                        <Button
                                            key={tz.id}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleAddTimezone(tz)}
                                            disabled={timezones.some(t => t.timezone === tz.timezone)}
                                            className="justify-start"
                                        >
                                            <Plus className="h-3 w-3 mr-2" />
                                            {tz.name}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={() => setSettingsOpen(false)}>Done</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            }
        >
            <div className="flex flex-col h-full overflow-y-auto widget-scrollbar space-y-3 p-2">
                {timezones.map((tz) => (
                    <div
                        key={tz.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 group"
                    >
                        <div className="flex-1">
                            <div className="font-semibold text-sm">{tz.name}</div>
                            <div className="text-xs text-muted-foreground">{formatDate(tz.timezone)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-lg font-mono font-bold">
                                {formatTime(tz.timezone)}
                            </div>
                            {timezones.length > 1 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleRemoveTimezone(tz.id)}
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </WidgetWrapper>
    );
};

export const WorldClockWidget = React.memo(WorldClockWidgetComponent);
