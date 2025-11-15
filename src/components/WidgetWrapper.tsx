import React, { Component, type ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { X } from 'lucide-react';
import { useWidgetStore } from '../stores/useWidgetStore';

interface WidgetWrapperProps {
    id: string;
    title: string;
    icon?: ReactNode;
    children: ReactNode;
    actions?: ReactNode;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    widgetId: string;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

/**
 * Error Boundary for widget crash isolation
 * Prevents a single widget failure from breaking the entire dashboard
 */
class WidgetErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error(`Widget ${this.props.widgetId} crashed:`, error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center h-full p-4 text-center">
                    <div>
                        <p className="text-destructive font-semibold mb-2">Widget Error</p>
                        <p className="text-sm text-muted-foreground">
                            This widget encountered an error and couldn't be displayed.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * WidgetWrapper component provides consistent styling and functionality for all widgets
 * - Drag handle for repositioning
 * - Card styling for consistency
 * - Widget header with title and remove button
 * - Error boundary for crash isolation
 */
const WidgetWrapperComponent: React.FC<WidgetWrapperProps> = ({ id, title, icon, children, actions }) => {
    const { removeWidget } = useWidgetStore();

    const handleRemove = React.useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        removeWidget(id);
    }, [id, removeWidget]);

    return (
        <Card
            className="h-full flex flex-col overflow-hidden widget-glass-hover animate-fade-in"
            role="region"
            aria-label={`${title} widget`}
        >
            <CardHeader
                className="flex-row items-center justify-between space-y-0 pb-3 cursor-move widget-drag-handle border-b border-border/50"
                role="toolbar"
                aria-label={`${title} widget controls`}
            >
                <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-2">
                    {icon && <span className="flex-shrink-0">{icon}</span>}
                    {title}
                </CardTitle>
                <div className="flex items-center gap-1">
                    {actions}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRemove}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        aria-label={`Remove ${title} widget`}
                        title={`Remove ${title} widget`}
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
                <WidgetErrorBoundary widgetId={id}>
                    {children}
                </WidgetErrorBoundary>
            </CardContent>
        </Card>
    );
};

// Memoize component to prevent unnecessary re-renders
export const WidgetWrapper = React.memo(WidgetWrapperComponent);
