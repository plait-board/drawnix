/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/web',

  server: {
    port: 7200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [react(), nxViteTsPaths()],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: '../../dist/apps/web',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/');

          if (!normalizedId.includes('node_modules')) {
            return;
          }
          if (normalizedId.includes('@plait-board/mermaid-to-drawnix')) {
            return 'mermaid-to-drawnix';
          }
          if (normalizedId.includes('@plait-board/markdown-to-drawnix')) {
            return 'markdown-to-drawnix';
          }
          if (
            normalizedId.includes('@plait/') ||
            normalizedId.includes('slate') ||
            normalizedId.includes('roughjs') ||
            normalizedId.includes('laser-pen')
          ) {
            return 'board-vendor';
          }
          if (
            normalizedId.includes('/node_modules/react/') ||
            normalizedId.includes('/node_modules/react-dom/')
          ) {
            return 'react-vendor';
          }
        },
      },
    },
  },
});
