import baseConfig, { defineConfig } from '@lib/scaffold/oxlint/config-react';

export { defineConfig };

export default defineConfig({
  extends: [baseConfig],
  ignorePatterns: ['**/*.js', '**/*.jsx'],
});
