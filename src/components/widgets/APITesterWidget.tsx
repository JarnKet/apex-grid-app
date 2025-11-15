import React, { useState } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { Code, Send, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { WidgetProps } from '../../types/widget';

const APITesterWidgetComponent: React.FC<WidgetProps> = ({ id }) => {
  const [url, setUrl] = useState('https://api.github.com/zen');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTest = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const res = await fetch(url);
      const contentType = res.headers.get('content-type');

      let data;
      if (contentType?.includes('application/json')) {
        data = await res.json();
        setResponse(JSON.stringify(data, null, 2));
      } else {
        data = await res.text();
        setResponse(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <WidgetWrapper id={id} title="API Tester" icon={<Code className="w-4 h-4" />}>
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter API URL..."
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleTest()}
          />
          <Button
            onClick={handleTest}
            disabled={loading || !url.trim()}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-2 rounded">
            {error}
          </div>
        )}

        {response && (
          <div className="relative">
            <Button
              onClick={handleCopy}
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2 z-10"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
            <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-64 font-mono">
              {response}
            </pre>
          </div>
        )}

        {loading && (
          <div className="text-sm text-muted-foreground text-center py-4">
            Loading...
          </div>
        )}
      </div>
    </WidgetWrapper>
  );
};

export const APITesterWidget = React.memo(APITesterWidgetComponent);
