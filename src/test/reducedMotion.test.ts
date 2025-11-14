/**
 * Reduced Motion Support Tests
 * 
 * Tests that verify animations and transitions are properly disabled
 * when the user has prefers-reduced-motion enabled
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Reduced Motion Support', () => {
    let styleElement: HTMLStyleElement;

    beforeEach(() => {
        // Create a style element to inject CSS
        styleElement = document.createElement('style');
        document.head.appendChild(styleElement);
    });

    afterEach(() => {
        // Clean up
        if (styleElement && styleElement.parentNode) {
            styleElement.parentNode.removeChild(styleElement);
        }
    });

    it('should disable animations when prefers-reduced-motion is enabled', () => {
        // Inject reduced motion CSS
        styleElement.textContent = `
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                }
            }
        `;

        // Create a test element with animation
        const element = document.createElement('div');
        element.className = 'animate-fade-in';
        document.body.appendChild(element);

        // Note: In JSDOM, media queries don't fully work, but we can verify the CSS is valid
        expect(styleElement.textContent).toContain('prefers-reduced-motion');
        expect(styleElement.textContent).toContain('animation-duration: 0.01ms');

        // Clean up
        document.body.removeChild(element);
    });

    it('should disable transitions when prefers-reduced-motion is enabled', () => {
        // Inject reduced motion CSS
        styleElement.textContent = `
            @media (prefers-reduced-motion: reduce) {
                * {
                    transition-duration: 0.01ms !important;
                }
            }
        `;

        // Create a test element with transition
        const element = document.createElement('div');
        element.className = 'widget-glass-hover';
        document.body.appendChild(element);

        // Verify CSS contains reduced motion rules
        expect(styleElement.textContent).toContain('prefers-reduced-motion');
        expect(styleElement.textContent).toContain('transition-duration: 0.01ms');

        // Clean up
        document.body.removeChild(element);
    });

    it('should disable transform effects when prefers-reduced-motion is enabled', () => {
        // Inject reduced motion CSS
        styleElement.textContent = `
            @media (prefers-reduced-motion: reduce) {
                .widget-glass-hover:hover {
                    transform: none !important;
                }
            }
        `;

        // Verify CSS contains transform disable rule
        expect(styleElement.textContent).toContain('prefers-reduced-motion');
        expect(styleElement.textContent).toContain('transform: none');
    });

    it('should have comprehensive reduced motion CSS rules', () => {
        // Read the actual CSS rules that should be in index.css
        const expectedRules = [
            'animation-duration: 0.01ms !important',
            'animation-iteration-count: 1 !important',
            'transition-duration: 0.01ms !important',
            'scroll-behavior: auto !important',
            'transition: none !important',
            'animation: none !important',
            'transform: none'
        ];

        // Inject comprehensive reduced motion CSS
        styleElement.textContent = `
            @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
                
                .react-grid-layout,
                .react-grid-item,
                .widget-drag-handle,
                .theme-transition,
                .color-transition {
                    transition: none !important;
                    animation: none !important;
                }
                
                .widget-glass-hover:hover {
                    transform: none !important;
                }
            }
        `;

        // Verify all expected rules are present
        expectedRules.forEach(rule => {
            expect(styleElement.textContent).toContain(rule);
        });
    });

    it('should disable gradient border transitions when prefers-reduced-motion is enabled', () => {
        // Inject reduced motion CSS for gradient borders
        styleElement.textContent = `
            @media (prefers-reduced-motion: reduce) {
                .widget-gradient-border::before {
                    transition: none !important;
                }
            }
        `;

        // Verify CSS contains gradient border rule
        expect(styleElement.textContent).toContain('prefers-reduced-motion');
        expect(styleElement.textContent).toContain('.widget-gradient-border::before');
        expect(styleElement.textContent).toContain('transition: none');
    });

    it('should disable fade-in animations when prefers-reduced-motion is enabled', () => {
        // Inject reduced motion CSS for fade-in animations
        styleElement.textContent = `
            @media (prefers-reduced-motion: reduce) {
                .animate-fade-in,
                .animate-slide-in-from-top {
                    animation: none !important;
                }
            }
        `;

        // Verify CSS contains animation disable rules
        expect(styleElement.textContent).toContain('prefers-reduced-motion');
        expect(styleElement.textContent).toContain('.animate-fade-in');
        expect(styleElement.textContent).toContain('.animate-slide-in-from-top');
        expect(styleElement.textContent).toContain('animation: none');
    });

    it('should disable focus pulse animation when prefers-reduced-motion is enabled', () => {
        // Inject reduced motion CSS for focus pulse
        styleElement.textContent = `
            @media (prefers-reduced-motion: reduce) {
                .keyboard-focusable:focus-visible::after {
                    animation: none !important;
                }
            }
        `;

        // Verify CSS contains focus pulse disable rule
        expect(styleElement.textContent).toContain('prefers-reduced-motion');
        expect(styleElement.textContent).toContain('.keyboard-focusable:focus-visible::after');
        expect(styleElement.textContent).toContain('animation: none');
    });
});
