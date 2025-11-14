import React, { useCallback, useRef } from 'react';
import RGL, { WidthProvider, type Layout as RGLLayout } from 'react-grid-layout';
import type { Layout } from '../types/layout';
import { useLayoutStore } from '../stores/useLayoutStore';
import { debounce } from '../lib/utils';
import 'react-grid-layout/css/styles.css';

const ReactGridLayout = WidthProvider(RGL);

interface GridLayoutProps {
    children: React.ReactNode;
}

/**
 * GridLayout wrapper component for react-grid-layout
 * Configures the grid with ApexGrid-specific settings:
 * - 12-column grid
 * - 80px row height
 * - Drag-and-drop with custom handle
 * - Southeast resize handle
 */
export const GridLayout: React.FC<GridLayoutProps> = ({ children }) => {
    const { layout, updateLayout } = useLayoutStore();

    /**
     * Track whether a resize operation is in progress
     * Used to differentiate between drag and resize operations
     */
    const isResizingRef = useRef(false);

    /**
     * Debounced layout update function
     * Delays storage writes until user stops dragging (500ms)
     * Only used for drag operations, not resize
     */
    const debouncedUpdateLayout = useRef(
        debounce((updatedLayout: Layout) => {
            updateLayout(updatedLayout);
        }, 500)
    ).current;

    /**
     * Convert react-grid-layout format to our Layout type
     */
    const convertLayout = useCallback((newLayout: RGLLayout[]): Layout => {
        return newLayout.map((item: RGLLayout) => ({
            i: item.i,
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
            minW: item.minW,
            minH: item.minH,
            maxW: item.maxW,
            maxH: item.maxH,
        }));
    }, []);

    /**
     * Handle resize start event
     * Sets flag to indicate resize operation is in progress
     */
    const handleResizeStart = useCallback(() => {
        isResizingRef.current = true;
    }, []);

    /**
     * Handle resize stop event
     * Immediately persists layout changes without debouncing
     */
    const handleResizeStop = useCallback((newLayout: RGLLayout[]) => {
        isResizingRef.current = false;
        const updatedLayout = convertLayout(newLayout);

        // Immediate persistence for resize operations (no debounce)
        updateLayout(updatedLayout).catch(error => {
            console.error('Failed to persist resize:', error);
        });
    }, [convertLayout, updateLayout]);

    /**
     * Handle layout changes from drag operations
     * Uses debouncing to reduce storage writes during active dragging
     */
    const handleLayoutChange = useCallback((newLayout: RGLLayout[]) => {
        const updatedLayout = convertLayout(newLayout);

        // Only use debounced update for drag operations, not resize
        if (!isResizingRef.current) {
            debouncedUpdateLayout(updatedLayout);
        }
    }, [convertLayout, debouncedUpdateLayout]);

    return (
        <div role="application" aria-label="Widget grid layout">
            <ReactGridLayout
                className="layout"
                layout={layout}
                cols={12}
                rowHeight={80}
                onLayoutChange={handleLayoutChange}
                onResizeStart={handleResizeStart}
                onResizeStop={handleResizeStop}
                draggableHandle=".widget-drag-handle"
                resizeHandles={['se']}
                compactType="vertical"
                preventCollision={false}
                margin={[16, 16]}
                containerPadding={[16, 16]}
            >
                {children}
            </ReactGridLayout>
        </div>
    );
};
