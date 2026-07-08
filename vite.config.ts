import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const isGithubActions = process.env.GITHUB_ACTIONS === 'true' || process.env.GITHUB_WORKFLOW;
  return {
    base: isGithubActions ? '/Finance-BridgeAPP/' : '/',
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || ""),
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || ""),
      'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || ""),
      'import.meta.env.VITE_FINNHUB_API_KEY': JSON.stringify(process.env.VITE_FINNHUB_API_KEY || process.env.FINNHUB_API_KEY || ""),
      'process.env.VITE_FINNHUB_API_KEY': JSON.stringify(process.env.VITE_FINNHUB_API_KEY || process.env.FINNHUB_API_KEY || ""),
      'process.env.FINNHUB_API_KEY': JSON.stringify(process.env.FINNHUB_API_KEY || process.env.VITE_FINNHUB_API_KEY || ""),
      'import.meta.env.VITE_TWELVE_DATA_API_KEY': JSON.stringify(process.env.VITE_TWELVE_DATA_API_KEY || process.env.TWELVE_DATA_API_KEY || ""),
      'process.env.VITE_TWELVE_DATA_API_KEY': JSON.stringify(process.env.VITE_TWELVE_DATA_API_KEY || process.env.TWELVE_DATA_API_KEY || ""),
      'process.env.TWELVE_DATA_API_KEY': JSON.stringify(process.env.TWELVE_DATA_API_KEY || process.env.VITE_TWELVE_DATA_API_KEY || ""),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      minify: 'esbuild' as const,
      cssMinify: true,
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
