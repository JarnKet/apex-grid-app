import { useEffect } from 'react';

/**
 * Custom hook for keyboard navigation support
 * Provides keyboard shortcuts for common dashboard actions
 */
export const useKeyboardNavigation = (callbacks: {
    onOpenSettings?: () => void;
    onCloseSettings?: () => void;
    onFocusNextWidget?: () => void;
    onFocusPreviousWidget?: () => void;
}) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Settings shortcut: Ctrl/Cmd + ,
            if ((event.ctrlKey || event.metaKey) && event.key === ',') {
                event.preventDefault();
                callbacks.onOpenSettings?.();
                return;
            }

            // Close settings: Escape
            if (event.key === 'Escape') {
                callbacks.onCloseSettings?.();
                return;
            }

            // Navigate between widgets: Ctrl/Cmd + Arrow keys
            if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                    event.preventDefault();
                    callbacks.onFocusNextWidget?.();
                    return;
                }

                if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                    event.preventDefault();
                    callbacks.onFocusPreviousWidget?.();
                    return;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [callbacks]);
};
