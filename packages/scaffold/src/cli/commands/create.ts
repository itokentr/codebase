import { Command } from '@commander-js/extra-typings';
import * as inquirer from '@inquirer/prompts';
import type {
  Config,
  Formatter,
  Formatters,
  Framework,
  GitUtil,
  Linter,
} from '../../packages/create-scaffold.ts';
import {
  createScaffold,
  getDefaultConfig,
} from '../../packages/create-scaffold.ts';

async function getFormatterPrompts(
  framework: Framework | null,
  defaultConfig: Config,
): Promise<Formatters> {
  let css: Formatter | null = defaultConfig.formatters.css;
  let html: Formatter | null = defaultConfig.formatters.html;
  const react: Formatter | null = defaultConfig.formatters.react;
  const svelte: Formatter | null = defaultConfig.formatters.svelte;
  let typescript: Formatter | null = defaultConfig.formatters.typescript;
  const vue: Formatter | null = defaultConfig.formatters.vue;
  let frameworkName: Framework | undefined;
  let frameworkValue: Formatter | null = null;
  const ret: Formatters = { css, html, react, svelte, typescript, vue };

  typescript = await inquirer.select({
    choices: [
      { value: 'dprint' },
      { value: 'oxfmt' },
      { name: 'none', value: null },
    ],
    default: typescript,
    message: `Formatter for TypeScript?`,
  });
  switch (framework) {
    case 'react':
    case 'svelte':
    case 'vue': {
      frameworkValue = await inquirer.select({
        choices: [
          { value: 'dprint' },
          { value: 'oxfmt' },
          { name: 'none', value: null },
        ],
        default: ret[framework],
        message: `Formatter for ${framework.toUpperCase()}?`,
      });
      frameworkName = framework;
      break;
    }
  }
  html = await inquirer.select({
    choices: [
      { value: 'dprint' },
      { value: 'oxfmt' },
      { name: 'none', value: null },
    ],
    default: html,
    message: `Formatter for HTML?`,
  });
  css = await inquirer.select({
    choices: [
      { value: 'dprint' },
      { value: 'oxfmt' },
      { name: 'none', value: null },
    ],
    default: css,
    message: `Formatter for CSS?`,
  });
  return frameworkName ? { ...ret, [frameworkName]: frameworkValue } : ret;
}

async function getPrompts(cwd: string, useDefault: boolean): Promise<Config> {
  const defaultConfig = getDefaultConfig(cwd);

  if (useDefault) {
    return defaultConfig;
  }
  const projectName = await inquirer.input({
    default: defaultConfig.projectName,
    message: 'Project name?',
  });
  const framework = await inquirer.select<Framework | null>({
    choices: [
      { disabled: true, value: 'react' },
      { disabled: true, value: 'vue' },
      { disabled: true, value: 'svelte' },
      { disabled: true, value: 'vite' },
      { name: 'none', value: null },
    ],
    default: defaultConfig.framework,
    message: 'Framework?',
  });
  const monorepo = await inquirer.confirm({
    default: framework ? true : defaultConfig.monorepo,
    message: 'Monorepo?',
  });
  const linter = await inquirer.select<Linter | null>({
    choices: [
      { value: 'oxlint' },
      { disabled: true, name: 'eslint (deprecated)', value: 'eslint' },
      { name: 'none', value: null },
    ],
    default: defaultConfig.linter,
    message: 'Linter?',
  });
  const formatters = await getFormatterPrompts(framework, defaultConfig);
  const gitUtil = await inquirer.checkbox<GitUtil>({
    choices: [
      {
        checked: defaultConfig.gitUtil.includes('lint-staged'),
        value: 'lint-staged',
      },
      {
        checked: defaultConfig.gitUtil.includes('commitlint'),
        value: 'commitlint',
      },
    ],
    message: 'Utils for Git?',
  });
  return { formatters, framework, gitUtil, linter, monorepo, projectName };
}

export const create = new Command('create')
  .option('-d, --dir <dir>', 'working directory', process.cwd())
  .option('-y, --yes', 'execute without any prompts', false)
  .action(async ({ dir, yes: useDefault }) => {
    await createScaffold(dir, await getPrompts(dir, useDefault));
  });
