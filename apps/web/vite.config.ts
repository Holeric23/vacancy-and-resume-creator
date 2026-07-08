import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'document-core': path.resolve(__dirname, '../../packages/document-core/src/index.ts'),
      'project-codec': path.resolve(__dirname, '../../packages/project-codec/src/index.ts')
    },
  },
  server: {
    port: 5173,
    host: true,
  }
});