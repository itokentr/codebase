// @ts-check
/// <reference lib="esnext" />
/// <reference types="node" />
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import module from 'node:module';
import path from 'node:path';
import { format as sprintf } from 'node:util';

const ARG_MAX = Number(
  spawnSync('getconf ARG_MAX', { encoding: 'utf8', shell: true }).stdout
    || '131071',
);
assert.ok(ARG_MAX > 0, 'unable to find ARG_MAX');

/**
 * @param {string} commandFormat
 * @param {readonly string[]} files
 * @returns {string[]}
 */
function toCommandStrings(commandFormat, files) {
  if (files.length === 0) {
    return [];
  }
  /** @type {string[]} */
  const commands = [];
  let currentCommand = commandFormat.replace(/ %s$/, '');
  let hasAddedFile = false;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const cmd = sprintf(`${currentCommand} %s`, file);

    if (cmd.length > ARG_MAX) {
      if (!hasAddedFile) {
        throw Error(
          `ARG_MAX "${ARG_MAX}" seems very short, otherwise very long file name "${file}"`,
        );
      }
      commands.push(currentCommand);
      currentCommand = commandFormat;
      hasAddedFile = false;
      i -= 1;
    } else {
      currentCommand = cmd;
      hasAddedFile = true;
    }
  }
  if (hasAddedFile) {
    commands.push(currentCommand);
  }
  return commands;
}

/**
 * @param {readonly string[]} files
 * @param {string[]} commands
 */
function useFormatter(files, commands) {
  commands.push(
    ...toCommandStrings(`bunx dprint check --list-different %s`, files),
  );
}

/**
 * @param {readonly string[]} files
 * @param {string[]} commands
 */
function useLinter(files, commands) {
  /** @type {Map<string, [packageName: string, ...files: string[]]>} */
  const packageDirs = new Map();
  const extRegex = /\.(?:tsx?|jsx?|svelte|vue)$/;

  for (const file of files) {
    if (!extRegex.test(file)) {
      continue;
    }
    // TODO: expect bun to have named export for findPackageJSON
    const packageJsonName = module.findPackageJSON(file, import.meta.dirname);
    if (!packageJsonName) {
      continue;
    }
    const packageDir = path.dirname(packageJsonName);
    if (packageDir === import.meta.dirname) {
      continue;
    }
    let files = packageDirs.get(packageDir);
    if (!files) {
      /** @type {{name: string}} */
      const packageJson = JSON.parse(readFileSync(packageJsonName, 'utf-8'));
      files = [packageJson.name];
      packageDirs.set(packageDir, files);
    }
    files.push(file);
  }
  if (packageDirs.size > 0) {
    for (const [name, ...files] of packageDirs.values()) {
      commands.push(
        ...toCommandStrings(
          `bun run --filter=${name} --if-present lint -- %s`,
          files,
        ),
      );
    }
  }
}

/** @type {import('lint-staged').Configuration} */
const task = (files) => {
  /** @type {string[]} */
  const commands = [];
  useFormatter(files, commands);
  useLinter(files, commands);
  return commands;
};

export default task;
