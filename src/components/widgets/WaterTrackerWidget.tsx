import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { Droplets, Plus, Minus, RotateCcw, Settings } from 'lucide-react';
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

interface WaterTrackerData {
    glasses: number;
    goal: number;
    glassSize: number; // in ml
    lastReset: string; // Date string
}

const DEFAULT_DATA: WaterTrackerData = {
    glasses: 0,
    goal: 8,
    glassSize: 250, // 250ml per glass
    lastReset: new Date().toDateString(),
};

const WaterTrackerWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const widgetData = (data as WaterTrackerData) || DEFAULT_DATA;
    const [glasses, setGlasses] = useState(widgetData.glasses);
    const [goal, setGoal] = useState(widgetData.goal);
    const [glassSize, setGlassSize] = useState(widgetData.glassSize || 250);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [tempGoal, setTempGoal] = useState(goal.toString());
    const [tempGlassSize, setTempGlassSize] = useState(glassSize.toString());

    // Check if we need to reset (new day)
    useEffect(() => {
        const today = new Date().toDateString();
        if (widgetData.lastReset !== today) {
            // Reset for new day
            const newData = {
                glasses: 0,
                goal: widgetData.goal,
                glassSize: widgetData.glassSize || 250,
                lastReset: today,
            };
            setGlasses(0);
            onDataChange?.(newData);
        }
    }, []);

    const handleAddGlass = () => {
        const newGlasses = glasses + 1;
        setGlasses(newGlasses);
        onDataChange?.({
            glasses: newGlasses,
            goal,
            glassSize,
            lastReset: new Date().toDateString(),
        });
    };

    const handleRemoveGlass = () => {
        if (glasses > 0) {
            const newGlasses = glasses - 1;
            setGlasses(newGlasses);
            onDataChange?.({
                glasses: newGlasses,
                goal,
                glassSize,
                lastReset: new Date().toDateString(),
            });
        }
    };

    const handleReset = () => {
        setGlasses(0);
        onDataChange?.({
            glasses: 0,
            goal,
            glassSize,
            lastReset: new Date().toDateString(),
        });
    };

    const handleSaveSettings = () => {
        const newGoal = parseInt(tempGoal) || 8;
        const newGlassSize = parseInt(tempGlassSize) || 250;

        setGoal(newGoal);
        setGlassSize(newGlassSize);

        onDataChange?.({
            glasses,
            goal: newGoal,
            glassSize: newGlassSize,
            lastReset: new Date().toDateString(),
        });

        setSettingsOpen(false);
    };

    const percentage = Math.min((glasses / goal) * 100, 100);
    const isGoalReached = glasses >= goal;
    const totalLiters = ((glasses * glassSize) / 1000).toFixed(2);
    const goalLiters = ((goal * glassSize) / 1000).toFixed(2);

    return (
        <WidgetWrapper
            id={id}
            title="Water Tracker"
            icon={<Droplets className="h-4 w-4" />}
            actions={
                <>
                    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                    setTempGoal(goal.toString());
                                    setTempGlassSize(glassSize.toString());
                                    setSettingsOpen(true);
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                                onTouchStart={(e) => e.stopPropagation()}
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Water Tracker Settings</DialogTitle>
                                <DialogDescription>
                                    Customize your daily water intake goal
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Daily Goal (glasses)</label>
                                    <Input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={tempGoal}
                                        onChange={(e) => setTempGoal(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Number of glasses to drink per day
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Glass Size (ml)</label>
                                    <Input
                                        type="number"
                                        min="100"
                                        max="1000"
                                        step="50"
                                        value={tempGlassSize}
                                        onChange={(e) => setTempGlassSize(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Volume of each glass in milliliters
                                    </p>
                                </div>

                                <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="text-sm">
                                        Daily Goal: <strong>{parseInt(tempGoal) || 8} glasses</strong> × <strong>{parseInt(tempGlassSize) || 250}ml</strong> = <strong>{(((parseInt(tempGoal) || 8) * (parseInt(tempGlassSize) || 250)) / 1000).toFixed(2)}L</strong>
                                    </p>
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
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleReset}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </>
            }
        >
            <div className="flex flex-col items-center justify-center h-full p-4 space-y-6">
                {/* Water glass visualization */}
                <div className="relative w-32 h-40">
                    {/* Glass outline */}
                    <div className="absolute inset-0 border-4 border-primary/30 rounded-b-3xl rounded-t-lg" />

                    {/* Water fill */}
                    <div
                        className="absolute bottom-0 left-0 right-0 bg-blue-500/30 rounded-b-3xl transition-all duration-500 ease-out"
                        style={{ height: `${percentage}%` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/50 to-blue-400/30" />
                    </div>

                    {/* Droplet icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Droplets className={`h-12 w-12 ${isGoalReached ? 'text-blue-500' : 'text-muted-foreground'}`} />
                    </div>
                </div>

                {/* Stats */}
                <div className="text-center">
                    <div className="text-4xl font-bold mb-1">
                        {glasses} / {goal}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        glasses ({Math.round(percentage)}%)
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        {totalLiters}L / {goalLiters}L ({glassSize}ml per glass)
                    </div>
                    {isGoalReached && (
                        <div className="text-xs text-green-500 font-medium mt-2">
                            🎉 Goal reached!
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleRemoveGlass}
                        disabled={glasses === 0}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                        size="lg"
                        onClick={handleAddGlass}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="px-8"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Glass
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleAddGlass}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                {/* Info */}
                <div className="text-xs text-muted-foreground text-center">
                    Resets daily at midnight
                </div>
            </div>
        </WidgetWrapper>
    );
};

export const WaterTrackerWidget = React.memo(WaterTrackerWidgetComponent);
