import svKitJson from '@sveltejs/kit/package.json' with { type: 'json' };
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runScript } from './run-script.ts';

export async function runSvelteKitSync(root: string): Promise<void> {
  const svKitRoot = path.dirname(
    fileURLToPath(import.meta.resolve('@sveltejs/kit/package.json', root)),
  );
  const svKitBin = path.resolve(svKitRoot, svKitJson.bin['svelte-kit']);
  await runScript(svKitBin, ['sync'], root);
}
