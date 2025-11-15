import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Settings, TrendingUp } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/Dialog';
import type { WidgetProps } from '../../types/widget';

interface ProgressBar {
    label: string;
    percentage: number;
}

const LifeProgressWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [birthDate, setBirthDate] = useState(data?.birthDate || '');
    const [lifeExpectancy, setLifeExpectancy] = useState(data?.lifeExpectancy || 80);
    const [progressBars, setProgressBars] = useState<ProgressBar[]>([]);

    const calculateProgress = () => {
        if (!birthDate) return;

        const now = new Date();
        const birth = new Date(birthDate);

        // Life progress
        const lifeExpectancyMs = lifeExpectancy * 365.25 * 24 * 60 * 60 * 1000;
        const lifeElapsed = now.getTime() - birth.getTime();
        const lifeProgress = Math.min((lifeElapsed / lifeExpectancyMs) * 100, 100);

        // Year progress
        const yearStart = new Date(now.getFullYear(), 0, 1);
        const yearEnd = new Date(now.getFullYear() + 1, 0, 1);
        const yearProgress = ((now.getTime() - yearStart.getTime()) / (yearEnd.getTime() - yearStart.getTime())) * 100;

        // Quarter progress
        const quarter = Math.floor(now.getMonth() / 3);
        const quarterStart = new Date(now.getFullYear(), quarter * 3, 1);
        const quarterEnd = new Date(now.getFullYear(), (quarter + 1) * 3, 1);
        const quarterProgress = ((now.getTime() - quarterStart.getTime()) / (quarterEnd.getTime() - quarterStart.getTime())) * 100;

        // Month progress
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const monthProgress = ((now.getTime() - monthStart.getTime()) / (monthEnd.getTime() - monthStart.getTime())) * 100;

        // Week progress
        const dayOfWeek = now.getDay();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - dayOfWeek);
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);
        const weekProgress = ((now.getTime() - weekStart.getTime()) / (weekEnd.getTime() - weekStart.getTime())) * 100;

        // Day progress
        const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayStart.getDate() + 1);
        const dayProgress = ((now.getTime() - dayStart.getTime()) / (dayEnd.getTime() - dayStart.getTime())) * 100;

        setProgressBars([
            { label: 'Life', percentage: lifeProgress },
            { label: 'Year', percentage: yearProgress },
            { label: 'Quarter', percentage: quarterProgress },
            { label: 'Month', percentage: monthProgress },
            { label: 'Week', percentage: weekProgress },
            { label: 'Day', percentage: dayProgress },
        ]);
    };

    useEffect(() => {
        calculateProgress();
        const interval = setInterval(calculateProgress, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [birthDate, lifeExpectancy]);

    const handleSave = () => {
        if (birthDate && onDataChange) {
            onDataChange({ birthDate, lifeExpectancy });
            setSettingsOpen(false);
        }
    };

    const needsSetup = !data?.birthDate;

    return (
        <WidgetWrapper
            id={id}
            title="Life Progress"
            icon={<TrendingUp className="h-4 w-4" />}
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
                            <DialogTitle>Life Progress Settings</DialogTitle>
                            <DialogDescription>
                                Configure your birth date and life expectancy
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label htmlFor="birthDate" className="text-sm font-medium">Birth Date</label>
                                <Input
                                    id="birthDate"
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="lifeExpectancy" className="text-sm font-medium">Life Expectancy (years)</label>
                                <Input
                                    id="lifeExpectancy"
                                    type="number"
                                    min="1"
                                    max="150"
                                    value={lifeExpectancy}
                                    onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button onClick={handleSave} disabled={!birthDate}>
                                Save
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            }
        >
            {needsSetup ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center space-y-4">
                    <TrendingUp className="h-12 w-12 text-muted-foreground" />
                    <div>
                        <p className="text-sm font-medium mb-1">Setup Required</p>
                        <p className="text-xs text-muted-foreground">
                            Click the settings icon to configure your birth date
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col justify-center h-full space-y-3 p-4">
                    {progressBars.map((bar) => (
                        <div key={bar.label} className="space-y-1">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{bar.label}</span>
                                <span className="text-sm text-muted-foreground">{bar.percentage.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${bar.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </WidgetWrapper>
    );
};

export const LifeProgressWidget = React.memo(LifeProgressWidgetComponent);
