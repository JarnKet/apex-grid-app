# Life Progress Widget

## Overview
The Life Progress Widget visualizes the passage of time across different periods: life, year, quarter, month, week, and day. It provides a motivational perspective on time management by showing progress bars with percentages.

## Features
- **Life Progress**: Shows overall life progress based on birth date and life expectancy
- **Year Progress**: Current year completion percentage
- **Quarter Progress**: Current quarter (Q1-Q4) completion
- **Month Progress**: Current month completion
- **Week Progress**: Current week completion (Sunday to Saturday)
- **Day Progress**: Current day completion (midnight to midnight)

## Configuration
Users can configure:
- **Birth Date**: Your date of birth (required)
- **Life Expectancy**: Expected lifespan in years (default: 80 years)

## Usage
1. Add the widget from the Widget Gallery (Lifestyle category)
2. On first load, enter your birth date and life expectancy
3. Click "Save" to start tracking progress
4. Click the settings icon to update configuration anytime

## Technical Details
- Updates every minute to keep progress bars current
- Persists configuration to Chrome Storage
- Calculates percentages based on elapsed time vs total time for each period
- Life progress is capped at 100%

## Design
- Clean progress bars with percentage labels
- Smooth transitions on updates
- Responsive layout that works in various widget sizes
- Settings panel for easy configuration

## Widget Type
`lifeprogress`

## Category
Lifestyle
