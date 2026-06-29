import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: 'src/main.jsx',
      output: {
        dir: 'scripts',
        entryFileNames: 'tier2.js',
        chunkFileNames: 'tier2-[name].js',
        assetFileNames: '../styles/tier2.[ext]',
        format: 'es',
        manualChunks: undefined,
      },
    },
    cssCodeSplit: false,
    emptyOutDir: false,
  },
})
