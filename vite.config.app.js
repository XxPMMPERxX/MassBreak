import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import keystonePlugin from 'keystonemc/vite-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [keystonePlugin({ name: 'MassBreak' })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
