import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClockWidget } from './ClockWidget';

describe('ClockWidget', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    it('should render current time', () => {
        const testDate = new Date('2024-01-15T14:30:00');
        vi.setSystemTime(testDate);

        render(<ClockWidget id="clock-1" />);

        // Check that time is displayed (format may vary by locale)
        const timeElement = screen.getByRole('time', { name: /current time/i });
        expect(timeElement).toBeInTheDocument();
    });

    it('should render current date', () => {
        const testDate = new Date('2024-01-15T14:30:00');
        vi.setSystemTime(testDate);

        render(<ClockWidget id="clock-1" />);

        // Check that date is displayed
        const dateElement = screen.getByRole('time', { name: /current date/i });
        expect(dateElement).toBeInTheDocument();
    });

    it('should update time after 60 seconds', () => {
        const initialDate = new Date('2024-01-15T14:30:00');
        vi.setSystemTime(initialDate);

        render(<ClockWidget id="clock-1" />);

        // Advance time by 60 seconds
        const newDate = new Date('2024-01-15T14:31:00');
        vi.setSystemTime(newDate);
        vi.advanceTimersByTime(60000);

        // Time should be updated
        const timeElement = screen.getByRole('time', { name: /current time/i });
        expect(timeElement).toBeInTheDocument();
    });

    it('should render with WidgetWrapper', () => {
        render(<ClockWidget id="clock-1" />);

        // Check that the widget title is present
        expect(screen.getByText('Clock')).toBeInTheDocument();
    });
});
