import eslintReact from '@eslint-react/eslint-plugin';
import type { DummyRuleMap, OxlintConfig } from 'oxlint';
import baseConfig, * as base from './config.ts';

export { defineConfig } from './config.ts';

export const restrictedImports: typeof base.restrictedImports = [
  ...base.restrictedImports,
  {
    importNames: ['memo', 'useCallback', 'useMemo'],
    message: 'Instead use React Compiler for memoization',
    name: 'react',
  },
];

/** @see https://eslint-react.xyz/docs/migrating-from-eslint-plugin-react-hooks */
// oxlint-disable-next-line sort-keys
const hookRules: DummyRuleMap = {
  '@eslint-react/exhaustive-deps': 'error',
  '@eslint-react/rules-of-hooks': 'error',
  '@eslint-react/error-boundaries': 'error',
  '@eslint-react/globals': 'error',
  '@eslint-react/immutability': 'error',
  '@eslint-react/purity': 'error',
  '@eslint-react/refs': 'error',
  '@eslint-react/set-state-in-effect': 'error',
  '@eslint-react/set-state-in-render': 'error',
  '@eslint-react/static-components': 'error',
  '@eslint-react/unsupported-syntax': 'error',
  '@eslint-react/use-memo': 'error',
};

const config: OxlintConfig = base.defineConfig({
  categories: baseConfig.categories,
  env: {
    browser: true,
    es2024: true,
    node: true,
    worker: true,
  },
  jsPlugins: [
    { name: '@eslint-react', specifier: '@eslint-react/eslint-plugin' },
  ],
  plugins: ['eslint', 'import', 'jsx-a11y', 'react', 'typescript'],
  rules: {
    ...baseConfig.rules,
    ...eslintReact.configs['recommended-typescript'].rules,
    ...hookRules,
    'no-restricted-imports': ['error', { paths: restrictedImports }],
  },
});

export default config;
