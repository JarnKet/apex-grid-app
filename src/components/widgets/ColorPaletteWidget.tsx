import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { Palette, RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import type { WidgetProps } from '../../types/widget';

interface ColorPalette {
    colors: string[];
    name: string;
    lastFetched: number;
}

const ColorPaletteWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const [copiedColor, setCopiedColor] = useState<string | null>(null);

    const paletteData = data as ColorPalette | undefined;

    const generatePalette = () => {
        // Generate harmonious color palette
        const hue = Math.floor(Math.random() * 360);
        const colors = [
            `hsl(${hue}, 70%, 50%)`,
            `hsl(${(hue + 30) % 360}, 70%, 60%)`,
            `hsl(${(hue + 60) % 360}, 70%, 55%)`,
            `hsl(${(hue + 120) % 360}, 70%, 50%)`,
            `hsl(${(hue + 180) % 360}, 70%, 45%)`,
        ];

        const names = ['Sunset', 'Ocean', 'Forest', 'Lavender', 'Coral', 'Mint', 'Peach', 'Sky'];
        const name = names[Math.floor(Math.random() * names.length)] + ' Palette';

        onDataChange?.({
            colors,
            name,
            lastFetched: Date.now(),
        });
    };

    useEffect(() => {
        if (!paletteData) {
            generatePalette();
        }
    }, []);

    const copyToClipboard = (color: string) => {
        // Convert HSL to HEX
        const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (hslMatch) {
            const h = parseInt(hslMatch[1]);
            const s = parseInt(hslMatch[2]) / 100;
            const l = parseInt(hslMatch[3]) / 100;

            const c = (1 - Math.abs(2 * l - 1)) * s;
            const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
            const m = l - c / 2;

            let r = 0, g = 0, b = 0;
            if (h < 60) { r = c; g = x; b = 0; }
            else if (h < 120) { r = x; g = c; b = 0; }
            else if (h < 180) { r = 0; g = c; b = x; }
            else if (h < 240) { r = 0; g = x; b = c; }
            else if (h < 300) { r = x; g = 0; b = c; }
            else { r = c; g = 0; b = x; }

            const toHex = (n: number) => {
                const hex = Math.round((n + m) * 255).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            };

            const hexColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
            navigator.clipboard.writeText(hexColor);
            setCopiedColor(hexColor);
            setTimeout(() => setCopiedColor(null), 2000);
        }
    };

    return (
        <WidgetWrapper
            id={id}
            title="Color Palette"
            icon={<Palette className="h-4 w-4" />}
            actions={
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={generatePalette}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <RefreshCw className="h-4 w-4" />
                </Button>
            }
        >
            <div className="flex flex-col h-full p-3 space-y-4">
                {paletteData && (
                    <>
                        <div className="text-center">
                            <h3 className="font-semibold">{paletteData.name}</h3>
                            <p className="text-xs text-muted-foreground">Click to copy hex code</p>
                        </div>

                        <div className="flex-1 flex flex-col gap-2">
                            {paletteData.colors.map((color, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => copyToClipboard(color)}
                                    className="relative flex-1 rounded-lg transition-transform hover:scale-105 cursor-pointer group"
                                    style={{ backgroundColor: color }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-black/70 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                                            {copiedColor === color ? (
                                                <>
                                                    <Check className="h-3 w-3" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-3 w-3" />
                                                    Copy
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </WidgetWrapper>
    );
};

export const ColorPaletteWidget = React.memo(ColorPaletteWidgetComponent);
