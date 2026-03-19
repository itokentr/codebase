import baseConfig, * as base from './config.ts';

export { defineConfig } from './config.ts';

export const restrictedImports: typeof base.restrictedImports = [
  ...base.restrictedImports,
];

export default base.defineConfig({
  categories: baseConfig.categories,
  overrides: [
    {
      env: {
        browser: true,
        es2024: true,
        node: true,
        worker: true,
      },
      files: ['**/*.{js,ts}'],
      plugins: baseConfig.plugins,
      rules: baseConfig.rules,
    },
    // TODO: linting a svelte template is not supported yet
    // https://oxc.rs/compatibility.html
    {
      env: {
        browser: true,
        es2024: true,
        node: true,
        worker: true,
      },
      files: ['**/*.svelte?(.[jt]s)'],
      plugins: baseConfig.plugins,
      rules: {
        ...baseConfig.rules,
      },
    },
  ],
});
