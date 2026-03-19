import { defineConfig } from '@lib/svelte/custom-elements';

export default defineConfig({
  build: {
    lib: {
      fileName: () => `static/custom-elements.js`,
    },
    outDir: '../app',
  },
  root: import.meta.dirname,
});
