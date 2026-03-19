// @ts-check
/// <reference lib="esnext" />
/// <reference types="node" />
import { RuleConfigSeverity } from '@commitlint/types';
import { glob } from 'node:fs/promises';
import { basename } from 'node:path';
import packageJson from './package.json' with { type: 'json' };

const workspaces = await Array.fromAsync(
  glob(packageJson.workspaces.packages, { cwd: import.meta.dirname }),
);

/** @type {import('@commitlint/types').UserConfig } */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      RuleConfigSeverity.Error,
      'always',
      workspaces.map((value) => basename(value)),
    ],
  },
};
