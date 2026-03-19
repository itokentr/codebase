import type { Loader, Plugin } from 'esbuild';
import { readFile } from 'node:fs/promises';

/**
 * @example
 * ```typescript
 * import base64Value from './something' with {type: 'base64'};
 * import uint8Value from './something' with {type: 'binary'};
 * import uint8Value from './something' with {type: 'bytes'};
 * import cssValue from './something' with {type: 'css'};
 * import dataUrlValue from './something' with {type: 'dataurl'};
 * import filePathValue from './something' with {type: 'file'};
 * import jsonValue from './something' with {type: 'json'};
 * import stringValue from './something' with {type: 'text'};
 * ```
 */
export const importAttrPlugin: Plugin = {
  name: 'esbuild-plugin-import-attr',
  setup(build) {
    build.onLoad(
      { filter: /./ },
      async ({ path, with: { type: importType } }) => {
        let loader: Loader | undefined;
        switch (importType) {
          case 'base64':
          case 'binary':
          case 'css':
          case 'dataurl':
          case 'file':
          case 'json':
          case 'text': {
            loader = importType;
            break;
          }
          case 'bytes': {
            loader = 'binary';
            break;
          }
          default: {
            break;
          }
        }
        return loader
          ? {
              contents: await readFile(path),
              loader,
            }
          : undefined;
      },
    );
  },
};

export default importAttrPlugin;
