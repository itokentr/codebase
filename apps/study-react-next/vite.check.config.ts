import { reactCompiler } from '@lib/react/compiler';
import assert from 'node:assert/strict';
import { glob } from 'node:fs/promises';
import { defineConfig } from 'vite';

const root = import.meta.dirname;
const entry = await Array.fromAsync(glob('app/**/*.ts?(x)', { cwd: root }));

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
  plugins: [
    reactCompiler({ command: 'check', exclude: ['packages/react'], root }),
  ],
  root,
});
