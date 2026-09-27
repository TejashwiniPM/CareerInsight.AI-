import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function apiServerPlugin(): Plugin {
  return {
    name: 'api-server-middleware',
    async configureServer(server) {
      const express = (await import('express')).default;
      const { apiRouter } = await import('./src/server/api-router');
      
      const app = express();
      app.use(express.json({ limit: '15mb' }));
      app.use(express.urlencoded({ extended: true, limit: '15mb' }));
      app.use('/api', apiRouter);
      
      server.middlewares.use(app);
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
