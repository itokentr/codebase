import path from 'node:path';

export type Formatter = 'dprint' | 'oxfmt';
export type Framework = 'vite' | 'react' | 'vue' | 'svelte';
export type GitUtil = 'commitlint' | 'lint-staged';
export type Linter = 'eslint' | 'oxlint';

export interface Formatters {
  readonly css: Formatter | null;
  readonly html: Formatter | null;
  readonly react: Formatter | null;
  readonly svelte: Formatter | null;
  readonly typescript: Formatter | null;
  readonly vue: Formatter | null;
}

export interface Config {
  readonly formatters: Formatters;
  readonly framework: Framework | null;
  readonly gitUtil: readonly GitUtil[];
  readonly linter: Linter | null;
  readonly monorepo: boolean;
  readonly projectName: string;
}

export function getDefaultConfig(cwd: string): Config {
  return {
    formatters: {
      css: 'dprint',
      html: 'oxfmt',
      react: 'oxfmt',
      svelte: 'oxfmt',
      typescript: 'oxfmt',
      vue: 'oxfmt',
    },
    framework: null,
    gitUtil: ['lint-staged'],
    linter: 'oxlint',
    monorepo: false,
    projectName: path.basename(cwd) || 'my-project',
  };
}

export async function createScaffold(
  // oxlint-disable-next-line no-unused-vars
  cwd: string,
  // oxlint-disable-next-line no-unused-vars
  { formatters, framework, gitUtil, linter, monorepo, projectName }: Config,
): Promise<void> {
  //
}
