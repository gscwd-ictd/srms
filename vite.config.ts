import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/lib/mapstudio/tests/setup.ts'],
    globals: true,
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
  },
  resolve: {
    alias: {
      '@srms': path.resolve(__dirname, './src'),
    },
  },
});
