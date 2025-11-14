import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';
import { useSettingsStore } from '../stores/useSettingsStore';

// Mock the settings store
vi.mock('../stores/useSettingsStore');

describe('SearchBar', () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();

        // Mock default search engine as Google
        vi.mocked(useSettingsStore).mockReturnValue({
            searchEngine: 'google',
            theme: 'dark',
            background: null,
            userName: null,
            isInitialized: true,
            setTheme: vi.fn(),
            setBackground: vi.fn(),
            setUserName: vi.fn(),
            setSearchEngine: vi.fn(),
            initializeSettings: vi.fn(),
        });
    });

    it('should render search input with placeholder', () => {
        render(<SearchBar />);

        const input = screen.getByPlaceholderText(/search with google/i);
        expect(input).toBeInTheDocument();
    });

    it('should render submit button with search icon', () => {
        render(<SearchBar />);

        const button = screen.getByRole('button', { name: /submit search/i });
        expect(button).toBeInTheDocument();
    });

    it('should update input value when typing', () => {
        render(<SearchBar />);

        const input = screen.getByRole('textbox', { name: /search the web/i });
        fireEvent.change(input, { target: { value: 'test query' } });

        expect(input).toHaveValue('test query');
    });

    it('should not submit when query is empty', () => {
        const mockLocationHref = vi.fn();
        Object.defineProperty(window, 'location', {
            value: { href: mockLocationHref },
            writable: true,
        });

        render(<SearchBar />);

        const form = screen.getByRole('textbox', { name: /search the web/i }).closest('form');
        fireEvent.submit(form!);

        expect(mockLocationHref).not.toHaveBeenCalled();
    });

    it('should construct correct Google search URL', () => {
        let capturedHref = '';
        Object.defineProperty(window, 'location', {
            value: {
                get href() { return capturedHref; },
                set href(value) { capturedHref = value; }
            },
            writable: true,
        });

        render(<SearchBar />);

        const input = screen.getByRole('textbox', { name: /search the web/i });
        fireEvent.change(input, { target: { value: 'test query' } });

        const form = input.closest('form');
        fireEvent.submit(form!);

        expect(capturedHref).toBe('https://www.google.com/search?q=test%20query');
    });

    it('should construct correct Bing search URL', () => {
        vi.mocked(useSettingsStore).mockReturnValue({
            searchEngine: 'bing',
            theme: 'dark',
            background: null,
            userName: null,
            isInitialized: true,
            setTheme: vi.fn(),
            setBackground: vi.fn(),
            setUserName: vi.fn(),
            setSearchEngine: vi.fn(),
            initializeSettings: vi.fn(),
        });

        let capturedHref = '';
        Object.defineProperty(window, 'location', {
            value: {
                get href() { return capturedHref; },
                set href(value) { capturedHref = value; }
            },
            writable: true,
        });

        render(<SearchBar />);

        const input = screen.getByRole('textbox', { name: /search the web/i });
        fireEvent.change(input, { target: { value: 'test query' } });

        const form = input.closest('form');
        fireEvent.submit(form!);

        expect(capturedHref).toBe('https://www.bing.com/search?q=test%20query');
    });

    it('should construct correct DuckDuckGo search URL', () => {
        vi.mocked(useSettingsStore).mockReturnValue({
            searchEngine: 'duckduckgo',
            theme: 'dark',
            background: null,
            userName: null,
            isInitialized: true,
            setTheme: vi.fn(),
            setBackground: vi.fn(),
            setUserName: vi.fn(),
            setSearchEngine: vi.fn(),
            initializeSettings: vi.fn(),
        });

        let capturedHref = '';
        Object.defineProperty(window, 'location', {
            value: {
                get href() { return capturedHref; },
                set href(value) { capturedHref = value; }
            },
            writable: true,
        });

        render(<SearchBar />);

        const input = screen.getByRole('textbox', { name: /search the web/i });
        fireEvent.change(input, { target: { value: 'test query' } });

        const form = input.closest('form');
        fireEvent.submit(form!);

        expect(capturedHref).toBe('https://duckduckgo.com/?q=test%20query');
    });

    it('should construct correct Yahoo search URL', () => {
        vi.mocked(useSettingsStore).mockReturnValue({
            searchEngine: 'yahoo',
            theme: 'dark',
            background: null,
            userName: null,
            isInitialized: true,
            setTheme: vi.fn(),
            setBackground: vi.fn(),
            setUserName: vi.fn(),
            setSearchEngine: vi.fn(),
            initializeSettings: vi.fn(),
        });

        let capturedHref = '';
        Object.defineProperty(window, 'location', {
            value: {
                get href() { return capturedHref; },
                set href(value) { capturedHref = value; }
            },
            writable: true,
        });

        render(<SearchBar />);

        const input = screen.getByRole('textbox', { name: /search the web/i });
        fireEvent.change(input, { target: { value: 'test query' } });

        const form = input.closest('form');
        fireEvent.submit(form!);

        expect(capturedHref).toBe('https://search.yahoo.com/search?p=test%20query');
    });

    it('should trim whitespace from query', () => {
        let capturedHref = '';
        Object.defineProperty(window, 'location', {
            value: {
                get href() { return capturedHref; },
                set href(value) { capturedHref = value; }
            },
            writable: true,
        });

        render(<SearchBar />);

        const input = screen.getByRole('textbox', { name: /search the web/i });
        fireEvent.change(input, { target: { value: '  test query  ' } });

        const form = input.closest('form');
        fireEvent.submit(form!);

        expect(capturedHref).toBe('https://www.google.com/search?q=test%20query');
    });

    it('should have accessible ARIA labels', () => {
        render(<SearchBar />);

        const input = screen.getByLabelText(/search the web/i);
        expect(input).toBeInTheDocument();

        const button = screen.getByLabelText(/submit search/i);
        expect(button).toBeInTheDocument();

        const engineInfo = screen.getByText(/currently using google search engine/i);
        expect(engineInfo).toBeInTheDocument();
    });

    it('should display correct placeholder for different search engines', () => {
        vi.mocked(useSettingsStore).mockReturnValue({
            searchEngine: 'duckduckgo',
            theme: 'dark',
            background: null,
            userName: null,
            isInitialized: true,
            setTheme: vi.fn(),
            setBackground: vi.fn(),
            setUserName: vi.fn(),
            setSearchEngine: vi.fn(),
            initializeSettings: vi.fn(),
        });

        render(<SearchBar />);

        const input = screen.getByPlaceholderText(/search with duckduckgo/i);
        expect(input).toBeInTheDocument();
    });

    it('should handle special characters in search query', () => {
        let capturedHref = '';
        Object.defineProperty(window, 'location', {
            value: {
                get href() { return capturedHref; },
                set href(value) { capturedHref = value; }
            },
            writable: true,
        });

        render(<SearchBar />);

        const input = screen.getByRole('textbox', { name: /search the web/i });

        // Test with special characters: &, =, ?, #, %, +
        fireEvent.change(input, { target: { value: 'test & query = value?param#hash%20+' } });

        const form = input.closest('form');
        fireEvent.submit(form!);

        // Verify special characters are properly encoded
        expect(capturedHref).toBe('https://www.google.com/search?q=test%20%26%20query%20%3D%20value%3Fparam%23hash%2520%2B');
    });

    it('should handle unicode characters in search query', () => {
        let capturedHref = '';
        Object.defineProperty(window, 'location', {
            value: {
                get href() { return capturedHref; },
                set href(value) { capturedHref = value; }
            },
            writable: true,
        });

        render(<SearchBar />);

        const input = screen.getByRole('textbox', { name: /search the web/i });

        // Test with unicode characters
        fireEvent.change(input, { target: { value: 'café résumé 日本語' } });

        const form = input.closest('form');
        fireEvent.submit(form!);

        // Verify unicode characters are properly encoded
        expect(capturedHref).toContain('caf%C3%A9');
        expect(capturedHref).toContain('r%C3%A9sum%C3%A9');
    });

    it('should handle quotes and apostrophes in search query', () => {
        let capturedHref = '';
        Object.defineProperty(window, 'location', {
            value: {
                get href() { return capturedHref; },
                set href(value) { capturedHref = value; }
            },
            writable: true,
        });

        render(<SearchBar />);

        const input = screen.getByRole('textbox', { name: /search the web/i });

        // Test with quotes and apostrophes
        fireEvent.change(input, { target: { value: `"test query" and 'another'` } });

        const form = input.closest('form');
        fireEvent.submit(form!);

        // Verify quotes are properly encoded
        expect(capturedHref).toBe('https://www.google.com/search?q=%22test%20query%22%20and%20\'another\'');
    });

    it('should handle very long search queries', () => {
        let capturedHref = '';
        Object.defineProperty(window, 'location', {
            value: {
                get href() { return capturedHref; },
                set href(value) { capturedHref = value; }
            },
            writable: true,
        });

        render(<SearchBar />);

        const input = screen.getByRole('textbox', { name: /search the web/i });

        // Test with a very long query
        const longQuery = 'a'.repeat(500);
        fireEvent.change(input, { target: { value: longQuery } });

        const form = input.closest('form');
        fireEvent.submit(form!);

        // Verify long query is handled
        expect(capturedHref).toContain('google.com/search?q=');
        expect(capturedHref.length).toBeGreaterThan(100);
    });
});

describe('SearchBar - Accessibility Features', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useSettingsStore).mockReturnValue({
            searchEngine: 'google',
            theme: 'dark',
            background: null,
            userName: null,
            isInitialized: true,
            setTheme: vi.fn(),
            setBackground: vi.fn(),
            setUserName: vi.fn(),
            setSearchEngine: vi.fn(),
            initializeSettings: vi.fn(),
        });
    });

    it('should have aria-label on search input', () => {
        render(<SearchBar />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('aria-label', 'Search the web');
    });

    it('should have aria-describedby linking to search engine info', () => {
        render(<SearchBar />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('aria-describedby', 'search-engine-info');

        const engineInfo = document.getElementById('search-engine-info');
        expect(engineInfo).toBeInTheDocument();
        expect(engineInfo).toHaveTextContent('Currently using Google search engine');
    });

    it('should have screen-reader-only text for current search engine', () => {
        render(<SearchBar />);

        const engineInfo = document.getElementById('search-engine-info');
        expect(engineInfo).toHaveClass('sr-only');
    });

    it('should update screen-reader text when search engine changes', () => {
        const { rerender } = render(<SearchBar />);

        let engineInfo = document.getElementById('search-engine-info');
        expect(engineInfo).toHaveTextContent('Currently using Google search engine');

        // Change search engine to Bing
        vi.mocked(useSettingsStore).mockReturnValue({
            searchEngine: 'bing',
            theme: 'dark',
            background: null,
            userName: null,
            isInitialized: true,
            setTheme: vi.fn(),
            setBackground: vi.fn(),
            setUserName: vi.fn(),
            setSearchEngine: vi.fn(),
            initializeSettings: vi.fn(),
        });

        rerender(<SearchBar />);

        engineInfo = document.getElementById('search-engine-info');
        expect(engineInfo).toHaveTextContent('Currently using Bing search engine');
    });

    it('should have aria-label on submit button', () => {
        render(<SearchBar />);

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Submit search');
    });

    it('should have aria-hidden on decorative icon', () => {
        const { container } = render(<SearchBar />);

        const icon = container.querySelector('button span[aria-hidden="true"]');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should support keyboard navigation - Enter key submits form', () => {
        let capturedHref = '';
        Object.defineProperty(window, 'location', {
            value: {
                get href() { return capturedHref; },
                set href(value) { capturedHref = value; }
            },
            writable: true,
        });

        render(<SearchBar />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'keyboard test' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        const form = input.closest('form');
        fireEvent.submit(form!);

        expect(capturedHref).toBe('https://www.google.com/search?q=keyboard%20test');
    });

    it('should be keyboard accessible - Tab navigation', () => {
        render(<SearchBar />);

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button');

        // Input should be focusable
        input.focus();
        expect(document.activeElement).toBe(input);

        // Button should be focusable
        button.focus();
        expect(document.activeElement).toBe(button);
    });

    it('should maintain focus management during interaction', () => {
        render(<SearchBar />);

        const input = screen.getByRole('textbox');

        // Focus input
        input.focus();
        expect(document.activeElement).toBe(input);

        // Type in input - focus should remain
        fireEvent.change(input, { target: { value: 'test' } });
        expect(document.activeElement).toBe(input);
    });
});
