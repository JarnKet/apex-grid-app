import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { WidgetWrapper } from "../WidgetWrapper";
import type { WidgetProps } from "@/types/widget";
import {
  fetchRSSFeed,
  getRelativeTime,
  TECH_FEEDS,
  FINANCE_FEEDS,
  type RSSItem,
} from "@/services/rssApi";
import { Button } from "@/components/ui/Button";
import { ExternalLink, RefreshCw, Settings, Rss } from "lucide-react";

interface RSSWidgetData {
  items: RSSItem[];
  lastFetched: number;
  selectedFeed: string;
}

/**
 * RSSWidget displays tech news from RSS feeds
 * - Fetches news from various tech sources
 * - Caches results for 10 minutes
 * - Allows selecting different RSS feeds
 * - Shows relative timestamps
 */
const RSSWidgetComponent: React.FC<WidgetProps> = ({
  id,
  data,
  onDataChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const widgetData = data as RSSWidgetData | undefined;
  const items = widgetData?.items || [];
  // Default to Dev.to feed
  const selectedFeed = widgetData?.selectedFeed || "https://dev.to/feed";
  const lastFetched = widgetData?.lastFetched || 0;

  // Cache duration: 10 minutes
  const CACHE_DURATION = 10 * 60 * 1000;

  /**
   * Fetch RSS feed data
   */
  const fetchFeed = async (feedUrl: string = selectedFeed) => {
    setLoading(true);
    setError(null);

    try {
      // Limit to 5 items to reduce storage size (was 10)
      const feedItems = await fetchRSSFeed(feedUrl, 5);

      const newData: RSSWidgetData = {
        items: feedItems,
        lastFetched: Date.now(),
        selectedFeed: feedUrl,
      };

      onDataChange?.(newData);
      toast.success("Feed updated", {
        description: `Loaded ${feedItems.length} articles`,
      });
    } catch (err) {
      console.error("Failed to fetch RSS feed:", err);
      const errorMsg =
        err instanceof Error ? err.message : "Failed to load news";
      setError(errorMsg);
      toast.error("Feed fetch failed", {
        description: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initialize or refresh feed data
   */
  useEffect(() => {
    const shouldFetch =
      !lastFetched || Date.now() - lastFetched > CACHE_DURATION;

    if (shouldFetch && !loading) {
      fetchFeed();
    }
  }, []);

  /**
   * Handle feed selection
   */
  const handleFeedChange = (feedUrl: string) => {
    setShowSettings(false);
    fetchFeed(feedUrl);
  };

  /**
   * Manual refresh
   */
  const handleRefresh = () => {
    fetchFeed();
  };

  const allFeeds = [...TECH_FEEDS, ...FINANCE_FEEDS];
  const selectedFeedName =
    allFeeds.find((f) => f.url === selectedFeed)?.name || "Custom Feed";

  return (
    <WidgetWrapper
      id={id}
      title={`Tech News - ${selectedFeedName}`}
      icon={<Rss className="h-4 w-4" />}
    >
      <div className="flex flex-col h-full">
        {/* Header controls */}
        <div className="flex items-center justify-between mb-3 px-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="h-7 px-2 text-xs"
          >
            <Settings className="h-3 w-3 mr-1" />
            Feed
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="h-7 px-2 text-xs"
          >
            <RefreshCw
              className={`h-3 w-3 mr-1 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Feed selector */}
        {showSettings && (
          <div className="mb-3 p-2 bg-muted rounded-md max-h-64 overflow-y-auto">
            <p className="text-xs font-medium mb-2 text-muted-foreground sticky top-0 bg-muted">
              Select Feed:
            </p>

            {/* Tech Feeds */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-foreground mb-1 px-1">
                Tech News
              </p>
              <div className="space-y-1">
                {TECH_FEEDS.map((feed) => (
                  <button
                    key={feed.url}
                    onClick={() => handleFeedChange(feed.url)}
                    className={`w-full text-left px-2 py-1.5 text-xs rounded transition-colors ${
                      selectedFeed === feed.url
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-background"
                    }`}
                  >
                    {feed.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Finance Feeds */}
            <div>
              <p className="text-xs font-semibold text-foreground mb-1 px-1">
                Finance & Trading
              </p>
              <div className="space-y-1">
                {FINANCE_FEEDS.map((feed) => (
                  <button
                    key={feed.url}
                    onClick={() => handleFeedChange(feed.url)}
                    className={`w-full text-left px-2 py-1.5 text-xs rounded transition-colors ${
                      selectedFeed === feed.url
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-background"
                    }`}
                  >
                    {feed.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && items.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-xs text-destructive">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="mt-2 h-7 text-xs"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* News items */}
        {!loading && !error && items.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">No news items found</p>
          </div>
        )}

        {items.length > 0 && (
          <div className="flex-1 overflow-y-auto space-y-2 widget-scrollbar">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 rounded-md hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  {item.thumbnail && (
                    <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-muted">
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          // Hide image if it fails to load
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {getRelativeTime(item.pubDate)}
                      </span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </WidgetWrapper>
  );
};

// Memoize component to prevent unnecessary re-renders
export const RSSWidget = React.memo(RSSWidgetComponent);
