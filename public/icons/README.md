# Extension Icons

## Required Icons

The Chrome extension requires PNG icons in the following sizes:
- `icon16.png` - 16x16 pixels (browser toolbar)
- `icon48.png` - 48x48 pixels (extension management page)
- `icon128.png` - 128x128 pixels (Chrome Web Store)

## Generating Icons

### Option 1: Online Converter (Easiest)
1. Visit https://cloudconvert.com/svg-to-png
2. Upload `icon.svg`
3. Convert to PNG at 16x16, 48x48, and 128x128
4. Save as `icon16.png`, `icon48.png`, `icon128.png`

### Option 2: Using ImageMagick
```bash
magick icon.svg -resize 16x16 icon16.png
magick icon.svg -resize 48x48 icon48.png
magick icon.svg -resize 128x128 icon128.png
```

### Option 3: Using Inkscape
```bash
inkscape icon.svg -w 16 -h 16 -o icon16.png
inkscape icon.svg -w 48 -h 48 -o icon48.png
inkscape icon.svg -w 128 -h 128 -o icon128.png
```

## Current Status

The SVG source file (`icon.svg`) is available. PNG files need to be generated before building the extension.
