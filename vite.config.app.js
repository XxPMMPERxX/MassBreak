import { defineConfig } from 'vite';
import { resolve } from 'path';
import crypto from 'node:crypto';
import fs from 'node:fs';

const behaviorPacker = ({
  name = 'my first plugin',
  uuid,
  description = '',
  authors = [],
  version = [1, 0, 0]
 }= {
  name: 'my first plugin',
  uuid,
  description: '',
  authors: [],
  version: [1, 0, 0]
 }) => ({
  name: 'BehaviorPacker',
  config: (config) => {
    return {
      ...config,
      build: {
        outDir: './dist_behavior_pack/scripts',
        emptyOutDir: true,
        assetsDir: '',
        rollupOptions: {
          input: {
            index: resolve(__dirname, './src/index.ts'),
          },
        },
      },
    }
  },
  writeBundle: async (_, outputFiles) => {
    const entryFile = Object.values(outputFiles).find(({ isEntry }) => isEntry);

    const behaviorUUID = uuid ?? crypto.randomUUID();
    const manifestStub = {
      "format_version": 2,
      "header": {
        "name": name,
        "description": description,
        "uuid": behaviorUUID,
        "version": version,
        "min_engine_version": [1, 21, 120]
      },
      "modules": [
        {
          "description": "script",
          "type": "script",
          "language": "javascript",
          "uuid": crypto.randomUUID(),
          "version": [1, 0, 0],
          "entry": `scripts/${entryFile.fileName}`,
        }
      ],
      "dependencies": [
        {
          "module_name":"@minecraft/server",
          "version": "beta"
        },
        {
          "module_name": "@minecraft/server-ui",
          "version": "beta"
        },
        {
          "module_name": "@minecraft/server-net",
          "version": "beta"
        }
      ],
      "metadata": {
        "authors": authors,
      }
    };

    fs.writeFileSync('./dist_behavior_pack/manifest.json', JSON.stringify(manifestStub, null, 2));
  },
});

export default defineConfig({
  plugins: [behaviorPacker({ uuid: "82b9174d-ea3d-42ae-986c-b42ce3644760" })],
});
