import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { RefreshCw, Settings, Github, Star, GitFork, Users, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/Dialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { WidgetProps } from '../../types/widget';
import {
    fetchGitHubUser,
    fetchGitHubRepos,
    fetchGitHubStats,
    type GitHubUser,
    type GitHubRepo,
    type GitHubStats,
} from '../../services/githubApi';

// Minimal repo data to reduce storage size
interface MinimalRepo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
}

interface GitHubWidgetData {
    username: string;
    user: GitHubUser | null;
    repos: MinimalRepo[];
    stats: GitHubStats | null;
    lastFetched: number;
}

const DEFAULT_DATA: GitHubWidgetData = {
    username: '',
    user: null,
    repos: [],
    stats: null,
    lastFetched: 0,
};

/**
 * GitHubWidget - Display GitHub profile and activity
 * Shows user stats, recent repos, and contribution chart
 */
const GitHubWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [tempUsername, setTempUsername] = useState('');

    const widgetData = (data as GitHubWidgetData) || DEFAULT_DATA;
    const { username, user, repos, stats, lastFetched } = widgetData;

    // Cache duration: 1 hour
    const CACHE_DURATION = 60 * 60 * 1000;

    /**
     * Fetch GitHub data
     */
    const fetchGitHubData = async (user: string = username) => {
        if (!user.trim()) {
            setError('Please enter a GitHub username');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const [userData, reposData, statsData] = await Promise.all([
                fetchGitHubUser(user),
                fetchGitHubRepos(user, 5),
                fetchGitHubStats(user),
            ]);

            // Store only essential repo data to reduce storage size
            const minimalRepos: MinimalRepo[] = reposData.map(repo => ({
                id: repo.id,
                name: repo.name,
                description: repo.description,
                html_url: repo.html_url,
                language: repo.language,
                stargazers_count: repo.stargazers_count,
                forks_count: repo.forks_count,
            }));

            // Limit contribution days to last 28 days only
            const limitedStats = statsData ? {
                ...statsData,
                contributionDays: statsData.contributionDays.slice(-28),
            } : null;

            const newData: GitHubWidgetData = {
                username: user,
                user: userData,
                repos: minimalRepos,
                stats: limitedStats,
                lastFetched: Date.now(),
            };

            onDataChange?.(newData);
        } catch (err) {
            console.error('Failed to fetch GitHub data:', err);
            setError(err instanceof Error ? err.message : 'Failed to load GitHub data');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Initialize data - fetch on mount if username exists
     */
    useEffect(() => {
        if (username) {
            const shouldFetch = !lastFetched || Date.now() - lastFetched > CACHE_DURATION;
            if (shouldFetch && !loading) {
                fetchGitHubData();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Handle username save
     */
    const handleSaveUsername = () => {
        if (!tempUsername.trim()) {
            setError('Please enter a username');
            return;
        }
        setSettingsOpen(false);
        fetchGitHubData(tempUsername.trim());
    };

    /**
     * Prepare chart data from contributions
     */
    const chartData = stats?.contributionDays
        .slice(-28) // Last 4 weeks
        .map((day) => ({
            date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            contributions: day.count,
        })) || [];

    const chartConfig = {
        contributions: {
            label: 'Contributions',
            color: 'hsl(var(--primary))',
        },
    };

    return (
        <WidgetWrapper
            id={id}
            title="GitHub"
            icon={<Github className="h-4 w-4" />}
            actions={
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => fetchGitHubData()}
                        disabled={loading || !username}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                    setTempUsername(username);
                                    setSettingsOpen(true);
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                                onTouchStart={(e) => e.stopPropagation()}
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>GitHub Settings</DialogTitle>
                                <DialogDescription>
                                    Enter your GitHub username to display your profile
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">GitHub Username</label>
                                    <Input
                                        placeholder="octocat"
                                        value={tempUsername}
                                        onChange={(e) => setTempUsername(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Your GitHub username (not email)
                                    </p>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveUsername}>Save</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            }
        >
            <div className="flex flex-col h-full overflow-y-auto widget-scrollbar">
                {/* Loading state */}
                {loading && !user && (
                    <div className="flex items-center justify-center h-full">
                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}

                {/* Error state */}
                {error && !user && (
                    <div className="flex flex-col items-center justify-center h-full space-y-3 p-4">
                        <Github className="h-12 w-12 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground text-center">{error}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSettingsOpen(true)}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <Settings className="h-3 w-3 mr-2" />
                            Configure
                        </Button>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && !user && (
                    <div className="flex flex-col items-center justify-center h-full space-y-3 p-4">
                        <Github className="h-12 w-12 text-muted-foreground" />
                        <div className="text-center">
                            <p className="text-sm font-medium">No GitHub Profile</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Configure your username to get started
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSettingsOpen(true)}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <Settings className="h-3 w-3 mr-2" />
                            Add Username
                        </Button>
                    </div>
                )}

                {/* GitHub data display */}
                {user && (
                    <div className="space-y-4 p-2">
                        {/* User profile */}
                        <div className="flex items-start gap-3 pb-3 border-b border-border">
                            <img
                                src={user.avatar_url}
                                alt={user.name}
                                className="w-12 h-12 rounded-full"
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm truncate">{user.name}</h3>
                                <p className="text-xs text-muted-foreground truncate">@{user.login}</p>
                                {user.bio && (
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {user.bio}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                    <BookOpen className="h-3 w-3" />
                                    <span className="text-xs">Repos</span>
                                </div>
                                <div className="text-lg font-bold">{user.public_repos}</div>
                            </div>
                            <div className="p-2 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                    <Star className="h-3 w-3" />
                                    <span className="text-xs">Stars</span>
                                </div>
                                <div className="text-lg font-bold">{stats?.totalStars || 0}</div>
                            </div>
                            <div className="p-2 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                    <Users className="h-3 w-3" />
                                    <span className="text-xs">Followers</span>
                                </div>
                                <div className="text-lg font-bold">{user.followers}</div>
                            </div>
                            <div className="p-2 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                    <Github className="h-3 w-3" />
                                    <span className="text-xs">Contributions</span>
                                </div>
                                <div className="text-lg font-bold">{stats?.totalContributions || 0}</div>
                            </div>
                        </div>

                        {/* Contribution chart */}
                        {chartData.length > 0 && (
                            <div>
                                <h4 className="text-xs font-medium mb-2">Last 4 Weeks Activity</h4>
                                <ChartContainer config={chartConfig} className="h-32 w-full">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 10 }}
                                            interval="preserveStartEnd"
                                        />
                                        <YAxis tick={{ fontSize: 10 }} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar
                                            dataKey="contributions"
                                            fill="var(--color-contributions)"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            </div>
                        )}

                        {/* Recent repos */}
                        {repos.length > 0 && (
                            <div>
                                <h4 className="text-xs font-medium mb-2">Recent Repositories</h4>
                                <div className="space-y-2">
                                    {repos.slice(0, 3).map((repo) => (
                                        <a
                                            key={repo.id}
                                            href={repo.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block p-2 rounded-md hover:bg-muted/50 transition-colors group"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate group-hover:text-primary">
                                                        {repo.name}
                                                    </p>
                                                    {repo.description && (
                                                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                                            {repo.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-3 mt-1">
                                                        {repo.language && (
                                                            <span className="text-xs text-muted-foreground">
                                                                {repo.language}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Star className="h-3 w-3" />
                                                            {repo.stargazers_count}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <GitFork className="h-3 w-3" />
                                                            {repo.forks_count}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </WidgetWrapper>
    );
};

export const GitHubWidget = React.memo(GitHubWidgetComponent);
