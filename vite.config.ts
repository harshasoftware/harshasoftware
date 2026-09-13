import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    // Pre-bundle deps that are only reached through React.lazy so Vite doesn't
    // re-optimize (and reload with duplicate React instances) on first scroll.
    include: ['gsap', '@gsap/react'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    target: 'es2022',
    manifest: true, // read by scripts/check-bundle.mjs
    chunkSizeWarningLimit: 600,
  },
});
