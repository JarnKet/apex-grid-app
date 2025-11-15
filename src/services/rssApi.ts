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
 * Default tech news RSS feeds
 */
export const DEFAULT_FEEDS = [
    { name: 'Hacker News', url: 'https://news.ycombinator.com/rss' },
    { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
    { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
    { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' },
    { name: 'Dev.to', url: 'https://dev.to/feed' },
];

/**
 * Fetch RSS feed and convert to JSON
 * @param feedUrl - The RSS feed URL
 * @param count - Number of items to fetch (default: 10)
 * @returns Promise<RSSItem[]>
 */
export async function fetchRSSFeed(feedUrl: string, count: number = 10): Promise<RSSItem[]> {
    try {
        // Use RSS2JSON API to convert RSS to JSON
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&count=${count}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status !== 'ok') {
            throw new Error(`RSS feed error: ${data.message || 'Unknown error'}`);
        }

        // Transform the data to our format
        return data.items.map((item: any) => ({
            title: item.title || 'No title',
            link: item.link || '#',
            pubDate: item.pubDate || new Date().toISOString(),
            description: stripHtml(item.description || ''),
            thumbnail: item.thumbnail || item.enclosure?.link,
        }));
    } catch (error) {
        console.error('Failed to fetch RSS feed:', error);
        throw error;
    }
}

/**
 * Strip HTML tags from string
 */
function stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
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

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
}
