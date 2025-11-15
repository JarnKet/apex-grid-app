import React, { useState } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Settings, Plus, Minus, RotateCcw } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/Dialog';
import type { WidgetProps } from '../../types/widget';

interface CounterData {
    label: string;
    count: number;
    step: number;
}

const DEFAULT_DATA: CounterData = {
    label: 'Counter',
    count: 0,
    step: 1,
};

const CounterWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const counterData: CounterData = { ...DEFAULT_DATA, ...data };

    const [tempLabel, setTempLabel] = useState(counterData.label);
    const [tempStep, setTempStep] = useState(counterData.step);

    const handleIncrement = () => {
        onDataChange?.({ ...counterData, count: counterData.count + counterData.step });
    };

    const handleDecrement = () => {
        onDataChange?.({ ...counterData, count: counterData.count - counterData.step });
    };

    const handleReset = () => {
        onDataChange?.({ ...counterData, count: 0 });
    };

    const handleSaveSettings = () => {
        onDataChange?.({ ...counterData, label: tempLabel, step: tempStep });
        setSettingsOpen(false);
    };

    return (
        <WidgetWrapper
            id={id}
            title={counterData.label}
            icon={<Plus className="h-4 w-4" />}
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
                            <DialogTitle>Counter Settings</DialogTitle>
                            <DialogDescription>
                                Customize your counter label and increment step
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label htmlFor="counterLabel" className="text-sm font-medium">
                                    Label
                                </label>
                                <Input
                                    id="counterLabel"
                                    value={tempLabel}
                                    onChange={(e) => setTempLabel(e.target.value)}
                                    placeholder="e.g., Days Sober, Books Read"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="counterStep" className="text-sm font-medium">
                                    Step Size
                                </label>
                                <Input
                                    id="counterStep"
                                    type="number"
                                    min="1"
                                    value={tempStep}
                                    onChange={(e) => setTempStep(Number(e.target.value))}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Amount to add/subtract with each click
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSaveSettings}>
                                Save
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            }
        >
            <div className="flex flex-col items-center justify-center h-full space-y-6 p-4">
                <div className="text-center">
                    <div className="text-6xl font-bold tracking-tight">
                        {counterData.count}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleDecrement}
                        className="h-12 w-12"
                    >
                        <Minus className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleReset}
                        className="h-12 w-12"
                        title="Reset to 0"
                    >
                        <RotateCcw className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="default"
                        size="icon"
                        onClick={handleIncrement}
                        className="h-12 w-12"
                    >
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </WidgetWrapper>
    );
};

export const CounterWidget = React.memo(CounterWidgetComponent);
