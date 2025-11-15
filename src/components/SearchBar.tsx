import { useState, useRef, type FormEvent } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';
import { cn } from '../lib/utils';

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

interface SearchBarProps {
    className?: string;
}

/**
 * SearchBar component - Integrated web search with glassmorphism styling
 * 
 * Features:
 * - Multi-engine support (Google, Bing, DuckDuckGo, Yahoo)
 * - Glassmorphism design with backdrop blur
 * - Query validation
 * - Accessible with ARIA labels
 */
export const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
    const { searchEngine } = useSettingsStore();
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    /**
     * Handle search form submission
     * Validates query and navigates to search results
     */
    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate query is not empty
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            return;
        }

        // Get search engine configuration
        const engine = SEARCH_ENGINES[searchEngine] || SEARCH_ENGINES.google;
        const searchUrl = engine.searchUrl(trimmedQuery);

        // Navigate to search results
        window.location.href = searchUrl;
    };

    // Get current search engine info
    const currentEngine = SEARCH_ENGINES[searchEngine] || SEARCH_ENGINES.google;

    return (
        <form
            onSubmit={handleSearch}
            className={cn('w-full max-w-2xl mx-auto', className)}
        >
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Search with ${currentEngine.name}...`}
                    className={cn(
                        'w-full px-4 sm:px-6 py-3 sm:py-4 pr-20 sm:pr-24 text-base rounded-lg',
                        'bg-card',
                        'border border-border',
                        'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50',
                        'transition-all duration-200',
                        'placeholder:text-muted-foreground/60',
                        'text-foreground'
                    )}
                    aria-label="Search the web"
                    aria-describedby="search-engine-info"
                />
                <button
                    type="submit"
                    className={cn(
                        'absolute right-2 top-1/2 -translate-y-1/2',
                        'px-4 sm:px-6 py-2 rounded-md',
                        'bg-primary text-primary-foreground',
                        'hover:bg-primary/90',
                        'transition-colors duration-200',
                        'font-medium text-sm',
                        'flex items-center gap-2'
                    )}
                    aria-label="Submit search"
                >
                    <span className="text-base sm:text-lg" aria-hidden="true">
                        {currentEngine.icon}
                    </span>
                </button>
                {/* Screen reader only info about current search engine */}
                <div id="search-engine-info" className="sr-only">
                    Currently using {currentEngine.name} search engine
                </div>
            </div>
        </form>
    );
};
