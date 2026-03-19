import baseConfig, { defineConfig } from '@lib/scaffold/oxlint/config-svelte';

export { defineConfig };

export default defineConfig({
  extends: [baseConfig],
  ignorePatterns: ['**/*.js'],
});
