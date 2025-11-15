import { useState, useRef, useEffect, type FormEvent } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';
import { cn } from '../lib/utils';
import { ChevronDown } from 'lucide-react';

/**
 * Search engine configuration interface
 */
interface SearchEngine {
    name: string;
    icon: string;
    searchUrl: (query: string) => string;
}

/**
 * Supported search engines with their configurations
 */
const SEARCH_ENGINES: Record<string, SearchEngine> = {
    google: {
        name: 'Google',
        icon: '🔍',
        searchUrl: (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`
    },
    bing: {
        name: 'Bing',
        icon: '🅱️',
        searchUrl: (q) => `https://www.bing.com/search?q=${encodeURIComponent(q)}`
    },
    duckduckgo: {
        name: 'DuckDuckGo',
        icon: '🦆',
        searchUrl: (q) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`
    },
    yahoo: {
        name: 'Yahoo',
        icon: 'Y!',
        searchUrl: (q) => `https://search.yahoo.com/search?p=${encodeURIComponent(q)}`
    }
};

/**
 * Get time-based greeting message
 */
function getGreetingMessage(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
}

interface SearchBarProps {
    className?: string;
}

/**
 * SearchBar component - Integrated web search with greeting and engine selector
 * 
 * Features:
 * - Personalized greeting in placeholder
 * - Inline search engine selector
 * - Multi-engine support (Google, Bing, DuckDuckGo, Yahoo)
 * - Query validation
 * - Accessible with ARIA labels
 */
export const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
    const { searchEngine, setSearchEngine, userName } = useSettingsStore();
    const [query, setQuery] = useState('');
    const [greeting, setGreeting] = useState(getGreetingMessage());
    const [showEngineMenu, setShowEngineMenu] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Update greeting every minute
    useEffect(() => {
        setGreeting(getGreetingMessage());
        const interval = setInterval(() => {
            setGreeting(getGreetingMessage());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowEngineMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        const engine = SEARCH_ENGINES[searchEngine] || SEARCH_ENGINES.google;
        window.location.href = engine.searchUrl(trimmedQuery);
    };

    const handleEngineChange = async (engine: string) => {
        await setSearchEngine(engine as any);
        setShowEngineMenu(false);
    };

    const currentEngine = SEARCH_ENGINES[searchEngine] || SEARCH_ENGINES.google;
    const placeholderText = userName
        ? `${greeting}, ${userName}! What would you like to search?`
        : `${greeting}! What would you like to search?`;

    return (
        <form
            onSubmit={handleSearch}
            className={cn('w-full max-w-3xl mx-auto', className)}
        >
            <div className="relative">
                {/* Search Engine Selector */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10" ref={menuRef}>
                    <button
                        type="button"
                        onClick={() => setShowEngineMenu(!showEngineMenu)}
                        className={cn(
                            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md',
                            'bg-muted hover:bg-muted/80',
                            'border border-border',
                            'transition-colors duration-200',
                            'text-sm font-medium'
                        )}
                        aria-label={`Current search engine: ${currentEngine.name}. Click to change.`}
                    >
                        <span className="text-base">{currentEngine.icon}</span>
                        <span className="hidden sm:inline text-xs">{currentEngine.name}</span>
                        <ChevronDown className="h-3 w-3" />
                    </button>

                    {/* Dropdown Menu */}
                    {showEngineMenu && (
                        <div className={cn(
                            'absolute top-full left-0 mt-2',
                            'bg-card border border-border rounded-lg shadow-lg',
                            'min-w-[160px] py-1',
                            'animate-in fade-in slide-in-from-top-2 duration-200'
                        )}>
                            {Object.entries(SEARCH_ENGINES).map(([key, engine]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => handleEngineChange(key)}
                                    className={cn(
                                        'w-full flex items-center gap-3 px-3 py-2',
                                        'hover:bg-accent transition-colors',
                                        'text-sm text-left',
                                        searchEngine === key && 'bg-accent'
                                    )}
                                >
                                    <span className="text-base">{engine.icon}</span>
                                    <span>{engine.name}</span>
                                    {searchEngine === key && (
                                        <span className="ml-auto text-xs text-primary">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Search Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholderText}
                    className={cn(
                        'w-full pl-24 sm:pl-32 pr-16 py-3.5 text-base rounded-lg',
                        'bg-card',
                        'border border-border',
                        'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
                        'transition-all duration-200',
                        'placeholder:text-muted-foreground/50',
                        'text-foreground'
                    )}
                    aria-label="Search the web"
                />

                {/* Search Button */}
                <button
                    type="submit"
                    className={cn(
                        'absolute right-2 top-1/2 -translate-y-1/2',
                        'px-4 py-2 rounded-md',
                        'bg-primary text-primary-foreground',
                        'hover:bg-primary/90',
                        'transition-colors duration-200',
                        'font-medium text-sm'
                    )}
                    aria-label="Submit search"
                >
                    Search
                </button>
            </div>
        </form>
    );
};
