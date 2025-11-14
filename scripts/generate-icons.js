/**
 * Icon Generation Script
 * 
 * This script provides instructions for generating PNG icons from the SVG source.
 * 
 * MANUAL STEPS (Recommended):
 * 1. Open public/icons/icon.svg in a graphics editor (Inkscape, GIMP, Photoshop, etc.)
 * 2. Export as PNG in the following sizes:
 *    - 16x16 pixels -> public/icons/icon16.png
 *    - 48x48 pixels -> public/icons/icon48.png
 *    - 128x128 pixels -> public/icons/icon128.png
 * 
 * AUTOMATED OPTIONS:
 * 
 * Option 1: Using ImageMagick (if installed)
 *   convert public/icons/icon.svg -resize 16x16 public/icons/icon16.png
 *   convert public/icons/icon.svg -resize 48x48 public/icons/icon48.png
 *   convert public/icons/icon.svg -resize 128x128 public/icons/icon128.png
 * 
 * Option 2: Using Inkscape CLI (if installed)
 *   inkscape public/icons/icon.svg -w 16 -h 16 -o public/icons/icon16.png
 *   inkscape public/icons/icon.svg -w 48 -h 48 -o public/icons/icon48.png
 *   inkscape public/icons/icon.svg -w 128 -h 128 -o public/icons/icon128.png
 * 
 * Option 3: Using sharp (Node.js library)
 *   npm install sharp
 *   Then run this script with: node scripts/generate-icons.js
 */

import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateIcons() {
    try {
        // Try to use sharp if available
        const sharp = await import('sharp').catch(() => null);

        if (!sharp) {
            console.log('\n⚠️  Sharp library not found.');
            console.log('\nTo generate PNG icons automatically, install sharp:');
            console.log('  npm install --save-dev sharp');
            console.log('\nThen run this script again:');
            console.log('  node scripts/generate-icons.js');
            console.log('\nAlternatively, follow the manual steps in this file.\n');
            return;
        }

        const svgPath = join(__dirname, '../public/icons/icon.svg');
        const sizes = [16, 48, 128];

        console.log('Generating PNG icons from SVG...\n');

        for (const size of sizes) {
            const outputPath = join(__dirname, `../public/icons/icon${size}.png`);
            await sharp.default(svgPath)
                .resize(size, size)
                .png()
                .toFile(outputPath);
            console.log(`✓ Generated icon${size}.png`);
        }

        console.log('\n✅ All icons generated successfully!\n');
    } catch (error) {
        console.error('Error generating icons:', error.message);
        console.log('\nPlease follow the manual steps in this file.\n');
    }
}

generateIcons();
