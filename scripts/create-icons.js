/**
 * Simple icon creator using Canvas
 * Creates basic PNG icons for the Chrome extension
 */

import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#3B82F6';
    ctx.fillRect(0, 0, size, size);

    // Calculate grid dimensions
    const padding = size * 0.15625; // 20/128
    const gap = size * 0.0625; // 8/128
    const cellSize = (size - 2 * padding - gap) / 2;

    // Draw grid cells
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    const positions = [
        [padding, padding],
        [padding + cellSize + gap, padding],
        [padding, padding + cellSize + gap],
        [padding + cellSize + gap, padding + cellSize + gap]
    ];

    positions.forEach(([x, y]) => {
        ctx.fillRect(x, y, cellSize, cellSize);
    });

    return canvas.toBuffer('image/png');
}

function main() {
    const iconsDir = join(__dirname, '../public/icons');

    if (!existsSync(iconsDir)) {
        mkdirSync(iconsDir, { recursive: true });
    }

    const sizes = [16, 48, 128];

    console.log('Creating PNG icons...\n');

    sizes.forEach(size => {
        const buffer = createIcon(size);
        const outputPath = join(iconsDir, `icon${size}.png`);
        writeFileSync(outputPath, buffer);
        console.log(`✓ Created icon${size}.png`);
    });

    console.log('\n✅ All icons created successfully!\n');
}

main();
