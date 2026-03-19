import baseConfig, { defineConfig } from '@lib/scaffold/oxlint/config';

export { defineConfig };

export default defineConfig({
  extends: [baseConfig],
  ignorePatterns: ['**/*.js'],
});
