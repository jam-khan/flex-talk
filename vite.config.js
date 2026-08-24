import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Two build modes:
//   npm run dev     -> dev server on :8000 with watch + reload
//   npm run build   -> dist/ (normal multi-asset build)
//   npm run build:single -> dist/index.html, one self-contained file
//
// Slides live in src/sections/*.html and are stitched together at runtime by
// src/main.js via import.meta.glob, so each section stays its own small file.
export default defineConfig(({ mode }) => ({
  base: './',
  server: {
    port: 8000,
    open: false,
  },
  build: {
    outDir: mode === 'single' ? 'dist-single' : 'dist',
    emptyOutDir: true,
    // The MathJax bundle is imported ?raw, which makes for one big chunk.
    chunkSizeWarningLimit: 4000,
    assetsInlineLimit: mode === 'single' ? 100_000_000 : 4096,
  },
  plugins: mode === 'single' ? [viteSingleFile({ removeViteModuleLoader: true })] : [],
}));
