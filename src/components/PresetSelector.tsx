import React, { useState } from 'react';
import { PRESET_LAYOUTS } from '../lib/presetLayouts';
import { useWidgetStore } from '../stores/useWidgetStore';
import { useLayoutStore } from '../stores/useLayoutStore';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

/**
 * PresetSelector component
 * Displays preset dashboard layouts in a scrollable grid
 * Designed to be embedded in the Settings Panel
 */
export const PresetSelector: React.FC = () => {
    const [loading, setLoading] = useState<string | null>(null);
    const { setWidgets } = useWidgetStore();
    const { setLayout } = useLayoutStore();

    const handleApplyPreset = async (presetId: string) => {
        setLoading(presetId);
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
        } catch (error) {
            console.error('Failed to apply preset:', error);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2 settings-scrollbar">
                {PRESET_LAYOUTS.map((preset) => (
                    <div
                        key={preset.id}
                        className={cn(
                            "group relative p-4 border-2 rounded-lg transition-all",
                            "hover:border-primary/50 hover:shadow-md"
                        )}
                    >
                        <div className="flex items-start gap-3 mb-3">
                            <div className="text-3xl flex-shrink-0">{preset.icon}</div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-base mb-1">{preset.name}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {preset.description}
                                </p>
                            </div>
                        </div>

                        <div className="mb-3">
                            <p className="text-xs text-muted-foreground mb-1.5">
                                {preset.widgets.length} widgets
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {preset.widgets.slice(0, 6).map((widget) => (
                                    <span
                                        key={widget.id}
                                        className="inline-block px-1.5 py-0.5 text-xs bg-muted rounded capitalize"
                                    >
                                        {widget.type.replace(/-/g, ' ')}
                                    </span>
                                ))}
                                {preset.widgets.length > 6 && (
                                    <span className="inline-block px-1.5 py-0.5 text-xs text-muted-foreground">
                                        +{preset.widgets.length - 6} more
                                    </span>
                                )}
                            </div>
                        </div>

                        <Button
                            onClick={() => handleApplyPreset(preset.id)}
                            disabled={loading === preset.id}
                            size="sm"
                            className="w-full"
                        >
                            {loading === preset.id ? 'Applying...' : 'Apply Layout'}
                        </Button>
                    </div>
                ))}
            </div>

            <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground">
                <p>
                    💡 <strong>Tip:</strong> Applying a preset replaces your current layout.
                    You can customize it afterwards by dragging and resizing widgets.
                </p>
            </div>
        </div>
    );
};
