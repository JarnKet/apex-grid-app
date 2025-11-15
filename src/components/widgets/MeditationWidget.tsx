import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { Heart, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import type { WidgetProps } from '../../types/widget';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

const MeditationWidgetComponent: React.FC<WidgetProps> = ({ id }) => {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<BreathPhase>('inhale');
    const [timer, setTimer] = useState(0);
    const [cycles, setCycles] = useState(0);

    const BREATH_PATTERN = {
        inhale: 4,
        hold: 4,
        exhale: 4,
        rest: 2,
    };

    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setTimer((prev) => {
                const newTimer = prev + 1;
                const currentDuration = BREATH_PATTERN[phase];

                if (newTimer >= currentDuration) {
                    // Move to next phase
                    if (phase === 'inhale') setPhase('hold');
                    else if (phase === 'hold') setPhase('exhale');
                    else if (phase === 'exhale') setPhase('rest');
                    else {
                        setPhase('inhale');
                        setCycles((c) => c + 1);
                    }
                    return 0;
                }
                return newTimer;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, phase]);

    const handleToggle = () => {
        setIsActive(!isActive);
    };

    const handleReset = () => {
        setIsActive(false);
        setPhase('inhale');
        setTimer(0);
        setCycles(0);
    };

    const getPhaseText = () => {
        switch (phase) {
            case 'inhale': return 'Breathe In';
            case 'hold': return 'Hold';
            case 'exhale': return 'Breathe Out';
            case 'rest': return 'Rest';
        }
    };

    const getCircleScale = () => {
        const progress = timer / BREATH_PATTERN[phase];
        if (phase === 'inhale') return 0.5 + (progress * 0.5);
        if (phase === 'exhale') return 1 - (progress * 0.5);
        return 1;
    };

    return (
        <WidgetWrapper id={id} title="Meditation" icon={<Heart className="h-4 w-4" />}>
            <div className="flex flex-col items-center justify-center h-full p-4 space-y-6">
                {/* Breathing circle */}
                <div className="relative w-40 h-40 flex items-center justify-center">
                    <div
                        className="absolute rounded-full bg-primary/20 transition-all duration-1000 ease-in-out"
                        style={{
                            width: `${getCircleScale() * 160}px`,
                            height: `${getCircleScale() * 160}px`,
                        }}
                    />
                    <div className="relative z-10 text-center">
                        <div className="text-2xl font-bold mb-1">{getPhaseText()}</div>
                        <div className="text-4xl font-mono">
                            {BREATH_PATTERN[phase] - timer}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="text-center">
                    <div className="text-sm text-muted-foreground">
                        Completed Cycles: <span className="font-bold">{cycles}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        {cycles * 14} seconds of mindfulness
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleReset}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                        size="lg"
                        onClick={handleToggle}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="px-8"
                    >
                        {isActive ? (
                            <>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                            </>
                        ) : (
                            <>
                                <Play className="h-4 w-4 mr-2" />
                                Start
                            </>
                        )}
                    </Button>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                    4-4-4-2 breathing pattern
                </div>
            </div>
        </WidgetWrapper>
    );
};

export const MeditationWidget = React.memo(MeditationWidgetComponent);
