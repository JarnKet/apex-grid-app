import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { copyFileSync, mkdirSync, existsSync, readdirSync } from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-extension-files',
      closeBundle() {
        // Copy manifest.json
        copyFileSync('public/manifest.json', 'dist/manifest.json')

        // Copy icons directory
        const iconsDir = 'public/icons'
        const distIconsDir = 'dist/icons'

        if (!existsSync(distIconsDir)) {
          mkdirSync(distIconsDir, { recursive: true })
        }

        if (existsSync(iconsDir)) {
          const files = readdirSync(iconsDir)
          files.forEach(file => {
            copyFileSync(
              path.join(iconsDir, file),
              path.join(distIconsDir, file)
            )
          })
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
})
