import type { PackageJson } from '@npmcli/package-json';
import { execSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import packageJson from '../package.json' with { type: 'json' };
import { build } from '../src/packages/esbuild/build-node.ts';
import { importAttrPlugin } from '../src/packages/esbuild/plugins/import-attr.ts';

// @ts-expect-error remove if not necessary
// eslint-disable-next-line no-unused-vars
async function pack(): Promise<void> {
  const binPackageJson: PackageJson = {
    bin: 'bin.js',
    exports: null,
    files: ['bin.js', 'bin.js.map'],
    license: 'MIT',
    name: 'create-scaffold',
    private: true,
    type: 'module',
    version: packageJson.version,
  };
  await writeFile(
    path.join(import.meta.dirname, 'package.json'),
    JSON.stringify(binPackageJson),
  );
  execSync('npm pack', { cwd: import.meta.dirname, stdio: 'inherit' });
}

async function main(): Promise<void> {
  await build({
    absWorkingDir: import.meta.dirname,
    entryPoints: ['bin.ts'],
    outdir: '.',
    plugins: [importAttrPlugin],
    sourcemap: 'inline',
    write: true,
  });
}

await main();
