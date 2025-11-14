import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

console.log('🔍 Verifying extension build...\n');

const distDir = './dist';
const requiredFiles = [
    'index.html',
    'manifest.json',
    'icons/icon16.png',
    'icons/icon48.png',
    'icons/icon128.png',
    'assets/index.js',
    'assets/index.css'
];

let allValid = true;

// Check required files
console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
    const path = join(distDir, file);
    const exists = existsSync(path);
    console.log(`  ${exists ? '✓' : '✗'} ${file}`);
    if (!exists) allValid = false;
});

// Validate manifest.json
console.log('\n📋 Validating manifest.json:');
try {
    const manifestPath = join(distDir, 'manifest.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

    const checks = [
        ['manifest_version', manifest.manifest_version === 3],
        ['name', manifest.name === 'ApexGrid'],
        ['version', !!manifest.version],
        ['chrome_url_overrides.newtab', manifest.chrome_url_overrides?.newtab === 'index.html'],
        ['storage permission', manifest.permissions?.includes('storage')],
        ['icons defined', !!manifest.icons]
    ];

    checks.forEach(([check, valid]) => {
        console.log(`  ${valid ? '✓' : '✗'} ${check}`);
        if (!valid) allValid = false;
    });
} catch (error) {
    console.log(`  ✗ Error reading manifest: ${error.message}`);
    allValid = false;
}

// Final result
console.log('\n' + '='.repeat(50));
if (allValid) {
    console.log('✅ Build verification passed!');
    console.log('\nYou can now load the extension in Chrome:');
    console.log('1. Open chrome://extensions/');
    console.log('2. Enable "Developer mode"');
    console.log('3. Click "Load unpacked"');
    console.log('4. Select the "dist" folder');
} else {
    console.log('❌ Build verification failed!');
    console.log('\nPlease run: npm run build');
}
console.log('='.repeat(50) + '\n');
