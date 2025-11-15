# Counter & Countdown Widgets

## Counter Widget

### Overview
A customizable counter widget for tracking anything that needs incrementing or decrementing - days sober, books read, workouts completed, etc.

### Features
- **Increment/Decrement**: Large buttons for easy counting
- **Reset**: Quick reset to zero
- **Custom Label**: Name your counter (e.g., "Days Sober", "Books Read")
- **Step Size**: Configure how much to add/subtract per click (default: 1)
- **Persistent**: Saves your count automatically

### Usage
1. Add the Counter widget from Widget Gallery (Productivity category)
2. Click settings to customize the label and step size
3. Use + to increment, - to decrement, or reset button to start over
4. Your count is saved automatically

### Widget Type
`counter`

### Category
Productivity

---

## Countdown Widget

### Overview
A live countdown timer that shows the time remaining until an important event - birthdays, vacations, product launches, deadlines, etc.

### Features
- **Live Timer**: Updates every second showing days, hours, minutes, seconds
- **Custom Event**: Name your countdown event
- **Date & Time**: Set specific target date and time
- **Event Reached**: Shows celebration message when countdown completes
- **Formatted Display**: Shows full date of target event

### Usage
1. Add the Countdown widget from Widget Gallery (Productivity category)
2. Click settings to set event name and target date/time
3. Watch the live countdown update in real-time
4. When the event is reached, see a celebration message

### Display
- **Before Event**: Grid showing Days | Hours | Minutes | Seconds
- **After Event**: 🎉 celebration message with event date
- **Setup Needed**: Helpful prompt to configure the widget

### Widget Type
`countdown`

### Category
Productivity

---

## Technical Details

Both widgets:
- Use WidgetWrapper for consistent UI
- Persist data to Chrome Storage
- Support drag-and-drop repositioning
- Include settings dialog for configuration
- Are fully responsive to widget size
