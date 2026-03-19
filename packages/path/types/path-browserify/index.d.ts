/**
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6d0fd0d6183bbde47f641c69ffe87c9cc0e422c7/types/node/v24/path.ts
 * @copyright Node.js contributors. All rights reserved.
 */
declare module 'path-browserify' {
  export interface ParsedPath {
    base: string;
    dir: string;
    ext: string;
    name: string;
    root: string;
  }
  export interface FormatInputPathObject {
    base?: string | undefined;
    dir?: string | undefined;
    ext?: string | undefined;
    name?: string | undefined;
    root?: string | undefined;
  }
  export interface PlatformPath {
    readonly delimiter: ';' | ':';
    readonly sep: '\\' | '/';
    basename(path: string, suffix?: string): string;
    dirname(path: string): string;
    extname(path: string): string;
    format(pathObject: FormatInputPathObject): string;
    isAbsolute(path: string): boolean;
    join(...paths: string[]): string;
    normalize(path: string): string;
    parse(path: string): ParsedPath;
    relative(from: string, to: string): string;
    resolve(...paths: string[]): string;
  }
  const path: PlatformPath;
  export default path;
}
