import type { AbsolutePath } from './types.ts';

/**
 * @see https://github.com/nodejs/node/blob/9f3aacbc27ac3f377d225ecd51aecb0f3de12566/lib/internal/url.js#L1354
 * @copyright Node.js contributors. All rights reserved.
 */
export function fileUrlToPath(value: string | URL): AbsolutePath {
  const url = typeof value === 'string' ? new URL(value) : value;
  if (url.protocol !== 'file:') {
    throw new TypeError('the URL must be of scheme file');
  }
  if (url.hostname !== '') {
    throw new TypeError('file URL host must be empty');
  }
  const pathname = url.pathname;
  for (let n = 0; n < pathname.length; n++) {
    if (pathname[n] === '%') {
      const third = (pathname.codePointAt(n + 2) ?? 0) | 0x20;
      if (pathname[n + 1] === '2' && third === 102) {
        throw new TypeError(
          'file URL path must not include encoded / characters',
        );
      }
    }
  }
  return decodeURIComponent(pathname) as AbsolutePath;
}
