import React from 'react';
import type { Widget, WidgetProps } from '../types/widget';
import { ClockWidget } from './widgets/ClockWidget';
import { CalendarWidget } from './widgets/CalendarWidget';
import { TodoWidget } from './widgets/TodoWidget';
import { QuickLinksWidget } from './widgets/QuickLinksWidget';
import { QuoteWidget } from './widgets/QuoteWidget';
import { CurrencyWidget } from './widgets/CurrencyWidget';

interface WidgetRendererProps {
    widget: Widget;
    data?: any;
    onDataChange?: (data: any) => void;
}

/**
 * WidgetRenderer maps widget types to their corresponding components
 * - Implements switch/case for all widget types
 * - Passes widget ID and data props to widget components
 * - Passes onDataChange callback for data updates
 * - Each widget is wrapped in WidgetWrapper (done by individual widgets)
 */
const WidgetRendererComponent: React.FC<WidgetRendererProps> = ({ widget, data, onDataChange }) => {
    const widgetProps: WidgetProps = {
        id: widget.id,
        data,
        onDataChange,
    };

    switch (widget.type) {
        case 'clock':
            return <ClockWidget {...widgetProps} />;

        case 'calendar':
            return <CalendarWidget {...widgetProps} />;

        case 'todo':
            return <TodoWidget {...widgetProps} />;

        case 'quicklinks':
            return <QuickLinksWidget {...widgetProps} />;

        case 'quote':
            return <QuoteWidget {...widgetProps} />;

        case 'currency':
            return <CurrencyWidget {...widgetProps} />;

        default:
            // Handle unknown widget types gracefully
            return (
                <div className="flex items-center justify-center h-full p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        Unknown widget type: {widget.type}
                    </p>
                </div>
            );
    }
};

// Memoize component to prevent unnecessary re-renders when other widgets update
export const WidgetRenderer = React.memo(WidgetRendererComponent);
