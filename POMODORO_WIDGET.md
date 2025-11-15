# Pomodoro Timer Widget

## Overview

A fully-featured Pomodoro Timer widget for ApexGrid that helps you stay focused and productive using the Pomodoro Technique.

## Features

### Timer Modes
- **Work Session** (default: 25 minutes) - Focus time
- **Short Break** (default: 5 minutes) - Quick rest between work sessions
- **Long Break** (default: 15 minutes) - Extended rest after multiple sessions

### Configurable Settings
- Customize work duration (1-60 minutes)
- Customize short break duration (1-30 minutes)
- Customize long break duration (1-60 minutes)
- Set number of sessions before long break (1-10)
- Toggle sound alerts on/off
- Toggle system notifications on/off

### Visual Features
- **Circular Progress Indicator** - Visual representation of time remaining
- **Color-Coded Modes**:
  - Red for work sessions
  - Green for short breaks
  - Blue for long breaks
- **Large Timer Display** - Easy-to-read countdown in MM:SS format
- **Session Counter** - Track completed sessions

### Controls
- **Start/Pause** - Control timer execution
- **Reset** - Reset current timer to full duration
- **Mode Switcher** - Quick switch between work/break modes
- **Mute Button** - Toggle sound alerts without opening settings

### Notifications
- **System Notifications** - Desktop notifications when timer completes
- **Sound Alerts** - Audio beep when timer finishes
- **Permission Handling** - Automatic request for notification permissions

## Usage

### Adding the Widget
1. Click the "+" button in the top-right corner
2. Select "Pomodoro Timer" from the widget gallery
3. The widget will be added to your dashboard

### Basic Operation
1. Click "Start" to begin a work session
2. Focus on your task until the timer completes
3. Take a break when prompted
4. Repeat the cycle

### Configuring Settings
1. Click the settings icon (gear) in the widget header
2. Adjust durations and preferences
3. Click "Save Changes"
4. Settings are persisted across sessions

### Keyboard Shortcuts
- Timer can be controlled via mouse/touch only
- Settings accessible via settings button

## Technical Details

### State Management
- Timer state managed with React hooks
- Settings persisted to Chrome Storage
- Session count tracked during active use

### Audio
- Uses Web Audio API for sound generation
- Simple sine wave beep (800Hz, 0.5s duration)
- No external audio files required

### Notifications
- Uses browser Notification API
- Requires user permission grant
- Falls back gracefully if permissions denied

### Performance
- Efficient 1-second interval updates
- Cleanup on component unmount
- Memoized calculations for progress

## Pomodoro Technique

The Pomodoro Technique is a time management method:

1. **Work for 25 minutes** (one "Pomodoro")
2. **Take a 5-minute break**
3. **Repeat 4 times**
4. **Take a longer 15-30 minute break**

Benefits:
- Improved focus and concentration
- Reduced mental fatigue
- Better time awareness
- Increased productivity
- Regular breaks prevent burnout

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (may require notification permissions)
- **Mobile**: Touch-friendly interface

## Permissions Required

- **Notifications**: Optional, for desktop alerts
- **Audio**: Automatic, for sound alerts

## Files

- `src/components/widgets/PomodoroWidget.tsx` - Main widget component
- `src/types/widget.ts` - Widget type definitions
- `src/components/WidgetRenderer.tsx` - Widget renderer integration
- `src/components/WidgetGallery.tsx` - Widget gallery entry
