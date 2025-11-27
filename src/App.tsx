import { useEffect, useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useSettingsStore } from "./stores/useSettingsStore";
import { useLayoutStore } from "./stores/useLayoutStore";
import { useWidgetStore } from "./stores/useWidgetStore";
import { Toaster } from "./components/ui/sonner";

/**
 * App component - root component for ApexGrid
 * - Initializes all stores from Chrome Storage on mount
 * - Applies saved theme on app load
 * - Renders Dashboard component
 * - Wraps everything in global error boundary
 */
function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  const { isInitialized: settingsInitialized, initializeSettings } =
    useSettingsStore();
  const { isInitialized: layoutInitialized, initializeLayout } =
    useLayoutStore();
  const { isInitialized: widgetsInitialized, initializeWidgets } =
    useWidgetStore();

  /**
   * Initialize all stores from Chrome Storage on app load
   */
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsInitializing(true);
        setInitError(null);

        // Initialize all stores in parallel
        await Promise.all([
          initializeSettings(),
          initializeLayout(),
          initializeWidgets(),
        ]);

        setIsInitializing(false);
      } catch (error) {
        console.error("Failed to initialize app:", error);
        setInitError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, [initializeSettings, initializeLayout, initializeWidgets]);

  // Show loading state while stores are initializing
  if (
    isInitializing ||
    !settingsInitialized ||
    !layoutInitialized ||
    !widgetsInitialized
  ) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">Loading ApexGrid...</div>
          <div className="text-sm text-muted-foreground">
            Initializing dashboard
          </div>
        </div>
      </div>
    );
  }

  // Show error state if initialization failed
  if (initError) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="max-w-md p-6 text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2">Initialization Failed</h1>
          <p className="text-muted-foreground mb-4">
            Failed to load ApexGrid. Please try reloading the page.
          </p>
          <details className="mb-4 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Error details
            </summary>
            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
              {initError}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <Toaster richColors />
      <Dashboard />
    </ErrorBoundary>
  );
}

export default App;
