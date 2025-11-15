import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Settings, Calendar } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/Dialog';
import type { WidgetProps } from '../../types/widget';

interface CountdownData {
    label: string;
    targetDate: string;
}

interface TimeRemaining {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
}

const DEFAULT_DATA: CountdownData = {
    label: 'Countdown',
    targetDate: '',
};

const CountdownWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const countdownData: CountdownData = { ...DEFAULT_DATA, ...data };

    const [tempLabel, setTempLabel] = useState(countdownData.label);
    const [tempDate, setTempDate] = useState(countdownData.targetDate);
    const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isPast: false,
    });

    const calculateTimeRemaining = () => {
        if (!countdownData.targetDate) return;

        const now = new Date().getTime();
        const target = new Date(countdownData.targetDate).getTime();
        const difference = target - now;

        if (difference < 0) {
            setTimeRemaining({
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                isPast: true,
            });
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({ days, hours, minutes, seconds, isPast: false });
    };

    useEffect(() => {
        calculateTimeRemaining();
        const interval = setInterval(calculateTimeRemaining, 1000);
        return () => clearInterval(interval);
    }, [countdownData.targetDate]);

    const handleSaveSettings = () => {
        if (tempDate) {
            onDataChange?.({ label: tempLabel, targetDate: tempDate });
            setSettingsOpen(false);
        }
    };

    const needsSetup = !countdownData.targetDate;

    return (
        <WidgetWrapper
            id={id}
            title={countdownData.label}
            icon={<Calendar className="h-4 w-4" />}
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
                            <DialogTitle>Countdown Settings</DialogTitle>
                            <DialogDescription>
                                Set up your countdown event
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label htmlFor="countdownLabel" className="text-sm font-medium">
                                    Event Name
                                </label>
                                <Input
                                    id="countdownLabel"
                                    value={tempLabel}
                                    onChange={(e) => setTempLabel(e.target.value)}
                                    placeholder="e.g., Birthday, Vacation, Launch Day"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="countdownDate" className="text-sm font-medium">
                                    Target Date & Time
                                </label>
                                <Input
                                    id="countdownDate"
                                    type="datetime-local"
                                    value={tempDate}
                                    onChange={(e) => setTempDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSaveSettings} disabled={!tempDate}>
                                Save
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            }
        >
            {needsSetup ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center space-y-4">
                    <Calendar className="h-12 w-12 text-muted-foreground" />
                    <div>
                        <p className="text-sm font-medium mb-1">Setup Required</p>
                        <p className="text-xs text-muted-foreground">
                            Click the settings icon to set your countdown event
                        </p>
                    </div>
                </div>
            ) : timeRemaining.isPast ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center space-y-4">
                    <div className="text-4xl">🎉</div>
                    <div>
                        <p className="text-lg font-semibold">Event Reached!</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {new Date(countdownData.targetDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full p-4">
                    <div className="grid grid-cols-4 gap-4 w-full max-w-md">
                        <div className="text-center">
                            <div className="text-3xl font-bold">{timeRemaining.days}</div>
                            <div className="text-xs text-muted-foreground mt-1">Days</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">{timeRemaining.hours}</div>
                            <div className="text-xs text-muted-foreground mt-1">Hours</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">{timeRemaining.minutes}</div>
                            <div className="text-xs text-muted-foreground mt-1">Minutes</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">{timeRemaining.seconds}</div>
                            <div className="text-xs text-muted-foreground mt-1">Seconds</div>
                        </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-4 text-center">
                        Until {new Date(countdownData.targetDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </div>
                </div>
            )}
        </WidgetWrapper>
    );
};

export const CountdownWidget = React.memo(CountdownWidgetComponent);
