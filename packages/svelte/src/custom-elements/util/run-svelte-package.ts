import svPkgJson from '@sveltejs/package/package.json' with { type: 'json' };
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runScript } from './run-script.ts';

export async function runSveltePackage({ outputTo, root, srcDir }: {
  readonly root: string;
  readonly srcDir: string;
  readonly outputTo: string;
}): Promise<void> {
  const svPkgRoot = path.dirname(
    fileURLToPath(
      import.meta.resolve('@sveltejs/package/package.json', root),
    ),
  );
  const svPkgBin = path.resolve(svPkgRoot, svPkgJson.bin['svelte-package']);
  await runScript(svPkgBin, ['-i', srcDir, '-o', outputTo], root);
}
