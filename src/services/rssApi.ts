/**
 * RSS Feed API service for tech news
 * Uses RSS2JSON API to convert RSS feeds to JSON
 */

export interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail?: string;
}

export interface RSSFeedData {
  items: RSSItem[];
  lastFetched: number;
}

/**
 * Tech news RSS feeds
 */
export const TECH_FEEDS = [
  { name: "Hacker News", url: "https://news.ycombinator.com/rss" },
  { name: "TechCrunch", url: "https://techcrunch.com/feed/" },
  { name: "The Verge", url: "https://www.theverge.com/rss/index.xml" },
  {
    name: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/index",
  },
  { name: "Dev.to", url: "https://dev.to/feed" },
];

/**
 * Finance and trading RSS feeds
 */
export const FINANCE_FEEDS = [
  {
    name: "Bloomberg Markets",
    url: "https://feeds.bloomberg.com/markets/news.rss",
  },
  { name: "Reuters Finance", url: "https://feeds.reuters.com/finance/markets" },
  { name: "CNBC Markets", url: "https://feeds.cnbc.com/cnbc/financials/" },
  {
    name: "MarketWatch",
    url: "https://feeds.marketwatch.com/marketwatch/topstories/",
  },
  { name: "Seeking Alpha", url: "https://seekingalpha.com/feed.xml" },
  {
    name: "Crypto News",
    url: "https://feeds.bloomberg.com/markets/cryptocurrency.rss",
  },
];

/**
 * All available RSS feeds
 */
export const DEFAULT_FEEDS = [...TECH_FEEDS, ...FINANCE_FEEDS];

/**
 * Fetch RSS feed and convert to JSON
 * @param feedUrl - The RSS feed URL
 * @param count - Number of items to fetch (default: 10)
 * @returns Promise<RSSItem[]>
 */
export async function fetchRSSFeed(
  feedUrl: string,
  count: number = 10
): Promise<RSSItem[]> {
  try {
    // Use RSS2JSON API to convert RSS to JSON
    // Note: 'count' parameter requires API key, so we use default (usually 10 items)
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
      feedUrl
    )}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error(`RSS feed error: ${data.message || "Unknown error"}`);
    }

    // Transform the data to our format
    // Limit description to 200 characters to reduce storage size
    const items = data.items.map((item: any) => {
      const description = stripHtml(item.description || "");
      return {
        title: item.title || "No title",
        link: item.link || "#",
        pubDate: item.pubDate || new Date().toISOString(),
        description:
          description.length > 200
            ? description.substring(0, 200) + "..."
            : description,
        thumbnail: item.thumbnail || item.enclosure?.link,
      };
    });

    // Slice to requested count (since we can't use count param without API key)
    return items.slice(0, count);
  } catch (error) {
    console.error("Failed to fetch RSS feed:", error);
    throw error;
  }
}

/**
 * Strip HTML tags from string
 */
function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}
