/// <reference types="../types/path-browserify/index.d.ts" />
import type {
  FormatInputPathObject,
  ParsedPath,
  PlatformPath,
} from 'path-browserify';

declare const kAbsPath: unique symbol;
declare const kPosixPath: unique symbol;
declare const kRelPath: unique symbol;

export type { FormatInputPathObject, ParsedPath, PlatformPath };

export type AbsolutePath = string & { readonly [kAbsPath]: never };
export type PosixPath<T extends AbsolutePath | RelativePath> = T & {
  readonly [kPosixPath]: never;
};
export type RelativePath = string & { readonly [kRelPath]: never };
export type PathLike = AbsolutePath | RelativePath | URL;

export interface FormatInputAbsolutePathObject extends FormatInputPathObject {
  readonly dir: AbsolutePath;
  readonly root?: never;
}

export interface FormatInputRelativePathObject extends FormatInputPathObject {
  readonly dir: RelativePath;
  readonly root?: never;
}

export interface MatchesGlobOptions {
  readonly dot?: boolean | undefined;
  readonly matchBase?: boolean | undefined;
}

export interface ParsedAbsolutePath extends ParsedPath {
  dir: AbsolutePath;
  root: AbsolutePath;
}

export interface ParsedRelativePath extends ParsedPath {
  dir: RelativePath;
  root: never;
}

export interface PathModule extends PlatformPath {
  // #region node api
  // PlatformPath の extends ではメソッドがオーバーロードにならないので
  // node の api も再宣言する
  readonly delimiter: ';' | ':';
  readonly sep: '\\' | '/';
  basename(value: string | URL, suffix?: string): RelativePath;
  dirname(value: AbsolutePath | URL): AbsolutePath;
  dirname(value: RelativePath): RelativePath;
  dirname(path: string): string;
  extname(path: string): string;
  format(value: FormatInputAbsolutePathObject): AbsolutePath;
  format(value: FormatInputRelativePathObject): RelativePath;
  format(pathObject: FormatInputPathObject): string;
  isAbsolute(value: string): value is AbsolutePath;
  join(value: AbsolutePath | URL, ...paths: readonly string[]): AbsolutePath;
  join(value: RelativePath, ...paths: readonly string[]): RelativePath;
  join(...paths: readonly string[]): string;
  matchesGlob(
    path: string | URL,
    pattern: string,
    options?: MatchesGlobOptions,
  ): boolean;
  normalize(value: AbsolutePath | URL): AbsolutePath;
  normalize(value: RelativePath): RelativePath;
  normalize(path: string): string;
  parse(value: RelativePath): ParsedRelativePath;
  parse(value: AbsolutePath | URL): ParsedAbsolutePath;
  parse(path: string): ParsedPath;
  relative(from: string, to: string): RelativePath;
  resolve(value: AbsolutePath | URL, ...paths: readonly string[]): AbsolutePath;
  resolve(
    value: RelativePath,
    ...paths: readonly (AbsolutePath | URL)[]
  ): AbsolutePath;
  resolve(value: RelativePath, ...paths: readonly RelativePath[]): RelativePath;
  resolve(...paths: readonly string[]): string;
  // #endregion
  // #region additional api
  ensureAbsolutePath(value: string | URL, cwd?: AbsolutePath): AbsolutePath;
  ensurePosixPath<T extends AbsolutePath | RelativePath>(
    value: T,
    stripTrailing?: boolean,
  ): PosixPath<T>;
  ensurePosixPath(value: string | URL, stripTrailing?: boolean): string;
  ensureRelativePath(value: string | URL, cwd?: AbsolutePath): RelativePath;
  filePathToUrl(path: string): URL;
  fileUrlToParsedPath(url: string | URL): ParsedPath;
  fileUrlToPath(url: string | URL): AbsolutePath;
  isChildPath(
    parent: AbsolutePath,
    child: string,
    descendant?: boolean,
  ): boolean;
  isFileUrl(value: string): boolean;
  isParentPath(parent: string, child: string, ancestor?: boolean): boolean;
  isRelative(value: string): value is RelativePath;
  makeMatchRegExp(pattern: string, options?: MatchesGlobOptions): RegExp;
  replaceExtention<T extends AbsolutePath | RelativePath>(
    pathValue: T,
    replaceWith: string,
  ): T;
  replaceExtention<T extends AbsolutePath | RelativePath>(
    pathValue: T,
    search: RegExp | string,
    replaceWith: string,
  ): T;
  replaceExtention(pathValue: string, replaceWith: string): string;
  replaceExtention(
    pathValue: string,
    search: RegExp | string,
    replaceWith: string,
  ): string;
  replaceName(pathValue: AbsolutePath | URL, replaceWith: string): AbsolutePath;
  replaceName(pathValue: RelativePath, replaceWith: string): RelativePath;
  replaceName(pathValue: string, replaceWith: string): string;
  // #endregion
}

declare const path: PathModule;
export default path;

export declare function abs(value: TemplateStringsArray): AbsolutePath;
export declare function rel(value: TemplateStringsArray): RelativePath;
