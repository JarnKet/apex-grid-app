import React, { useState } from 'react';
import { PRESET_LAYOUTS } from '../lib/presetLayouts';
import { useWidgetStore } from '../stores/useWidgetStore';
import { useLayoutStore } from '../stores/useLayoutStore';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/Dialog';
import { Button } from './ui/Button';
import { Zap } from 'lucide-react';

/**
 * PresetSelector component
 * Allows users to quickly switch between preset dashboard layouts
 */
export const PresetSelector: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { setWidgets } = useWidgetStore();
    const { setLayout } = useLayoutStore();

    const handleApplyPreset = async (presetId: string) => {
        setLoading(true);
        try {
            const preset = PRESET_LAYOUTS.find(p => p.id === presetId);
            if (!preset) return;

            // Update widgets and layout
            setWidgets(preset.widgets);
            setLayout(preset.layout);

            // Persist to storage
            const { storage } = await import('../services/storage');
            await Promise.all([
                storage.set('widgets', preset.widgets),
                storage.set('layout', preset.layout),
            ]);

            setOpen(false);
        } catch (error) {
            console.error('Failed to apply preset:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    title="Apply preset dashboard layout"
                >
                    <Zap className="h-4 w-4" />
                    Presets
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Dashboard Presets</DialogTitle>
                    <DialogDescription>
                        Choose a preset layout optimized for your workflow
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    {PRESET_LAYOUTS.map((preset) => (
                        <div
                            key={preset.id}
                            className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <div className="text-2xl mb-2">{preset.icon}</div>
                                    <h3 className="font-semibold text-lg">{preset.name}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {preset.description}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-xs text-muted-foreground mb-2">
                                    Includes {preset.widgets.length} widgets:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {preset.widgets.map((widget) => (
                                        <span
                                            key={widget.id}
                                            className="inline-block px-2 py-1 text-xs bg-muted rounded"
                                        >
                                            {widget.type.replace('-', ' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <Button
                                onClick={() => handleApplyPreset(preset.id)}
                                disabled={loading}
                                className="w-full mt-4"
                            >
                                Apply {preset.name} Layout
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground">
                    <p>
                        💡 <strong>Tip:</strong> Applying a preset will replace your current dashboard layout.
                        You can always customize it afterwards by dragging and resizing widgets.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};
