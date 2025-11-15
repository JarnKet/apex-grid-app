# ApexGrid Theme Guidelines

## Important: Always Use Theme Variables

**NEVER use hardcoded colors like `text-blue-300`, `bg-green-100`, etc.**

Always use the theme variables defined in `src/index.css` to ensure consistency across light and dark modes.

## Available Theme Variables

### Text Colors
- `text-foreground` - Primary text color
- `text-muted-foreground` - Secondary/muted text
- `text-card-foreground` - Text on cards
- `text-primary` - Primary brand color text
- `text-primary-foreground` - Text on primary backgrounds
- `text-destructive` - Error/danger text
- `text-destructive-foreground` - Text on destructive backgrounds

### Background Colors
- `bg-background` - Main background
- `bg-card` - Card backgrounds
- `bg-popover` - Popover/dropdown backgrounds
- `bg-primary` - Primary brand color background
- `bg-secondary` - Secondary background
- `bg-muted` - Muted/subtle background
- `bg-accent` - Accent background
- `bg-destructive` - Error/danger background

### Border Colors
- `border-border` - Default border color
- `border-input` - Input field borders
- `border-ring` - Focus ring color

### Chart Colors (for data visualization)
- `text-chart-1` / `bg-chart-1` - First chart color
- `text-chart-2` / `bg-chart-2` - Second chart color (green tones)
- `text-chart-3` / `bg-chart-3` - Third chart color
- `text-chart-4` / `bg-chart-4` - Fourth chart color
- `text-chart-5` / `bg-chart-5` - Fifth chart color

## Common Use Cases

### Success/Positive States
```tsx
// ✅ CORRECT - Use chart-2 (green tones)
<span className="text-chart-2">+5.2%</span>
<div className="bg-chart-2/20 text-chart-2">Success</div>

// ❌ WRONG - Don't use hardcoded colors
<span className="text-green-600 dark:text-green-400">+5.2%</span>
```

### Error/Negative States
```tsx
// ✅ CORRECT - Use destructive
<span className="text-destructive">-3.1%</span>
<div className="bg-destructive/20 text-destructive">Error</div>

// ❌ WRONG - Don't use hardcoded colors
<span className="text-red-600 dark:text-red-400">-3.1%</span>
```

### Status Badges
```tsx
// ✅ CORRECT - Use theme variables with opacity
<span className="bg-chart-2/20 text-chart-2 px-2 py-1 rounded-full">
  Added
</span>

// ❌ WRONG - Don't use hardcoded colors
<span className="bg-green-100 dark:bg-green-900 text-green-700">
  Added
</span>
```

### Hover States
```tsx
// ✅ CORRECT - Use theme variables
<button className="hover:bg-accent hover:text-accent-foreground">
  Click me
</button>

// ❌ WRONG - Don't use hardcoded colors
<button className="hover:bg-gray-100 dark:hover:bg-gray-800">
  Click me
</button>
```

### Muted/Secondary Content
```tsx
// ✅ CORRECT - Use muted variants
<p className="text-muted-foreground">Secondary text</p>
<div className="bg-muted/50">Subtle background</div>

// ❌ WRONG - Don't use hardcoded colors
<p className="text-gray-500 dark:text-gray-400">Secondary text</p>
```

## Dialog/Modal Sizing

### Settings and Gallery Modals
Always use viewport units for large modals:

```tsx
// ✅ CORRECT - Proper sizing with flex layout
<DialogContent className="w-[90vw] max-w-[90vw] h-[90vh] max-h-[90vh] flex flex-col overflow-hidden">
  <DialogHeader className="flex-shrink-0">
    {/* Header content */}
  </DialogHeader>
  <div className="flex-1 overflow-y-auto">
    {/* Scrollable content */}
  </div>
</DialogContent>

// ❌ WRONG - Conflicting max-width or missing overflow handling
<DialogContent className="max-w-[90vw] w-[90vw] overflow-y-auto">
```

## Card Components

The Card component automatically uses theme variables:
- `bg-card` for background
- `text-card-foreground` for text
- `border` for borders

No need to add custom classes unless you need specific styling.

```tsx
// ✅ CORRECT - Let Card use theme defaults
<Card className="p-4">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// ❌ WRONG - Don't override with hardcoded colors
<Card className="bg-white dark:bg-gray-900 border-gray-200">
```

## Opacity Modifiers

Use Tailwind's opacity modifiers with theme colors:

```tsx
// ✅ CORRECT - Theme color with opacity
<div className="bg-primary/10">Subtle primary background</div>
<div className="bg-muted/50">Semi-transparent muted</div>

// ❌ WRONG - Hardcoded color with opacity
<div className="bg-blue-500/10">Subtle background</div>
```

## Testing Theme Compatibility

Always test your components in both light and dark modes:

1. Toggle dark mode in Settings
2. Verify all colors are readable
3. Check that hover states work
4. Ensure focus indicators are visible

## Quick Reference

| Purpose | Use This | Not This |
|---------|----------|----------|
| Primary text | `text-foreground` | `text-black`, `text-gray-900` |
| Secondary text | `text-muted-foreground` | `text-gray-500` |
| Success/Positive | `text-chart-2` | `text-green-600` |
| Error/Negative | `text-destructive` | `text-red-600` |
| Background | `bg-background` | `bg-white`, `bg-gray-50` |
| Card background | `bg-card` | `bg-white`, `bg-gray-100` |
| Subtle background | `bg-muted` | `bg-gray-100` |
| Borders | `border-border` | `border-gray-200` |
| Hover background | `hover:bg-accent` | `hover:bg-gray-100` |

## Remember

- Theme variables work in both light and dark modes automatically
- No need for `dark:` variants when using theme variables
- Opacity modifiers (`/10`, `/20`, `/50`) work with all theme colors
- Always test in both light and dark modes
