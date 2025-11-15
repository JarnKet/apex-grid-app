import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { Calendar } from 'lucide-react';
import type { WidgetProps } from '../../types/widget';
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    isSameDay,
    isSameMonth,
    addMonths,
    subMonths,
} from 'date-fns';

/**
 * CalendarWidget displays a monthly calendar with navigation
 * - Shows current month with all dates
 * - Highlights current date
 * - Supports previous/next month navigation
 * - Auto-updates when date changes
 */
const CalendarWidgetComponent: React.FC<WidgetProps> = ({ id }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [displayMonth, setDisplayMonth] = useState(new Date());

    // Update current date at midnight
    useEffect(() => {
        const now = new Date();
        const msUntilMidnight = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1,
            0, 0, 0
        ).getTime() - now.getTime();

        const timeoutId = setTimeout(() => {
            setCurrentDate(new Date());
            // Set up daily interval
            const intervalId = setInterval(() => {
                setCurrentDate(new Date());
            }, 24 * 60 * 60 * 1000);

            return () => clearInterval(intervalId);
        }, msUntilMidnight);

        return () => clearTimeout(timeoutId);
    }, []);

    // Calculate calendar days
    const monthStart = startOfMonth(displayMonth);
    const monthEnd = endOfMonth(displayMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd,
    });

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const handlePreviousMonth = () => {
        setDisplayMonth(prev => subMonths(prev, 1));
    };

    const handleNextMonth = () => {
        setDisplayMonth(prev => addMonths(prev, 1));
    };

    return (
        <WidgetWrapper id={id} title="Calendar" icon={<Calendar className="h-4 w-4" />}>
            <div className="flex flex-col h-full p-2">
                {/* Month header with navigation */}
                <nav
                    className="flex items-center justify-between mb-3"
                    aria-label="Calendar navigation"
                >
                    <button
                        onClick={handlePreviousMonth}
                        className="p-1 hover:bg-accent rounded transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        aria-label="Previous month"
                        title="Previous month"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <h3
                        className="text-lg font-semibold"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {format(displayMonth, 'MMMM yyyy')}
                    </h3>
                    <button
                        onClick={handleNextMonth}
                        className="p-1 hover:bg-accent rounded transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        aria-label="Next month"
                        title="Next month"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </nav>

                {/* Day of week labels */}
                <div
                    className="grid grid-cols-7 gap-1 mb-2"
                    role="row"
                    aria-label="Days of the week"
                >
                    {dayLabels.map(day => (
                        <div
                            key={day}
                            className="text-center text-xs font-medium text-muted-foreground"
                            role="columnheader"
                            aria-label={day}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div
                    className="grid grid-cols-7 gap-1 flex-1"
                    role="grid"
                    aria-label={`Calendar for ${format(displayMonth, 'MMMM yyyy')}`}
                >
                    {calendarDays.map(day => {
                        const isToday = isSameDay(day, currentDate);
                        const isCurrentMonth = isSameMonth(day, displayMonth);
                        const dateString = format(day, 'MMMM d, yyyy');

                        return (
                            <div
                                key={day.toISOString()}
                                className={`
                                    flex items-center justify-center
                                    text-sm rounded
                                    ${isToday
                                        ? 'bg-primary text-primary-foreground font-bold'
                                        : isCurrentMonth
                                            ? 'text-foreground'
                                            : 'text-muted-foreground/40'
                                    }
                                `}
                                role="gridcell"
                                aria-label={isToday ? `Today, ${dateString}` : dateString}
                                aria-current={isToday ? 'date' : undefined}
                            >
                                {format(day, 'd')}
                            </div>
                        );
                    })}
                </div>
            </div>
        </WidgetWrapper>
    );
};

// Memoize component to prevent unnecessary re-renders
export const CalendarWidget = React.memo(CalendarWidgetComponent);
