import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/Dialog';
import { Button } from './ui/Button';
import { Switch } from './ui/Switch';
import { Input } from './ui/Input';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useWidgetStore } from '../stores/useWidgetStore';
import type { WidgetType } from '../types/widget';

/**
 * Search engine options for the selector
 */
const SEARCH_ENGINE_OPTIONS = [
    { value: 'google' as const, label: 'Google', icon: '🔍' },
    { value: 'bing' as const, label: 'Bing', icon: '🅱️' },
    { value: 'duckduckgo' as const, label: 'DuckDuckGo', icon: '🦆' },
    { value: 'yahoo' as const, label: 'Yahoo', icon: 'Y!' },
];

/**
 * Widget type metadata for display in settings
 */
const WIDGET_TYPES: Array<{ type: WidgetType; label: string; description: string }> = [
    { type: 'clock', label: 'Clock', description: 'Display current time and date' },
    { type: 'calendar', label: 'Calendar', description: 'Monthly calendar view' },
    { type: 'todo', label: 'Todo List', description: 'Manage your tasks' },
    { type: 'quicklinks', label: 'Quick Links', description: 'Access favorite websites' },
    { type: 'quote', label: 'Daily Quote', description: 'Inspirational quotes' },
    { type: 'currency', label: 'Currency Exchange', description: 'Live exchange rates' },
];

interface SettingsPanelProps {
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

/**
 * SettingsPanel component - configuration interface for ApexGrid
 * - Theme toggle (dark/light mode)
 * - Background customization
 * - Widget enable/disable controls
 * - Persists all changes to Chrome Storage
 */
export const SettingsPanel: React.FC<SettingsPanelProps> = ({
    isOpen: controlledIsOpen,
    onOpenChange: controlledOnOpenChange
}) => {
    const { theme, background, userName, searchEngine, setTheme, setBackground, setUserName, setSearchEngine } = useSettingsStore();
    const { widgets, addWidget, removeWidget } = useWidgetStore();
    const [backgroundInput, setBackgroundInput] = useState(background || '');
    const [userNameInput, setUserNameInput] = useState(userName || '');
    const [userNameError, setUserNameError] = useState<string | null>(null);
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    // Use controlled state if provided, otherwise use internal state
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
    const setIsOpen = controlledOnOpenChange || setInternalIsOpen;

    /**
     * Handle theme toggle
     */
    const handleThemeToggle = async (checked: boolean) => {
        const newTheme = checked ? 'dark' : 'light';
        try {
            await setTheme(newTheme);
        } catch (error) {
            console.error('Failed to update theme:', error);
        }
    };

    /**
     * Handle background change
     */
    const handleBackgroundChange = async () => {
        try {
            const value = backgroundInput.trim() || null;
            await setBackground(value);
        } catch (error) {
            console.error('Failed to update background:', error);
        }
    };

    /**
     * Validate user name input
     */
    const validateUserName = (name: string): string | null => {
        if (name.length > 50) {
            return 'Name must be 50 characters or less';
        }
        if (name && !/^[a-zA-Z0-9\s]*$/.test(name)) {
            return 'Name can only contain letters, numbers, and spaces';
        }
        return null;
    };

    /**
     * Handle user name change
     */
    const handleUserNameChange = (value: string) => {
        setUserNameInput(value);
        const error = validateUserName(value);
        setUserNameError(error);
    };

    /**
     * Handle user name save
     */
    const handleUserNameSave = async () => {
        const trimmedName = userNameInput.trim();
        const error = validateUserName(trimmedName);

        if (error) {
            setUserNameError(error);
            return;
        }

        try {
            await setUserName(trimmedName || null);
            setUserNameError(null);
        } catch (error) {
            console.error('Failed to update user name:', error);
            setUserNameError('Failed to save name. Please try again.');
        }
    };

    /**
     * Handle search engine change
     */
    const handleSearchEngineChange = async (engine: 'google' | 'bing' | 'duckduckgo' | 'yahoo') => {
        try {
            await setSearchEngine(engine);
        } catch (error) {
            console.error('Failed to update search engine:', error);
        }
    };

    /**
     * Handle widget enable/disable toggle
     */
    const handleWidgetToggle = (type: WidgetType, enabled: boolean) => {
        if (enabled) {
            // Add widget
            addWidget(type);
        } else {
            // Find and remove widget of this type
            const widgetToRemove = widgets.find(w => w.type === type);
            if (widgetToRemove) {
                removeWidget(widgetToRemove.id);
            }
        }
    };

    /**
     * Check if a widget type is currently enabled
     */
    const isWidgetEnabled = (type: WidgetType): boolean => {
        return widgets.some(w => w.type === type && w.enabled);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="fixed top-4 right-4 z-40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Open settings"
                    title="Open settings"
                >
                    <Settings className="h-5 w-5" aria-hidden="true" />
                </Button>
            </DialogTrigger>
            <DialogContent
                className="max-w-2xl max-h-[80vh] overflow-y-auto"
                aria-describedby="settings-description"
            >
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription id="settings-description">
                        Customize your ApexGrid dashboard appearance and widgets
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4" role="form" aria-label="Dashboard settings">
                    {/* Personalization Settings */}
                    <section className="space-y-4" aria-labelledby="personalization-heading">
                        <h3 id="personalization-heading" className="text-sm font-medium">Personalization</h3>

                        <div className="space-y-2">
                            <label htmlFor="username-input" className="text-sm font-medium">
                                Your Name
                            </label>
                            <p className="text-sm text-muted-foreground" id="username-description">
                                Enter your name to personalize the greeting (max 50 characters, letters, numbers, and spaces only)
                            </p>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Input
                                        id="username-input"
                                        type="text"
                                        placeholder="Enter your name"
                                        value={userNameInput}
                                        onChange={(e) => handleUserNameChange(e.target.value)}
                                        onBlur={handleUserNameSave}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleUserNameSave();
                                            }
                                        }}
                                        aria-describedby="username-description username-error"
                                        aria-label="Your name for personalized greeting"
                                        aria-invalid={userNameError ? 'true' : 'false'}
                                        className={userNameError ? 'border-destructive' : ''}
                                        maxLength={50}
                                    />
                                    {userNameError && (
                                        <p
                                            id="username-error"
                                            className="text-sm text-destructive mt-1"
                                            role="alert"
                                        >
                                            {userNameError}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={handleUserNameSave}
                                    disabled={!!userNameError}
                                    aria-label="Save name"
                                >
                                    Save
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Search Engine
                            </label>
                            <p className="text-sm text-muted-foreground" id="search-engine-description">
                                Choose your preferred search engine for the search bar
                            </p>
                            <div
                                className="space-y-2"
                                role="radiogroup"
                                aria-labelledby="search-engine-label"
                                aria-describedby="search-engine-description"
                            >
                                {SEARCH_ENGINE_OPTIONS.map((option) => (
                                    <label
                                        key={option.value}
                                        className="flex items-center gap-3 p-3 rounded-lg border bg-card cursor-pointer hover:bg-accent/50 transition-colors duration-200"
                                    >
                                        <input
                                            type="radio"
                                            name="search-engine"
                                            value={option.value}
                                            checked={searchEngine === option.value}
                                            onChange={() => handleSearchEngineChange(option.value)}
                                            className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                            aria-label={`Select ${option.label} as search engine`}
                                        />
                                        <span className="text-lg" aria-hidden="true">
                                            {option.icon}
                                        </span>
                                        <span className="text-sm font-medium">
                                            {option.label}
                                        </span>
                                        {searchEngine === option.value && (
                                            <span className="ml-auto text-xs text-primary font-medium">
                                                Selected
                                            </span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Theme Settings */}
                    <section className="space-y-4" aria-labelledby="appearance-heading">
                        <h3 id="appearance-heading" className="text-sm font-medium">Appearance</h3>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <label htmlFor="theme-toggle" className="text-sm font-medium cursor-pointer">
                                    Dark Mode
                                </label>
                                <p className="text-sm text-muted-foreground" id="theme-description">
                                    Toggle between dark and light theme
                                </p>
                            </div>
                            <Switch
                                id="theme-toggle"
                                checked={theme === 'dark'}
                                onCheckedChange={handleThemeToggle}
                                aria-describedby="theme-description"
                                aria-label={`Dark mode is ${theme === 'dark' ? 'enabled' : 'disabled'}`}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="background-input" className="text-sm font-medium">
                                Background
                            </label>
                            <p className="text-sm text-muted-foreground" id="background-description">
                                Enter a color (e.g., #1a1a1a) or image URL
                            </p>
                            <div className="flex gap-2">
                                <Input
                                    id="background-input"
                                    type="text"
                                    placeholder="Color or image URL"
                                    value={backgroundInput}
                                    onChange={(e) => setBackgroundInput(e.target.value)}
                                    onBlur={handleBackgroundChange}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleBackgroundChange();
                                        }
                                    }}
                                    aria-describedby="background-description"
                                    aria-label="Background color or image URL"
                                />
                                <Button
                                    variant="outline"
                                    onClick={handleBackgroundChange}
                                    aria-label="Apply background"
                                >
                                    Apply
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* Widget Settings */}
                    <section className="space-y-4" aria-labelledby="widgets-heading">
                        <h3 id="widgets-heading" className="text-sm font-medium">Widgets</h3>
                        <p className="text-sm text-muted-foreground">
                            Enable or disable widgets on your dashboard
                        </p>

                        <div className="space-y-3" role="list" aria-label="Available widgets">
                            {WIDGET_TYPES.map(({ type, label, description }) => (
                                <div
                                    key={type}
                                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                                    role="listitem"
                                >
                                    <div className="space-y-0.5">
                                        <label
                                            htmlFor={`widget-${type}`}
                                            className="text-sm font-medium cursor-pointer"
                                        >
                                            {label}
                                        </label>
                                        <p className="text-sm text-muted-foreground" id={`widget-${type}-description`}>
                                            {description}
                                        </p>
                                    </div>
                                    <Switch
                                        id={`widget-${type}`}
                                        checked={isWidgetEnabled(type)}
                                        onCheckedChange={(checked: boolean) =>
                                            handleWidgetToggle(type, checked)
                                        }
                                        aria-describedby={`widget-${type}-description`}
                                        aria-label={`${label} widget is ${isWidgetEnabled(type) ? 'enabled' : 'disabled'}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </DialogContent>
        </Dialog >
    );
};
