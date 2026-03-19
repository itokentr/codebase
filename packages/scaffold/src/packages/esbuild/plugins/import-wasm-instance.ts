import type {} from '@lib/types/web/fetch';
import type {
  Imports,
  WebAssemblyInstantiatedSource,
} from '@lib/types/web/wasm';
import type { Plugin } from 'esbuild';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

async function instantiate(
  dataUri: string,
  importObject: Imports | undefined,
): Promise<WebAssemblyInstantiatedSource> {
  return WebAssembly.instantiateStreaming(await fetch(dataUri), importObject);
}

/**
 * Import `*.wasm` file with instantiation.
 * @example
 * ```typescript
 * /// <reference types="@lib/scaffold/packages/esbuild/plugins/wasm-instance.ts" />
 * import instantiate from './something.wasm';
 * const {instance, module} = instantiate(importObject);
 * ```
 */
export const importWasmInstancePlugin: Plugin = {
  name: 'esbuild-plugin-import-wasm-instance',
  setup(build) {
    build.onResolve({ filter: /\.wasm$/ }, ({ path }) => {
      let url: URL | undefined;
      try {
        url = new URL(path);
      } catch {
        //
      }
      if (url) {
        url = new URL(url);
      }
      if (url) {
        switch (url.protocol) {
          case 'file:': {
            break;
          }
          default: {
            return { external: true, path };
          }
        }
      } else {
        //
      }
      return { path };
    });
    build.onLoad({ filter: /\.wasm$/ }, async ({ path }) => {
      let url: URL;
      try {
        url = new URL(path);
      } catch {
        url = pathToFileURL(path);
      }
      assert.equal(
        url.protocol,
        'file:',
        `unexpected url protocol to import: ${path}`,
      );
      const dataUriValue = JSON.stringify(
        'data:application/wasm;base64,'
          + (await readFile(url, { encoding: 'base64' })),
      );
      return {
        contents: `${instantiate.toString()}
export default importObject => ${instantiate.name}(${dataUriValue}, importObject);`,
      };
    });
  },
};

export default importWasmInstancePlugin;
