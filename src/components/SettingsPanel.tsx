import React, { useState } from 'react';
import { Settings, User, Palette, Layout as LayoutIcon, Zap } from 'lucide-react';
import { FaGoogle, FaYahoo, FaSearch } from 'react-icons/fa';
import { SiDuckduckgo } from 'react-icons/si';
import { PresetSelector } from './PresetSelector';
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
import { getAllPatterns, type BackgroundPattern } from '../lib/backgroundPatterns';
import type { LayoutWidth } from '../types/storage';
import { cn } from '../lib/utils';
import { themes } from '../lib/themes';

type SettingsTab = 'personalization' | 'appearance' | 'layout';

interface SettingsPanelProps {
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const SEARCH_ENGINE_OPTIONS = [
    { value: 'google' as const, label: 'Google', icon: <FaGoogle className="h-4 w-4" /> },
    { value: 'bing' as const, label: 'Bing', icon: <FaSearch className="h-4 w-4 text-blue-500" /> },
    { value: 'duckduckgo' as const, label: 'DuckDuckGo', icon: <SiDuckduckgo className="h-4 w-4" /> },
    { value: 'yahoo' as const, label: 'Yahoo', icon: <FaYahoo className="h-4 w-4" /> },
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
    isOpen: controlledIsOpen,
    onOpenChange: controlledOnOpenChange
}) => {
    const {
        theme,
        themeId,
        background,
        backgroundPattern,
        layoutWidth,
        userName,
        searchEngine,
        setTheme,
        setThemeId,
        setBackground,
        setBackgroundPattern,
        setLayoutWidth,
        setUserName,
        setSearchEngine
    } = useSettingsStore();

    const [activeTab, setActiveTab] = useState<SettingsTab>('personalization');
    const [backgroundMode, setBackgroundMode] = useState<'preset' | 'custom'>(
        background ? 'custom' : 'preset'
    );
    const [backgroundInput, setBackgroundInput] = useState(background || '');
    const [userNameInput, setUserNameInput] = useState(userName || '');
    const [userNameError, setUserNameError] = useState<string | null>(null);
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    const patterns = getAllPatterns();
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
    const setIsOpen = controlledOnOpenChange || setInternalIsOpen;

    const tabs = [
        { id: 'personalization' as const, label: 'Personalization', icon: User },
        { id: 'appearance' as const, label: 'Appearance', icon: Palette },
        { id: 'layout' as const, label: 'Layout', icon: LayoutIcon },
    ];

    const handleThemeToggle = async (checked: boolean) => {
        try {
            await setTheme(checked ? 'dark' : 'light');
        } catch (error) {
            console.error('Failed to update theme:', error);
        }
    };

    const handleBackgroundModeChange = async (mode: 'preset' | 'custom') => {
        setBackgroundMode(mode);
        if (mode === 'preset') {
            // Clear custom background when switching to preset
            await setBackground(null);
            setBackgroundInput('');
        }
    };

    const handleBackgroundChange = async () => {
        try {
            const value = backgroundInput.trim() || null;
            await setBackground(value);
        } catch (error) {
            console.error('Failed to update background:', error);
        }
    };

    const handlePatternChange = async (pattern: BackgroundPattern) => {
        try {
            await setBackgroundPattern(pattern);
        } catch (error) {
            console.error('Failed to update background pattern:', error);
        }
    };

    const handleLayoutWidthChange = async (width: LayoutWidth) => {
        try {
            await setLayoutWidth(width);
        } catch (error) {
            console.error('Failed to update layout width:', error);
        }
    };

    const validateUserName = (name: string): string | null => {
        if (name.length > 50) return 'Name must be 50 characters or less';
        if (name && !/^[a-zA-Z0-9\s]*$/.test(name)) {
            return 'Name can only contain letters, numbers, and spaces';
        }
        return null;
    };

    const handleUserNameChange = (value: string) => {
        setUserNameInput(value);
        setUserNameError(validateUserName(value));
    };

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

    const handleSearchEngineChange = async (engine: 'google' | 'bing' | 'duckduckgo' | 'yahoo') => {
        try {
            await setSearchEngine(engine);
        } catch (error) {
            console.error('Failed to update search engine:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="fixed top-4 right-4 z-40"
                    aria-label="Open settings"
                >
                    <Settings className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-[90vw] h-[90vh] max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Customize your ApexGrid dashboard
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-1 overflow-hidden">
                    {/* Tabs Sidebar */}
                    <div className="w-48 border-r border-border pr-4 flex-shrink-0">
                        <nav className="space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                            activeTab === tab.id
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto pl-6 settings-scrollbar">
                        {activeTab === 'personalization' && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="username-input" className="text-sm font-medium">
                                        Your Name
                                    </label>
                                    <p className="text-sm text-muted-foreground">
                                        Personalize your greeting
                                    </p>
                                    <div className="flex gap-2">
                                        <Input
                                            id="username-input"
                                            type="text"
                                            placeholder="Enter your name"
                                            value={userNameInput}
                                            onChange={(e) => handleUserNameChange(e.target.value)}
                                            onBlur={handleUserNameSave}
                                            onKeyDown={(e) => e.key === 'Enter' && handleUserNameSave()}
                                            className={userNameError ? 'border-destructive' : ''}
                                            maxLength={50}
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={handleUserNameSave}
                                            disabled={!!userNameError}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                    {userNameError && (
                                        <p className="text-sm text-destructive">{userNameError}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Search Engine</label>
                                    <p className="text-sm text-muted-foreground">
                                        Default search engine for the search bar
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {SEARCH_ENGINE_OPTIONS.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => handleSearchEngineChange(option.value)}
                                                className={cn(
                                                    'flex items-center gap-3 p-3 rounded-lg border-2 transition-all',
                                                    searchEngine === option.value
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-border hover:border-primary/50'
                                                )}
                                            >
                                                {option.icon}
                                                <span className="text-sm font-medium">{option.label}</span>
                                                {searchEngine === option.value && (
                                                    <span className="ml-auto text-primary">✓</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">Theme</label>
                                    <p className="text-sm text-muted-foreground">
                                        Choose your preferred color theme
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {themes.map((themeOption) => (
                                            <button
                                                key={themeOption.id}
                                                onClick={() => setThemeId(themeOption.id)}
                                                className={cn(
                                                    'relative p-4 rounded-lg border-2 transition-all text-left',
                                                    themeId === themeOption.id
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-border hover:border-primary/50'
                                                )}
                                            >
                                                <div className="flex gap-2 mb-2">
                                                    <div
                                                        className="w-6 h-6 rounded border"
                                                        style={{
                                                            backgroundColor: themeOption.colors.light['--primary'],
                                                        }}
                                                    />
                                                    <div
                                                        className="w-6 h-6 rounded border"
                                                        style={{
                                                            backgroundColor: themeOption.colors.dark['--primary'],
                                                        }}
                                                    />
                                                </div>
                                                <div className="text-sm font-medium">{themeOption.name}</div>
                                                <div className="text-xs text-muted-foreground">{themeOption.description}</div>
                                                {themeId === themeOption.id && (
                                                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium">Dark Mode</label>
                                        <p className="text-sm text-muted-foreground">
                                            Toggle between dark and light theme
                                        </p>
                                    </div>
                                    <Switch
                                        checked={theme === 'dark'}
                                        onCheckedChange={handleThemeToggle}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium">Background</label>
                                    <p className="text-sm text-muted-foreground">
                                        Choose between preset patterns or custom background
                                    </p>

                                    {/* Background Mode Toggle */}
                                    <div className="flex gap-2 p-1 bg-muted rounded-lg">
                                        <button
                                            onClick={() => handleBackgroundModeChange('preset')}
                                            className={cn(
                                                'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                                                backgroundMode === 'preset'
                                                    ? 'bg-background shadow-sm'
                                                    : 'hover:bg-background/50'
                                            )}
                                        >
                                            Preset Patterns
                                        </button>
                                        <button
                                            onClick={() => handleBackgroundModeChange('custom')}
                                            className={cn(
                                                'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                                                backgroundMode === 'custom'
                                                    ? 'bg-background shadow-sm'
                                                    : 'hover:bg-background/50'
                                            )}
                                        >
                                            Custom
                                        </button>
                                    </div>

                                    {backgroundMode === 'preset' ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            {patterns.map((pattern) => (
                                                <button
                                                    key={pattern.id}
                                                    onClick={() => handlePatternChange(pattern.id)}
                                                    className={cn(
                                                        'relative p-4 rounded-lg border-2 transition-all',
                                                        backgroundPattern === pattern.id
                                                            ? 'border-primary bg-primary/10'
                                                            : 'border-border hover:border-primary/50'
                                                    )}
                                                >
                                                    <div
                                                        className="h-16 rounded mb-2"
                                                        style={{
                                                            backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
                                                            ...pattern.getStyle(theme === 'dark')
                                                        }}
                                                    />
                                                    <div className="text-xs font-medium">{pattern.name}</div>
                                                    <div className="text-xs text-muted-foreground">{pattern.description}</div>
                                                    {backgroundPattern === pattern.id && (
                                                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <p className="text-xs text-muted-foreground">
                                                Enter a color (e.g., #1a1a1a) or image URL
                                            </p>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="text"
                                                    placeholder="Color or image URL"
                                                    value={backgroundInput}
                                                    onChange={(e) => setBackgroundInput(e.target.value)}
                                                    onBlur={handleBackgroundChange}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleBackgroundChange()}
                                                />
                                                <Button variant="outline" onClick={handleBackgroundChange}>
                                                    Apply
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'layout' && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Zap className="h-4 w-4" />
                                        Dashboard Presets
                                    </label>
                                    <p className="text-sm text-muted-foreground">
                                        Quick-apply optimized layouts for different workflows
                                    </p>
                                    <PresetSelector />
                                </div>

                                <div className="border-t border-border pt-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Layout Width</label>
                                        <p className="text-sm text-muted-foreground">
                                            Choose how wide the dashboard should be
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { value: 'compact' as LayoutWidth, label: 'Compact', desc: '1024px max' },
                                                { value: 'standard' as LayoutWidth, label: 'Standard', desc: '1280px max' },
                                                { value: 'wide' as LayoutWidth, label: 'Wide', desc: '1600px max' },
                                                { value: 'full' as LayoutWidth, label: 'Full Width', desc: 'Full screen' },
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => handleLayoutWidthChange(option.value)}
                                                    className={cn(
                                                        'relative p-3 rounded-lg border-2 transition-all text-left',
                                                        layoutWidth === option.value
                                                            ? 'border-primary bg-primary/10'
                                                            : 'border-border hover:border-primary/50'
                                                    )}
                                                >
                                                    <div className="text-sm font-medium">{option.label}</div>
                                                    <div className="text-xs text-muted-foreground">{option.desc}</div>
                                                    {layoutWidth === option.value && (
                                                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
