import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Volume2, VolumeX, Timer } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/Dialog';
import { WidgetWrapper } from '../WidgetWrapper';
import { useWidgetSize, getResponsiveTextSize, isCompactMode, getResponsiveButtonSize } from '../../lib/useWidgetSize';
import { cn } from '../../lib/utils';

interface PomodoroData {
    workDuration: number; // in minutes
    shortBreakDuration: number;
    longBreakDuration: number;
    sessionsUntilLongBreak: number;
    soundEnabled: boolean;
    notificationsEnabled: boolean;
}

interface PomodoroWidgetProps {
    id: string;
    data?: PomodoroData;
    onDataChange?: (data: PomodoroData) => void;
}

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const DEFAULT_DATA: PomodoroData = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    soundEnabled: true,
    notificationsEnabled: true,
};

export const PomodoroWidget: React.FC<PomodoroWidgetProps> = ({
    id,
    data = DEFAULT_DATA,
    onDataChange,
}) => {
    const [mode, setMode] = useState<TimerMode>('work');
    const [timeLeft, setTimeLeft] = useState(data.workDuration * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [isSoundMuted, setIsSoundMuted] = useState(!data.soundEnabled);
    const { ref, size } = useWidgetSize();

    const intervalRef = useRef<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const textSizes = getResponsiveTextSize(size);
    const compact = isCompactMode(size);

    // Initialize audio
    useEffect(() => {
        // Create a simple beep sound using Web Audio API
        const createBeepSound = () => {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        };

        audioRef.current = { play: createBeepSound } as any;
    }, []);

    // Request notification permission on mount
    useEffect(() => {
        if (data.notificationsEnabled && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
    }, [data.notificationsEnabled]);

    // Timer logic
    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleTimerComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, timeLeft]);

    const handleTimerComplete = () => {
        setIsRunning(false);

        // Play sound
        if (data.soundEnabled && !isSoundMuted && audioRef.current) {
            try {
                audioRef.current.play();
            } catch (error) {
                console.error('Failed to play sound:', error);
            }
        }

        // Show notification
        if (data.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
            const title = mode === 'work' ? 'Work Session Complete!' : 'Break Complete!';
            const body = mode === 'work'
                ? 'Time for a break. Great work!'
                : 'Break is over. Ready to focus?';

            new Notification(title, {
                body,
                icon: '/vite.svg',
                badge: '/vite.svg',
            });
        }

        // Switch mode
        if (mode === 'work') {
            const newSessionsCompleted = sessionsCompleted + 1;
            setSessionsCompleted(newSessionsCompleted);

            if (newSessionsCompleted % data.sessionsUntilLongBreak === 0) {
                setMode('longBreak');
                setTimeLeft(data.longBreakDuration * 60);
            } else {
                setMode('shortBreak');
                setTimeLeft(data.shortBreakDuration * 60);
            }
        } else {
            setMode('work');
            setTimeLeft(data.workDuration * 60);
        }
    };

    const handleStart = () => {
        setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        const duration = mode === 'work'
            ? data.workDuration
            : mode === 'shortBreak'
                ? data.shortBreakDuration
                : data.longBreakDuration;
        setTimeLeft(duration * 60);
    };

    const handleModeSwitch = (newMode: TimerMode) => {
        setIsRunning(false);
        setMode(newMode);
        const duration = newMode === 'work'
            ? data.workDuration
            : newMode === 'shortBreak'
                ? data.shortBreakDuration
                : data.longBreakDuration;
        setTimeLeft(duration * 60);
    };

    const handleSettingsSave = (newData: PomodoroData) => {
        onDataChange?.(newData);
        setSettingsOpen(false);

        // Reset timer with new duration if not running
        if (!isRunning) {
            const duration = mode === 'work'
                ? newData.workDuration
                : mode === 'shortBreak'
                    ? newData.shortBreakDuration
                    : newData.longBreakDuration;
            setTimeLeft(duration * 60);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getProgress = (): number => {
        const totalDuration = mode === 'work'
            ? data.workDuration * 60
            : mode === 'shortBreak'
                ? data.shortBreakDuration * 60
                : data.longBreakDuration * 60;
        return ((totalDuration - timeLeft) / totalDuration) * 100;
    };

    const getModeColor = (): string => {
        switch (mode) {
            case 'work':
                return 'text-red-500';
            case 'shortBreak':
                return 'text-green-500';
            case 'longBreak':
                return 'text-blue-500';
        }
    };

    const getModeLabel = (): string => {
        switch (mode) {
            case 'work':
                return 'Focus Time';
            case 'shortBreak':
                return 'Short Break';
            case 'longBreak':
                return 'Long Break';
        }
    };

    return (
        <WidgetWrapper id={id} title="Pomodoro Timer" icon={<Timer className="h-4 w-4" />}>
            <div ref={ref} className="flex flex-col h-full">
                {/* Header with mode and controls */}
                {!compact && (
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className={cn(textSizes.small, "font-medium", getModeColor())}>
                                {getModeLabel()}
                            </h3>
                            <p className={cn(textSizes.small, "text-muted-foreground")}>
                                Session {sessionsCompleted + 1}
                            </p>
                        </div>
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setIsSoundMuted(!isSoundMuted)}
                                onMouseDown={(e) => e.stopPropagation()}
                                onTouchStart={(e) => e.stopPropagation()}
                                title={isSoundMuted ? 'Unmute' : 'Mute'}
                            >
                                {isSoundMuted ? (
                                    <VolumeX className="h-4 w-4" />
                                ) : (
                                    <Volume2 className="h-4 w-4" />
                                )}
                            </Button>
                            <PomodoroSettings
                                data={data}
                                isOpen={settingsOpen}
                                onOpenChange={setSettingsOpen}
                                onSave={handleSettingsSave}
                            />
                        </div>
                    </div>
                )}

                {/* Timer Display */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    {/* Circular Progress */}
                    <div className="relative w-32 h-32 mb-4">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="none"
                                className="text-muted"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 56}`}
                                strokeDashoffset={`${2 * Math.PI * 56 * (1 - getProgress() / 100)}`}
                                className={getModeColor()}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 1s linear' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold font-mono">
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-2 mb-4">
                        {!isRunning ? (
                            <Button
                                onClick={handleStart}
                                size={getResponsiveButtonSize(size)}
                                className="gap-2"
                            >
                                <Play className={textSizes.icon} />
                                {!compact && "Start"}
                            </Button>
                        ) : (
                            <Button
                                onClick={handlePause}
                                variant="secondary"
                                size={getResponsiveButtonSize(size)}
                                className="gap-2"
                            >
                                <Pause className={textSizes.icon} />
                                {!compact && "Pause"}
                            </Button>
                        )}
                        <Button
                            onClick={handleReset}
                            variant="outline"
                            size={getResponsiveButtonSize(size)}
                            className="gap-2"
                        >
                            <RotateCcw className={textSizes.icon} />
                            {!compact && "Reset"}
                        </Button>
                    </div>
                </div>

                {/* Mode Switcher */}
                <div className="flex gap-2">
                    <Button
                        variant={mode === 'work' ? 'default' : 'outline'}
                        size="sm"
                        className={cn("flex-1", textSizes.small)}
                        onClick={() => handleModeSwitch('work')}
                        disabled={isRunning}
                    >
                        {compact ? "W" : "Work"}
                    </Button>
                    <Button
                        variant={mode === 'shortBreak' ? 'default' : 'outline'}
                        size="sm"
                        className={cn("flex-1", textSizes.small)}
                        onClick={() => handleModeSwitch('shortBreak')}
                        disabled={isRunning}
                    >
                        {compact ? "S" : "Break"}
                    </Button>
                    <Button
                        variant={mode === 'longBreak' ? 'default' : 'outline'}
                        size="sm"
                        className={cn("flex-1", textSizes.small)}
                        onClick={() => handleModeSwitch('longBreak')}
                        disabled={isRunning}
                    >
                        {compact ? "L" : "Long"}
                    </Button>
                </div>
            </div>
        </WidgetWrapper>
    );
};

// Settings Dialog Component
interface PomodoroSettingsProps {
    data: PomodoroData;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: PomodoroData) => void;
}

const PomodoroSettings: React.FC<PomodoroSettingsProps> = ({
    data,
    isOpen,
    onOpenChange,
    onSave,
}) => {
    const [workDuration, setWorkDuration] = useState(data.workDuration.toString());
    const [shortBreak, setShortBreak] = useState(data.shortBreakDuration.toString());
    const [longBreak, setLongBreak] = useState(data.longBreakDuration.toString());
    const [sessions, setSessions] = useState(data.sessionsUntilLongBreak.toString());
    const [soundEnabled, setSoundEnabled] = useState(data.soundEnabled);
    const [notificationsEnabled, setNotificationsEnabled] = useState(data.notificationsEnabled);

    const handleSave = () => {
        const newData: PomodoroData = {
            workDuration: parseInt(workDuration) || 25,
            shortBreakDuration: parseInt(shortBreak) || 5,
            longBreakDuration: parseInt(longBreak) || 15,
            sessionsUntilLongBreak: parseInt(sessions) || 4,
            soundEnabled,
            notificationsEnabled,
        };
        onSave(newData);
    };

    const handleNotificationToggle = async (enabled: boolean) => {
        if (enabled && 'Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setNotificationsEnabled(true);
            }
        } else {
            setNotificationsEnabled(enabled);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                >
                    <Settings className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Pomodoro Settings</DialogTitle>
                    <DialogDescription>
                        Customize your Pomodoro timer intervals and preferences
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Work Duration (minutes)</label>
                        <Input
                            type="number"
                            min="1"
                            max="60"
                            value={workDuration}
                            onChange={(e) => setWorkDuration(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Short Break (minutes)</label>
                        <Input
                            type="number"
                            min="1"
                            max="30"
                            value={shortBreak}
                            onChange={(e) => setShortBreak(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Long Break (minutes)</label>
                        <Input
                            type="number"
                            min="1"
                            max="60"
                            value={longBreak}
                            onChange={(e) => setLongBreak(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Sessions Until Long Break</label>
                        <Input
                            type="number"
                            min="1"
                            max="10"
                            value={sessions}
                            onChange={(e) => setSessions(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Sound Alerts</label>
                        <input
                            type="checkbox"
                            checked={soundEnabled}
                            onChange={(e) => setSoundEnabled(e.target.checked)}
                            className="h-4 w-4"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">System Notifications</label>
                        <input
                            type="checkbox"
                            checked={notificationsEnabled}
                            onChange={(e) => handleNotificationToggle(e.target.checked)}
                            className="h-4 w-4"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
