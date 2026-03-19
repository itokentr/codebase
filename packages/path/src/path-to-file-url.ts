/// <reference types="../types/path-browserify/index.d.ts" />
import type { PlatformPath } from 'path-browserify';

const percentRegEx = /%/g;
const backslashRegEx = /\\/g;
const newlineRegEx = /\n/g;
const carriageReturnRegEx = /\r/g;
const tabRegEx = /\t/g;

/**
 * @see https://github.com/nodejs/node/blob/9f3aacbc27ac3f377d225ecd51aecb0f3de12566/lib/internal/url.js#L1381
 * @copyright Node.js contributors. All rights reserved.
 */
function encodePathChars(filepath: string): string {
  if (filepath.includes('%')) {
    filepath = filepath.replace(percentRegEx, '%25');
  }
  if (filepath.includes('\\')) {
    filepath = filepath.replace(backslashRegEx, '%5C');
  }
  if (filepath.includes('\n')) {
    filepath = filepath.replace(newlineRegEx, '%0A');
  }
  if (filepath.includes('\r')) {
    filepath = filepath.replace(carriageReturnRegEx, '%0D');
  }
  if (filepath.includes('\t')) {
    filepath = filepath.replace(tabRegEx, '%09');
  }
  return filepath;
}

/**
 * @see https://github.com/nodejs/node/blob/9f3aacbc27ac3f377d225ecd51aecb0f3de12566/lib/internal/url.js#L1396
 * @copyright Node.js contributors. All rights reserved.
 */
export function pathToFileUrl(filepath: string, path: PlatformPath): string {
  let resolved = path.resolve(filepath);
  const filePathLast = filepath.charCodeAt(filepath.length - 1);

  if (filePathLast === 47 && resolved.endsWith(path.sep)) {
    resolved += '/';
  }
  return `file://${encodePathChars(resolved)}`;
}
