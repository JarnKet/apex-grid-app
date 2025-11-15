import React, { useState } from 'react';
import { Plus, Clock, Calendar, CheckSquare, Link, Quote, Bitcoin, Rss, CloudSun, Timer, Music, Sparkles, Globe, DollarSign, Droplets, QrCode, Ruler, BookOpen, Image, Palette, Wind, MapPin, Code } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/Dialog';
import { Button } from './ui/Button';
import { useWidgetStore } from '../stores/useWidgetStore';
import type { WidgetType } from '../types/widget';

interface WidgetInfo {
    type: WidgetType;
    label: string;
    description: string;
    icon: React.ReactNode;
    preview: string;
    category: 'productivity' | 'information' | 'finance' | 'utility' | 'health' | 'lifestyle';
}

/**
 * Widget catalog with metadata and preview images
 */
const WIDGET_CATALOG: WidgetInfo[] = [
    {
        type: 'clock',
        label: 'Clock',
        description: 'Display current time with seconds and date',
        icon: <Clock className="h-6 w-6" />,
        preview: 'Shows real-time clock with hours, minutes, seconds, and full date',
        category: 'productivity',
    },
    {
        type: 'weather',
        label: 'Weather',
        description: 'Current weather conditions for your location',
        icon: <CloudSun className="h-6 w-6" />,
        preview: 'Temperature, conditions, wind speed, and humidity',
        category: 'information',
    },
    {
        type: 'calendar',
        label: 'Calendar',
        description: 'Monthly calendar view with current date',
        icon: <Calendar className="h-6 w-6" />,
        preview: 'Interactive monthly calendar with today highlighted',
        category: 'productivity',
    },
    {
        type: 'todo',
        label: 'Todo List',
        description: 'Manage your daily tasks and to-dos',
        icon: <CheckSquare className="h-6 w-6" />,
        preview: 'Add, complete, and delete tasks with persistent storage',
        category: 'productivity',
    },
    {
        type: 'quicklinks',
        label: 'Quick Links',
        description: 'Access your favorite websites instantly',
        icon: <Link className="h-6 w-6" />,
        preview: 'Customizable links to your most visited sites',
        category: 'productivity',
    },
    {
        type: 'quote',
        label: 'Daily Quote',
        description: 'Inspirational quotes to start your day',
        icon: <Quote className="h-6 w-6" />,
        preview: 'Random inspirational quotes with author attribution',
        category: 'information',
    },
    {
        type: 'rss',
        label: 'Tech News',
        description: 'Latest tech news from RSS feeds',
        icon: <Rss className="h-6 w-6" />,
        preview: 'Curated tech news from multiple sources',
        category: 'information',
    },
    {
        type: 'pomodoro',
        label: 'Pomodoro Timer',
        description: 'Focus timer with work and break intervals',
        icon: <Timer className="h-6 w-6" />,
        preview: 'Configurable Pomodoro timer with notifications and sound alerts',
        category: 'productivity',
    },
    {
        type: 'spotify',
        label: 'Spotify Player',
        description: 'Embedded Spotify player for music and podcasts',
        icon: <Music className="h-6 w-6" />,
        preview: 'Play your favorite playlists, albums, and tracks',
        category: 'productivity',
    },
    {
        type: 'horoscope',
        label: 'Daily Horoscope',
        description: 'Your daily horoscope and zodiac insights',
        icon: <Sparkles className="h-6 w-6" />,
        preview: 'Daily readings, lucky numbers, mood, and compatibility',
        category: 'information',
    },
    {
        type: 'github',
        label: 'GitHub Profile',
        description: 'Your GitHub stats and activity',
        icon: <Bitcoin className="h-6 w-6" />,
        preview: 'Profile, repos, contributions chart, and stats',
        category: 'productivity',
    },
    {
        type: 'worldclock',
        label: 'World Clock',
        description: 'Multiple timezone display',
        icon: <Globe className="h-6 w-6" />,
        preview: 'Track time across different timezones',
        category: 'utility',
    },
    {
        type: 'currency',
        label: 'Currency Converter',
        description: 'Real-time exchange rates',
        icon: <DollarSign className="h-6 w-6" />,
        preview: 'Convert between major currencies',
        category: 'utility',
    },
    {
        type: 'water',
        label: 'Water Tracker',
        description: 'Daily hydration reminder',
        icon: <Droplets className="h-6 w-6" />,
        preview: 'Track your daily water intake',
        category: 'health',
    },
    {
        type: 'qrcode',
        label: 'QR Code Generator',
        description: 'Quick QR creation for URLs/text',
        icon: <QrCode className="h-6 w-6" />,
        preview: 'Generate and download QR codes',
        category: 'utility',
    },
    {
        type: 'unitconverter',
        label: 'Unit Converter',
        description: 'Convert between different units',
        icon: <Ruler className="h-6 w-6" />,
        preview: 'CSS, storage, length, weight conversions',
        category: 'utility',
    },
    {
        type: 'tradingview-ticker',
        label: 'Market Ticker',
        description: 'Scrolling ticker tape of market prices',
        icon: <Bitcoin className="h-6 w-6" />,
        preview: 'Real-time prices for stocks, crypto, and forex',
        category: 'finance',
    },
    {
        type: 'tradingview-chart',
        label: 'Trading Chart',
        description: 'Advanced trading chart with indicators',
        icon: <Bitcoin className="h-6 w-6" />,
        preview: 'Full-featured TradingView chart with technical analysis',
        category: 'finance',
    },
    {
        type: 'tradingview-mini',
        label: 'Symbol Overview',
        description: 'Compact symbol price and mini chart',
        icon: <Bitcoin className="h-6 w-6" />,
        preview: 'Quick overview of any stock or crypto symbol',
        category: 'finance',
    },
    {
        type: 'tradingview-market',
        label: 'Market Overview',
        description: 'Multi-tab market overview with charts',
        icon: <Bitcoin className="h-6 w-6" />,
        preview: 'Indices, Forex, and Crypto markets in one widget',
        category: 'finance',
    },
    {
        type: 'dictionary',
        label: 'Dictionary',
        description: 'Word definitions and translations',
        icon: <BookOpen className="h-6 w-6" />,
        preview: 'Look up word meanings, synonyms, and translations',
        category: 'utility',
    },
    {
        type: 'unsplash',
        label: 'Unsplash Gallery',
        description: 'Beautiful random images',
        icon: <Image className="h-6 w-6" />,
        preview: 'Daily inspirational photos from Unsplash',
        category: 'lifestyle',
    },
    {
        type: 'colorpalette',
        label: 'Color Palette',
        description: 'Trending color schemes',
        icon: <Palette className="h-6 w-6" />,
        preview: 'Generate and copy color palettes with hex codes',
        category: 'utility',
    },
    {
        type: 'meditation',
        label: 'Meditation Timer',
        description: 'Guided breathing exercises',
        icon: <Wind className="h-6 w-6" />,
        preview: 'Box breathing and custom meditation timers',
        category: 'health',
    },
    {
        type: 'location',
        label: 'Location Info',
        description: 'Your IP and location details',
        icon: <MapPin className="h-6 w-6" />,
        preview: 'IP address, city, country, ISP information',
        category: 'information',
    },
    {
        type: 'apitester',
        label: 'API Tester',
        description: 'Quick API endpoint testing',
        icon: <Code className="h-6 w-6" />,
        preview: 'Test GET requests and view JSON responses',
        category: 'utility',
    },
];

interface WidgetGalleryProps {
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

/**
 * WidgetGallery component - App drawer style widget selector
 * - Browse available widgets by category
 * - Preview widget functionality before adding
 * - Add widgets with a single click
 * - Shows which widgets are already added
 */
export const WidgetGallery: React.FC<WidgetGalleryProps> = ({
    isOpen: controlledIsOpen,
    onOpenChange: controlledOnOpenChange
}) => {
    const { widgets, addWidget } = useWidgetStore();
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'productivity' | 'information' | 'finance' | 'utility' | 'health' | 'lifestyle'>('all');
    const [selectedWidget, setSelectedWidget] = useState<WidgetInfo | null>(null);

    // Use controlled state if provided, otherwise use internal state
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
    const setIsOpen = controlledOnOpenChange || setInternalIsOpen;

    /**
     * Check if a widget type is already added
     */
    const isWidgetAdded = (type: WidgetType): boolean => {
        return widgets.some(w => w.type === type && w.enabled);
    };

    /**
     * Handle adding a widget
     */
    const handleAddWidget = (type: WidgetType) => {
        if (!isWidgetAdded(type)) {
            addWidget(type);
        }
    };

    /**
     * Filter widgets by category
     */
    const filteredWidgets = selectedCategory === 'all'
        ? WIDGET_CATALOG
        : WIDGET_CATALOG.filter(w => w.category === selectedCategory);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="fixed top-4 right-16 z-40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Add widgets"
                    title="Add widgets"
                >
                    <Plus className="h-5 w-5" aria-hidden="true" />
                </Button>
            </DialogTrigger>
            <DialogContent
                className="w-[90vw] max-w-[90vw] h-[90vh] max-h-[90vh] flex flex-col p-0 overflow-hidden"
                aria-describedby="widget-gallery-description"
            >
                <DialogHeader className="px-6 pt-6 pb-4 border-b">
                    <DialogTitle>Widget Gallery</DialogTitle>
                    <DialogDescription id="widget-gallery-description">
                        Browse and add widgets to customize your dashboard
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar - Category Filter */}
                    <div className="w-48 border-r p-4 space-y-2">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Categories</h3>
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedCategory === 'all'
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                                }`}
                        >
                            All Widgets
                        </button>
                        <button
                            onClick={() => setSelectedCategory('productivity')}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedCategory === 'productivity'
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                                }`}
                        >
                            Productivity
                        </button>
                        <button
                            onClick={() => setSelectedCategory('information')}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedCategory === 'information'
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                                }`}
                        >
                            Information
                        </button>
                        <button
                            onClick={() => setSelectedCategory('finance')}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedCategory === 'finance'
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                                }`}
                        >
                            Finance
                        </button>
                        <button
                            onClick={() => setSelectedCategory('utility')}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedCategory === 'utility'
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                                }`}
                        >
                            Utility
                        </button>
                        <button
                            onClick={() => setSelectedCategory('health')}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedCategory === 'health'
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                                }`}
                        >
                            Health
                        </button>
                        <button
                            onClick={() => setSelectedCategory('lifestyle')}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedCategory === 'lifestyle'
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                                }`}
                        >
                            Lifestyle
                        </button>
                    </div>

                    {/* Main Content - Widget Grid */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredWidgets.map((widget) => {
                                const isAdded = isWidgetAdded(widget.type);
                                return (
                                    <div
                                        key={widget.type}
                                        className="group relative border rounded-lg p-4 hover:border-primary transition-all cursor-pointer"
                                        onClick={() => setSelectedWidget(widget)}
                                    >
                                        {/* Widget Icon */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                                {widget.icon}
                                            </div>
                                            {isAdded && (
                                                <span className="text-xs bg-chart-2/20 text-chart-2 px-2 py-1 rounded-full font-medium">
                                                    Added
                                                </span>
                                            )}
                                        </div>

                                        {/* Widget Info */}
                                        <h3 className="font-semibold mb-1">{widget.label}</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            {widget.description}
                                        </p>

                                        {/* Add Button */}
                                        <Button
                                            variant={isAdded ? 'outline' : 'default'}
                                            size="sm"
                                            className="w-full"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddWidget(widget.type);
                                            }}
                                            disabled={isAdded}
                                        >
                                            {isAdded ? 'Already Added' : 'Add Widget'}
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Preview Panel */}
                    {selectedWidget && (
                        <div className="w-80 border-l p-6 overflow-y-auto">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                        {selectedWidget.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{selectedWidget.label}</h3>
                                        <span className="text-xs text-muted-foreground capitalize">
                                            {selectedWidget.category}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium mb-2">Description</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedWidget.description}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium mb-2">Features</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedWidget.preview}
                                    </p>
                                </div>

                                <Button
                                    variant={isWidgetAdded(selectedWidget.type) ? 'outline' : 'default'}
                                    className="w-full"
                                    onClick={() => handleAddWidget(selectedWidget.type)}
                                    disabled={isWidgetAdded(selectedWidget.type)}
                                >
                                    {isWidgetAdded(selectedWidget.type) ? 'Already Added' : 'Add to Dashboard'}
                                </Button>

                                <Button
                                    variant="ghost"
                                    className="w-full"
                                    onClick={() => setSelectedWidget(null)}
                                >
                                    Close Preview
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
