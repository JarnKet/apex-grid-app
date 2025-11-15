import React, { useState } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import type { WidgetProps, QuickLink } from '../../types/widget';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Link } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/Dialog';
import { Plus, ExternalLink, Pencil, Trash2 } from 'lucide-react';

/**
 * Default preset quick links with popular sites
 */
const DEFAULT_QUICK_LINKS: QuickLink[] = [
    {
        id: 'preset-google',
        title: 'Google',
        url: 'https://www.google.com',
        icon: 'https://www.google.com/favicon.ico',
    },
    {
        id: 'preset-youtube',
        title: 'YouTube',
        url: 'https://www.youtube.com',
        icon: 'https://www.youtube.com/favicon.ico',
    },
    {
        id: 'preset-facebook',
        title: 'Facebook',
        url: 'https://www.facebook.com',
        icon: 'https://www.facebook.com/favicon.ico',
    },
    {
        id: 'preset-x',
        title: 'X (Twitter)',
        url: 'https://x.com',
        icon: 'https://abs.twimg.com/favicons/twitter.3.ico',
    },
];

/**
 * QuickLinksWidget provides quick access to favorite websites
 * - Display clickable link items in a grid
 * - Add new links with title and URL
 * - Edit existing links
 * - Delete links
 * - Validate and sanitize URLs
 * - Persist all changes to Chrome Storage
 */
const QuickLinksWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
    const [linkTitle, setLinkTitle] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [urlError, setUrlError] = useState('');

    // Get links from widget data, default to preset links
    const links: QuickLink[] = data?.links || DEFAULT_QUICK_LINKS;

    /**
     * Validate and sanitize URL
     */
    const validateUrl = (url: string): { isValid: boolean; sanitizedUrl: string; error: string } => {
        if (!url.trim()) {
            return { isValid: false, sanitizedUrl: '', error: 'URL is required' };
        }

        let sanitizedUrl = url.trim();

        // Add protocol if missing
        if (!/^https?:\/\//i.test(sanitizedUrl)) {
            sanitizedUrl = `https://${sanitizedUrl}`;
        }

        // Validate URL format
        try {
            const urlObj = new URL(sanitizedUrl);
            // Only allow http and https protocols
            if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
                return { isValid: false, sanitizedUrl: '', error: 'Only HTTP and HTTPS URLs are allowed' };
            }
            return { isValid: true, sanitizedUrl, error: '' };
        } catch {
            return { isValid: false, sanitizedUrl: '', error: 'Invalid URL format' };
        }
    };

    /**
     * Open dialog for adding a new link
     */
    const handleOpenAddDialog = () => {
        setEditingLink(null);
        setLinkTitle('');
        setLinkUrl('');
        setUrlError('');
        setIsDialogOpen(true);
    };

    /**
     * Open dialog for editing an existing link
     */
    const handleOpenEditDialog = (link: QuickLink) => {
        setEditingLink(link);
        setLinkTitle(link.title);
        setLinkUrl(link.url);
        setUrlError('');
        setIsDialogOpen(true);
    };

    /**
     * Handle saving a link (add or edit)
     */
    const handleSaveLink = (e: React.FormEvent) => {
        e.preventDefault();

        if (!linkTitle.trim()) {
            setUrlError('Title is required');
            return;
        }

        // Validate and sanitize URL
        const { isValid, sanitizedUrl, error } = validateUrl(linkUrl);
        if (!isValid) {
            setUrlError(error);
            return;
        }

        let updatedLinks: QuickLink[];

        if (editingLink) {
            // Edit existing link
            updatedLinks = links.map(link =>
                link.id === editingLink.id
                    ? { ...link, title: linkTitle.trim(), url: sanitizedUrl }
                    : link
            );
        } else {
            // Add new link
            const newLink: QuickLink = {
                id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: linkTitle.trim(),
                url: sanitizedUrl,
            };
            updatedLinks = [...links, newLink];
        }

        // Persist to widget store
        if (onDataChange) {
            onDataChange({ links: updatedLinks });
        }

        // Close dialog and reset form
        setIsDialogOpen(false);
        setEditingLink(null);
        setLinkTitle('');
        setLinkUrl('');
        setUrlError('');
    };

    /**
     * Handle deleting a link
     */
    const handleDeleteLink = (linkId: string) => {
        const updatedLinks = links.filter(link => link.id !== linkId);

        // Persist to widget store
        if (onDataChange) {
            onDataChange({ links: updatedLinks });
        }
    };

    /**
     * Handle clicking a link - opens URL in current tab
     */
    const handleLinkClick = (url: string) => {
        window.location.href = url;
    };

    return (
        <WidgetWrapper id={id} title="Quick Links" icon={<Link className="h-4 w-4" />}>
            <div className="flex flex-col h-full">
                {/* Add link button */}
                <div className="mb-4">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={handleOpenAddDialog}
                                size="sm"
                                className="w-full"
                                aria-label="Add new quick link"
                            >
                                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                                Add Link
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <form onSubmit={handleSaveLink}>
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingLink ? 'Edit Link' : 'Add New Link'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {editingLink
                                            ? 'Update the link title and URL below.'
                                            : 'Enter a title and URL for your quick link.'}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <label htmlFor="link-title" className="text-sm font-medium">
                                            Title
                                        </label>
                                        <Input
                                            id="link-title"
                                            placeholder="My Favorite Site"
                                            value={linkTitle}
                                            onChange={(e) => setLinkTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="link-url" className="text-sm font-medium">
                                            URL
                                        </label>
                                        <Input
                                            id="link-url"
                                            placeholder="https://example.com"
                                            value={linkUrl}
                                            onChange={(e) => {
                                                setLinkUrl(e.target.value);
                                                setUrlError('');
                                            }}
                                            required
                                        />
                                        {urlError && (
                                            <p className="text-sm text-destructive">{urlError}</p>
                                        )}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        {editingLink ? 'Save Changes' : 'Add Link'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Links grid */}
                <div
                    className="flex-1 overflow-y-auto widget-scrollbar"
                    role="list"
                    aria-label="Quick links"
                >
                    {links.length === 0 ? (
                        <p
                            className="text-sm text-muted-foreground text-center py-8"
                            role="status"
                        >
                            No links yet. Add your first quick link above!
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            {links.map((link) => (
                                <div
                                    key={link.id}
                                    className="group relative p-3 rounded-md border bg-card hover:bg-accent/50 transition-colors duration-200"
                                    role="listitem"
                                >
                                    <button
                                        onClick={() => handleLinkClick(link.url)}
                                        className="w-full text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                                        aria-label={`Open ${link.title} at ${link.url}`}
                                        title={link.url}
                                    >
                                        <div className="flex items-start gap-2">
                                            {link.icon ? (
                                                <img
                                                    src={link.icon}
                                                    alt=""
                                                    className="h-4 w-4 mt-0.5 flex-shrink-0"
                                                    onError={(e) => {
                                                        // Fallback to ExternalLink icon if image fails
                                                        e.currentTarget.style.display = 'none';
                                                        const fallback = e.currentTarget.nextElementSibling;
                                                        if (fallback) fallback.classList.remove('hidden');
                                                    }}
                                                />
                                            ) : null}
                                            <ExternalLink className={`h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground ${link.icon ? 'hidden' : ''}`} aria-hidden="true" />
                                            <span className="text-sm font-medium line-clamp-2 break-words">
                                                {link.title}
                                            </span>
                                        </div>
                                    </button>
                                    <div
                                        className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200"
                                        role="toolbar"
                                        aria-label={`Actions for ${link.title}`}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            onClick={() => handleOpenEditDialog(link)}
                                            aria-label={`Edit ${link.title}`}
                                            title={`Edit ${link.title}`}
                                        >
                                            <Pencil className="h-3 w-3" aria-hidden="true" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            onClick={() => handleDeleteLink(link.id)}
                                            aria-label={`Delete ${link.title}`}
                                            title={`Delete ${link.title}`}
                                        >
                                            <Trash2 className="h-3 w-3" aria-hidden="true" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </WidgetWrapper>
    );
};

// Memoize component to prevent unnecessary re-renders
export const QuickLinksWidget = React.memo(QuickLinksWidgetComponent);
