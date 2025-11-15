import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import type { WidgetProps } from '../../types/widget';

/**
 * ClockWidget displays the current time and date
 * - Updates every 60 seconds
 * - Uses Intl.DateTimeFormat for localization
 * - Displays time with minute-level precision
 * - Displays date with day, month, and year
 */
const ClockWidgetComponent: React.FC<WidgetProps> = ({ id }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Update time immediately on mount
        setCurrentTime(new Date());

        // Set up interval to update every second
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // 1 second

        // Clean up interval on component unmount
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    // Format time with second-level precision (HH:MM:SS)
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });

    // Format date with day, month, and year
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formattedTime = timeFormatter.format(currentTime);
    const formattedDate = dateFormatter.format(currentTime);

    return (
        <WidgetWrapper id={id} title="Clock">
            <div className="flex flex-col items-center justify-center h-full space-y-2">
                <time
                    className="text-5xl font-bold tracking-tight"
                    dateTime={currentTime.toISOString()}
                    aria-label={`Current time: ${formattedTime}`}
                >
                    {formattedTime}
                </time>
                <time
                    className="text-lg text-muted-foreground"
                    dateTime={currentTime.toISOString().split('T')[0]}
                    aria-label={`Current date: ${formattedDate}`}
                >
                    {formattedDate}
                </time>
            </div>
        </WidgetWrapper>
    );
};

// Memoize component to prevent unnecessary re-renders
export const ClockWidget = React.memo(ClockWidgetComponent);
