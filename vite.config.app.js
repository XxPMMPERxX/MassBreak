import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import keystonePlugin from 'keystonemc/vite-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [keystonePlugin({ uuid: "82b9174d-ea3d-42ae-986c-b42ce3644760" })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
