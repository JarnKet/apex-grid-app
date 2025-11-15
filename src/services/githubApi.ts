/**
 * GitHub API service
 * Fetches user profile, repositories, and contribution data
 */

export interface GitHubUser {
    login: string;
    name: string;
    avatar_url: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    html_url: string;
}

export interface GitHubRepo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    updated_at: string;
}

export interface ContributionDay {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubStats {
    totalContributions: number;
    totalStars: number;
    totalRepos: number;
    contributionDays: ContributionDay[];
}

/**
 * Fetch GitHub user profile
 */
export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('User not found');
            }
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        return data as GitHubUser;
    } catch (error) {
        console.error('Error fetching GitHub user:', error);
        throw error;
    }
}

/**
 * Fetch user's repositories
 */
export async function fetchGitHubRepos(username: string, limit: number = 5): Promise<GitHubRepo[]> {
    try {
        const response = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=${limit}`
        );

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        return data as GitHubRepo[];
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        throw error;
    }
}

/**
 * Generate contribution data for the last 12 weeks
 * Note: GitHub's contribution graph API requires authentication
 * This generates sample data based on repo activity
 */
export async function fetchContributionData(username: string): Promise<ContributionDay[]> {
    try {
        // Fetch recent events to estimate activity
        const response = await fetch(
            `https://api.github.com/users/${username}/events/public?per_page=100`
        );

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const events = await response.json();

        // Generate last 84 days (12 weeks)
        const days: ContributionDay[] = [];
        const today = new Date();

        for (let i = 83; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // Count events for this day
            const dayEvents = events.filter((event: any) => {
                const eventDate = new Date(event.created_at).toISOString().split('T')[0];
                return eventDate === dateStr;
            });

            const count = dayEvents.length;
            let level: 0 | 1 | 2 | 3 | 4 = 0;
            if (count > 0) level = 1;
            if (count >= 3) level = 2;
            if (count >= 6) level = 3;
            if (count >= 10) level = 4;

            days.push({ date: dateStr, count, level });
        }

        return days;
    } catch (error) {
        console.error('Error fetching contribution data:', error);
        // Return empty data on error
        const days: ContributionDay[] = [];
        const today = new Date();
        for (let i = 83; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            days.push({
                date: date.toISOString().split('T')[0],
                count: 0,
                level: 0,
            });
        }
        return days;
    }
}

/**
 * Calculate total stars across all repos
 */
export async function calculateTotalStars(username: string): Promise<number> {
    try {
        const repos = await fetchGitHubRepos(username, 100);
        return repos.reduce((total, repo) => total + repo.stargazers_count, 0);
    } catch (error) {
        console.error('Error calculating total stars:', error);
        return 0;
    }
}

/**
 * Get comprehensive GitHub stats
 */
export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
    try {
        const [user, repos, contributions] = await Promise.all([
            fetchGitHubUser(username),
            fetchGitHubRepos(username, 100),
            fetchContributionData(username),
        ]);

        const totalStars = repos.reduce((total, repo) => total + repo.stargazers_count, 0);
        const totalContributions = contributions.reduce((total, day) => total + day.count, 0);

        return {
            totalContributions,
            totalStars,
            totalRepos: user.public_repos,
            contributionDays: contributions,
        };
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        throw error;
    }
}
