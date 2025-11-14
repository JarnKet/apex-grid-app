import { useEffect, useState } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';
import { cn } from '../lib/utils';

interface GreetingProps {
    className?: string;
}

/**
 * Get time-based greeting message based on current hour
 */
function getGreetingMessage(): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return 'Good morning';
    } else if (hour >= 12 && hour < 17) {
        return 'Good afternoon';
    } else if (hour >= 17 && hour < 21) {
        return 'Good evening';
    } else {
        return 'Good night';
    }
}

/**
 * Greeting component that displays a time-based personalized greeting
 * Updates every 60 seconds to reflect time changes
 * 
 * Accessibility features:
 * - Uses semantic h1 heading for proper document structure
 * - Includes ARIA live region for screen reader announcements when greeting changes
 * - Provides descriptive text for screen readers
 */
export const Greeting: React.FC<GreetingProps> = ({ className }) => {
    const { userName } = useSettingsStore();
    const [greeting, setGreeting] = useState(getGreetingMessage());

    useEffect(() => {
        // Update greeting immediately
        setGreeting(getGreetingMessage());

        // Set up interval to update greeting every 60 seconds
        const interval = setInterval(() => {
            setGreeting(getGreetingMessage());
        }, 60000);

        // Clean up interval on unmount
        return () => clearInterval(interval);
    }, []);

    // Construct full greeting message for screen readers
    const fullGreeting = userName ? `${greeting}, ${userName}` : greeting;

    return (
        <div className={cn('text-center', className)}>
            <h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-foreground"
                aria-label={`Welcome message: ${fullGreeting}`}
            >
                {greeting}{userName ? `, ${userName}` : ''}
            </h1>
            {/* Live region for screen reader announcements when greeting changes */}
            <div
                className="sr-only"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                {fullGreeting}
            </div>
        </div>
    );
};
