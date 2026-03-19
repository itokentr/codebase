/* export a vite config to check the codebase with react compiler */

import assert from 'node:assert/strict';
import { glob, stat } from 'node:fs/promises';
import path from 'node:path';
import { defineConfig } from 'vite';
import { reactCompiler } from './src/react-compiler/vite-plugin.ts';

const root = import.meta.dirname;
const entry = (
  await Promise.all(
    (
      await Array.fromAsync(
        glob('src/{base-ui,client,next/client,react-router/client}/*', {
          cwd: root,
        }),
      )
    ).map<Promise<string[]>>(async (name) => {
      const fullName = path.join(root, name);
      const entry = await stat(fullName);

      if (entry.isDirectory()) {
        const files: string[] = [];

        for await (const file of glob('*.*', { cwd: fullName })) {
          const name = path.join(fullName, file);

          if (file === 'index.ts' || file === 'index.tsx') {
            return [name];
          }
          files.push(name);
        }
        return files;
      }
      return [fullName];
    }),
  )
).flat();
assert.ok(entry.length > 0, 'no entry found');

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry,
      fileName: () => Math.random().toString(),
      formats: ['es'],
    },
    minify: false,
    rolldownOptions: {
      external: /^\w/,
    },
    target: ['es2026'],
    write: false,
  },
  plugins: [reactCompiler({ command: 'check', root })],
  root,
});
