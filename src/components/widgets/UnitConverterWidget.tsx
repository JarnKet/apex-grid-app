import React, { useState } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { Ruler, ArrowDownUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { WidgetProps } from '../../types/widget';

type UnitCategory = 'css' | 'storage' | 'length' | 'weight';

interface UnitConversion {
    category: UnitCategory;
    from: string;
    to: string;
    value: string;
}

const UNIT_CATEGORIES = {
    css: {
        name: 'CSS Units',
        units: [
            { code: 'px', name: 'Pixels' },
            { code: 'rem', name: 'REM' },
            { code: 'em', name: 'EM' },
            { code: 'pt', name: 'Points' },
        ],
    },
    storage: {
        name: 'Storage',
        units: [
            { code: 'B', name: 'Bytes' },
            { code: 'KB', name: 'Kilobytes' },
            { code: 'MB', name: 'Megabytes' },
            { code: 'GB', name: 'Gigabytes' },
        ],
    },
    length: {
        name: 'Length',
        units: [
            { code: 'mm', name: 'Millimeters' },
            { code: 'cm', name: 'Centimeters' },
            { code: 'm', name: 'Meters' },
            { code: 'km', name: 'Kilometers' },
            { code: 'in', name: 'Inches' },
            { code: 'ft', name: 'Feet' },
        ],
    },
    weight: {
        name: 'Weight',
        units: [
            { code: 'g', name: 'Grams' },
            { code: 'kg', name: 'Kilograms' },
            { code: 'oz', name: 'Ounces' },
            { code: 'lb', name: 'Pounds' },
        ],
    },
};

const UnitConverterWidgetComponent: React.FC<WidgetProps> = ({ id }) => {
    const [category, setCategory] = useState<UnitCategory>('css');
    const [value, setValue] = useState('16');
    const [fromUnit, setFromUnit] = useState('px');
    const [toUnit, setToUnit] = useState('rem');

    const convert = (): string => {
        const val = parseFloat(value);
        if (isNaN(val)) return '0';

        // CSS conversions (assuming 16px = 1rem)
        if (category === 'css') {
            const conversions: { [key: string]: { [key: string]: number } } = {
                px: { px: 1, rem: 1 / 16, em: 1 / 16, pt: 0.75 },
                rem: { px: 16, rem: 1, em: 1, pt: 12 },
                em: { px: 16, rem: 1, em: 1, pt: 12 },
                pt: { px: 1.333, rem: 1 / 12, em: 1 / 12, pt: 1 },
            };
            return (val * conversions[fromUnit][toUnit]).toFixed(3);
        }

        // Storage conversions
        if (category === 'storage') {
            const toBytes: { [key: string]: number } = {
                B: 1,
                KB: 1024,
                MB: 1024 * 1024,
                GB: 1024 * 1024 * 1024,
            };
            const bytes = val * toBytes[fromUnit];
            return (bytes / toBytes[toUnit]).toFixed(2);
        }

        // Length conversions
        if (category === 'length') {
            const toMeters: { [key: string]: number } = {
                mm: 0.001,
                cm: 0.01,
                m: 1,
                km: 1000,
                in: 0.0254,
                ft: 0.3048,
            };
            const meters = val * toMeters[fromUnit];
            return (meters / toMeters[toUnit]).toFixed(4);
        }

        // Weight conversions
        if (category === 'weight') {
            const toGrams: { [key: string]: number } = {
                g: 1,
                kg: 1000,
                oz: 28.3495,
                lb: 453.592,
            };
            const grams = val * toGrams[fromUnit];
            return (grams / toGrams[toUnit]).toFixed(4);
        }

        return '0';
    };

    const handleCategoryChange = (newCategory: UnitCategory) => {
        setCategory(newCategory);
        setFromUnit(UNIT_CATEGORIES[newCategory].units[0].code);
        setToUnit(UNIT_CATEGORIES[newCategory].units[1].code);
    };

    const swapUnits = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
    };

    return (
        <WidgetWrapper id={id} title="Unit Converter" icon={<Ruler className="h-4 w-4" />}>
            <div className="flex flex-col h-full p-3 space-y-4">
                {/* Category selector */}
                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                    <select
                        value={category}
                        onChange={(e) => handleCategoryChange(e.target.value as UnitCategory)}
                        className="w-full p-2 rounded-md border border-input bg-background text-sm"
                    >
                        {Object.entries(UNIT_CATEGORIES).map(([key, cat]) => (
                            <option key={key} value={key}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Value input */}
                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Value</label>
                    <Input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="16"
                    />
                </div>

                {/* From unit */}
                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">From</label>
                    <select
                        value={fromUnit}
                        onChange={(e) => setFromUnit(e.target.value)}
                        className="w-full p-2 rounded-md border border-input bg-background text-sm"
                    >
                        {UNIT_CATEGORIES[category].units.map((unit) => (
                            <option key={unit.code} value={unit.code}>
                                {unit.name} ({unit.code})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Swap button */}
                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={swapUnits}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <ArrowDownUp className="h-4 w-4" />
                    </Button>
                </div>

                {/* To unit */}
                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">To</label>
                    <select
                        value={toUnit}
                        onChange={(e) => setToUnit(e.target.value)}
                        className="w-full p-2 rounded-md border border-input bg-background text-sm"
                    >
                        {UNIT_CATEGORIES[category].units.map((unit) => (
                            <option key={unit.code} value={unit.code}>
                                {unit.name} ({unit.code})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Result */}
                <div className="p-4 rounded-lg bg-primary/10 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Result</div>
                    <div className="text-2xl font-bold">
                        {convert()} {toUnit}
                    </div>
                </div>
            </div>
        </WidgetWrapper>
    );
};

export const UnitConverterWidget = React.memo(UnitConverterWidgetComponent);
