import React, { useState } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { BookOpen, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { WidgetProps } from '../../types/widget';

interface Definition {
    word: string;
    phonetic: string;
    meanings: Array<{
        partOfSpeech: string;
        definitions: Array<{
            definition: string;
            example?: string;
        }>;
    }>;
}

const DictionaryWidgetComponent: React.FC<WidgetProps> = ({ id }) => {
    const [word, setWord] = useState('');
    const [loading, setLoading] = useState(false);
    const [definition, setDefinition] = useState<Definition | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!word.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.trim()}`);

            if (!response.ok) {
                throw new Error('Word not found');
            }

            const data = await response.json();
            setDefinition(data[0]);
        } catch (err) {
            setError('Word not found. Try another word.');
            setDefinition(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <WidgetWrapper id={id} title="Dictionary" icon={<BookOpen className="h-4 w-4" />}>
            <div className="flex flex-col h-full p-3">
                <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                    <Input
                        type="text"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        placeholder="Enter a word..."
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={loading}>
                        <Search className="h-4 w-4" />
                    </Button>
                </form>

                <div className="flex-1 overflow-y-auto widget-scrollbar">
                    {loading && (
                        <div className="text-center text-muted-foreground py-8">
                            Searching...
                        </div>
                    )}

                    {error && (
                        <div className="text-center text-destructive py-8 text-sm">
                            {error}
                        </div>
                    )}

                    {definition && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-bold">{definition.word}</h3>
                                {definition.phonetic && (
                                    <p className="text-sm text-muted-foreground">{definition.phonetic}</p>
                                )}
                            </div>

                            {definition.meanings.slice(0, 2).map((meaning, idx) => (
                                <div key={idx} className="space-y-2">
                                    <p className="text-sm font-semibold text-primary">
                                        {meaning.partOfSpeech}
                                    </p>
                                    {meaning.definitions.slice(0, 2).map((def, defIdx) => (
                                        <div key={defIdx} className="pl-3 border-l-2 border-border">
                                            <p className="text-sm">{def.definition}</p>
                                            {def.example && (
                                                <p className="text-xs text-muted-foreground italic mt-1">
                                                    "{def.example}"
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && !error && !definition && (
                        <div className="text-center text-muted-foreground py-8">
                            <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Search for a word to see its definition</p>
                        </div>
                    )}
                </div>
            </div>
        </WidgetWrapper>
    );
};

export const DictionaryWidget = React.memo(DictionaryWidgetComponent);
