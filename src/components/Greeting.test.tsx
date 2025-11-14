import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { Greeting } from './Greeting';
import { useSettingsStore } from '../stores/useSettingsStore';

// Mock the settings store
vi.mock('../stores/useSettingsStore');

describe('Greeting Component - Time-based Messages', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.mocked(useSettingsStore).mockReturnValue({
            userName: null,
        } as any);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('should display "Good morning" between 5 AM and 11:59 AM', () => {
        // Test at 5 AM
        vi.setSystemTime(new Date('2024-01-01T05:00:00'));
        const { rerender } = render(<Greeting />);
        expect(screen.getByRole('heading')).toHaveTextContent('Good morning');

        // Test at 10 AM
        vi.setSystemTime(new Date('2024-01-01T10:00:00'));
        rerender(<Greeting />);
        expect(screen.getByRole('heading')).toHaveTextContent('Good morning');

        // Test at 11:59 AM
        vi.setSystemTime(new Date('2024-01-01T11:59:00'));
        rerender(<Greeting />);
        expect(screen.getByRole('heading')).toHaveTextContent('Good morning');
    });

    it('should display "Good afternoon" between 12 PM and 4:59 PM', () => {
        // Test at 12 PM
        vi.setSystemTime(new Date('2024-01-01T12:00:00'));
        const { rerender } = render(<Greeting />);
        expect(screen.getByRole('heading')).toHaveTextContent('Good afternoon');

        // Test at 2 PM
        vi.setSystemTime(new Date('2024-01-01T14:00:00'));
        rerender(<Greeting />);
        expect(screen.getByRole('heading')).toHaveTextContent('Good afternoon');

        // Test at 4:59 PM
        vi.setSystemTime(new Date('2024-01-01T16:59:00'));
        rerender(<Greeting />);
        expect(screen.getByRole('heading')).toHaveTextContent('Good afternoon');
    });

    it('should display "Good evening" between 5 PM and 8:59 PM', () => {
        // Test at 5 PM
        vi.setSystemTime(new Date('2024-01-01T17:00:00'));
        const { rerender } = render(<Greeting />);
        expect(screen.getByRole('heading')).toHaveTextContent('Good evening');

        // Test at 6 PM
        vi.setSystemTime(new Date('2024-01-01T18:00:00'));
        rerender(<Greeting />);
        expect(screen.getByRole('heading')).toHaveTextContent('Good evening');

        // Test at 8:59 PM
        vi.setSystemTime(new Date('2024-01-01T20:59:00'));
        rerender(<Greeting />);
        expect(screen.getByRole('heading')).toHaveTextContent('Good evening');
    });

    it('should display "Good night" between 9 PM and 4:59 AM', () => {
        // Test at 9 PM
        vi.setSystemTime(new Date('2024-01-01T21:00:00'));
        const { rerender } = render(<Greeting />);
        expect(screen.getByRole('heading')).toHaveTextContent('Good night');

        // Test at midnight
        vi.setSystemTime(new Date('2024-01-01T00:00:00'));
        rerender(<Greeting />);
        expect(screen.getByRole('heading')).toHaveTextContent('Good night');

        // Test at 4:59 AM
        vi.setSystemTime(new Date('2024-01-01T04:59:00'));
        rerender(<Greeting />);
        expect(screen.getByRole('heading')).toHaveTextContent('Good night');
    });

    it('should update greeting when time period changes', async () => {
        // Start at morning (10 AM)
        vi.setSystemTime(new Date('2024-01-01T10:00:00'));
        const { unmount } = render(<Greeting />);
        expect(screen.getByRole('heading')).toHaveTextContent('Good morning');

        // Unmount and remount at afternoon time to simulate time passing
        unmount();

        // Change time to afternoon (2 PM)
        vi.setSystemTime(new Date('2024-01-01T14:00:00'));

        // Re-render component at new time
        render(<Greeting />);

        // Should now show afternoon greeting
        expect(screen.getByRole('heading')).toHaveTextContent('Good afternoon');
    });
});

describe('Greeting Component - User Name Display', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2024-01-01T10:00:00')); // Morning
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('should display greeting without name when userName is null', () => {
        vi.mocked(useSettingsStore).mockReturnValue({
            userName: null,
        } as any);

        render(<Greeting />);
        const heading = screen.getByRole('heading');

        expect(heading).toHaveTextContent('Good morning');
        expect(heading).not.toHaveTextContent(',');
    });

    it('should display greeting with name when userName is provided', () => {
        vi.mocked(useSettingsStore).mockReturnValue({
            userName: 'John',
        } as any);

        render(<Greeting />);
        const heading = screen.getByRole('heading');

        expect(heading).toHaveTextContent('Good morning, John');
    });

    it('should display greeting with different names', () => {
        vi.mocked(useSettingsStore).mockReturnValue({
            userName: 'Alice',
        } as any);

        const { rerender } = render(<Greeting />);
        expect(screen.getByRole('heading')).toHaveTextContent('Good morning, Alice');

        // Change to different name
        vi.mocked(useSettingsStore).mockReturnValue({
            userName: 'Bob',
        } as any);

        rerender(<Greeting />);
        expect(screen.getByRole('heading')).toHaveTextContent('Good morning, Bob');
    });

    it('should handle empty string userName as no name', () => {
        vi.mocked(useSettingsStore).mockReturnValue({
            userName: '',
        } as any);

        render(<Greeting />);
        const heading = screen.getByRole('heading');

        // Empty string should be treated as falsy, showing no comma
        expect(heading.textContent).toBe('Good morning');
    });
});

describe('Greeting Component - Accessibility', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('should use h1 heading for proper document hierarchy', () => {
        vi.mocked(useSettingsStore).mockReturnValue({
            userName: null,
        } as any);

        const { container } = render(<Greeting />);
        const heading = container.querySelector('h1');

        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent(/Good (morning|afternoon|evening|night)/);
    });

    it('should have aria-label on heading with full greeting message', () => {
        vi.mocked(useSettingsStore).mockReturnValue({
            userName: 'John',
        } as any);

        // Set time to morning (10 AM)
        vi.setSystemTime(new Date('2024-01-01T10:00:00'));

        render(<Greeting />);
        const heading = screen.getByRole('heading', { level: 1 });

        expect(heading).toHaveAttribute('aria-label', 'Welcome message: Good morning, John');
    });

    it('should have aria-label without name when userName is null', () => {
        vi.mocked(useSettingsStore).mockReturnValue({
            userName: null,
        } as any);

        // Set time to afternoon (2 PM)
        vi.setSystemTime(new Date('2024-01-01T14:00:00'));

        render(<Greeting />);
        const heading = screen.getByRole('heading', { level: 1 });

        expect(heading).toHaveAttribute('aria-label', 'Welcome message: Good afternoon');
    });

    it('should have live region for screen reader announcements', () => {
        vi.mocked(useSettingsStore).mockReturnValue({
            userName: 'Jane',
        } as any);

        // Set time to evening (6 PM)
        vi.setSystemTime(new Date('2024-01-01T18:00:00'));

        const { container } = render(<Greeting />);

        // Find the live region
        const liveRegion = container.querySelector('[role="status"][aria-live="polite"]');

        expect(liveRegion).toBeInTheDocument();
        expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
        expect(liveRegion).toHaveClass('sr-only');
        expect(liveRegion).toHaveTextContent('Good evening, Jane');
    });

    it('should have screen-reader-only class on live region', () => {
        vi.mocked(useSettingsStore).mockReturnValue({
            userName: null,
        } as any);

        const { container } = render(<Greeting />);
        const liveRegion = container.querySelector('[role="status"]');

        expect(liveRegion).toHaveClass('sr-only');
    });
});
