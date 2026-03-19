import { makeRe, minimatch, type MinimatchOptions } from 'minimatch';
import { ensurePosixPath } from './ensure-posix-path.ts';
import { fileUrlToPath } from './file-url-to-path.ts';
import { pathToFileUrl } from './path-to-file-url.ts';
import type {
  AbsolutePath,
  FormatInputAbsolutePathObject,
  FormatInputPathObject,
  FormatInputRelativePathObject,
  MatchesGlobOptions,
  ParsedAbsolutePath,
  ParsedPath,
  ParsedRelativePath,
  PathModule,
  PlatformPath,
  PosixPath,
  RelativePath,
} from './types.ts';

export abstract class AbstractPathModule implements PathModule {
  protected abstract readonly cwd: AbsolutePath;
  protected abstract readonly p: PlatformPath;

  get delimiter(): ';' | ':' {
    return this.p.delimiter;
  }

  get sep(): '\\' | '/' {
    return this.p.sep;
  }

  basename(value: string | URL, suffix?: string): RelativePath {
    return this.p.basename(this.#coerceToBePath(value), suffix) as RelativePath;
  }

  dirname(value: AbsolutePath | URL): AbsolutePath;
  dirname(value: RelativePath): RelativePath;
  dirname(value: string): string;
  dirname(value: string | URL): string {
    return this.p.dirname(this.#coerceToBePath(value));
  }

  ensureAbsolutePath(value: string | URL, cwd?: AbsolutePath): AbsolutePath {
    value = this.#coerceToBePath(value);

    if (!this.isAbsolute(value)) {
      return this.resolve(cwd ?? this.cwd, value);
    }
    return value;
  }

  ensurePosixPath<T extends AbsolutePath | RelativePath>(
    value: T,
    stripTrailing?: boolean,
  ): PosixPath<T>;
  ensurePosixPath(value: string | URL, stripTrailing?: boolean): string;
  ensurePosixPath(value: string | URL, stripTrailing?: boolean): string {
    return ensurePosixPath(value, this.sep, stripTrailing);
  }

  ensureRelativePath(value: string | URL, cwd?: AbsolutePath): RelativePath {
    value = this.#coerceToBePath(value);

    if (!this.isRelative(value)) {
      return this.relative(cwd ?? this.cwd, value);
    }
    return value;
  }

  extname(path: string): string {
    return this.p.extname(path);
  }

  filePathToUrl(path: string): URL {
    return new URL(pathToFileUrl(path, this));
  }

  fileUrlToParsedPath(url: string | URL): ParsedAbsolutePath {
    return this.parse(this.fileUrlToPath(url));
  }

  fileUrlToPath(url: string | URL): AbsolutePath {
    return fileUrlToPath(url);
  }

  format(value: FormatInputAbsolutePathObject): AbsolutePath;
  format(value: FormatInputRelativePathObject): RelativePath;
  format(value: FormatInputPathObject): string;
  format(value: FormatInputPathObject): string {
    return this.p.format(value);
  }

  isAbsolute(value: string): value is AbsolutePath {
    return this.p.isAbsolute(value);
  }

  isChildPath(
    parent: AbsolutePath,
    child: string,
    descendant: boolean = false,
  ): boolean {
    const resolved = this.resolve(parent, child);
    const relative = this.relative(parent, resolved);

    if (relative.length === 0) {
      return false;
    }
    const posix = this.ensurePosixPath(relative);

    if (posix.startsWith('../')) {
      return false;
    }
    // eslint-disable-next-line typescript/no-unnecessary-condition
    return descendant ? true : this.dirname(relative) === '.';
  }

  isFileUrl(value: string): boolean {
    try {
      return new URL(value).protocol === 'file:';
    } catch {
      return false;
    }
  }

  isParentPath(
    parent: string,
    child: string,
    ancestor: boolean = false,
  ): boolean {
    const rel = this.relative(child, parent);

    if (rel.length === 0) {
      return false;
    }
    const ancestors = rel.split(this.sep);

    for (const p of ancestors) {
      if (p !== '..') {
        return false;
      }
    }
    return ancestor ? true : ancestors.length === 1;
  }

  isRelative(value: string): value is RelativePath {
    return !this.isAbsolute(value);
  }

  join(value: AbsolutePath | URL, ...paths: readonly string[]): AbsolutePath;
  join(value: RelativePath, ...paths: readonly string[]): RelativePath;
  join(...paths: readonly string[]): string;
  join(...paths: readonly [URL | string, ...string[]]): string {
    return this.p.join(...this.#coerceToBePathList(paths));
  }

  makeMatchRegExp(pattern: string, options?: MatchesGlobOptions): RegExp {
    const re = makeRe(pattern, this.#makeMinimatchOptions(options));
    if (!re) {
      throw TypeError(`unable to make regex with the pattern "${pattern}"`);
    }
    return re;
  }

  matchesGlob(
    path: string | URL,
    pattern: string,
    options?: MatchesGlobOptions,
  ): boolean {
    path = this.ensurePosixPath(path);
    pattern = this.ensurePosixPath(pattern);
    if (minimatch(path, pattern, this.#makeMinimatchOptions(options))) {
      return true;
    }
    return false;
  }

  normalize(value: AbsolutePath | URL): AbsolutePath;
  normalize(value: RelativePath): RelativePath;
  normalize(value: string): string;
  normalize(value: string | URL): string {
    return this.p.normalize(this.#coerceToBePath(value));
  }

  parse(value: AbsolutePath | URL): ParsedAbsolutePath;
  parse(value: RelativePath): ParsedRelativePath;
  parse(value: string): ParsedPath;
  parse(value: string | URL): ParsedPath {
    return this.p.parse(this.#coerceToBePath(value));
  }

  relative(from: string, to: string): RelativePath {
    return this.p.relative(from, to) as RelativePath;
  }

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
  replaceExtention(
    pathValue: string | URL,
    searchOrReplace: RegExp | string,
    replaceWith?: string,
  ): string {
    let search: RegExp | undefined;

    if (typeof replaceWith === 'undefined') {
      replaceWith = searchOrReplace as string;
      search = undefined;
    } else {
      search =
        typeof searchOrReplace === 'string'
          ? new RegExp(searchOrReplace.replace(/(\W)/g, '\\$1'))
          : searchOrReplace;
    }
    const parsed = this.parse(this.#coerceToBePath(pathValue));
    let replaced: string;

    if (search) {
      replaced = parsed.ext.replace(search, replaceWith);
    } else {
      if (!replaceWith.startsWith('.')) {
        replaceWith = `.${replaceWith}`;
      }
      replaced = replaceWith;
    }
    return this.join(parsed.dir, `${parsed.name}${replaced}`);
  }

  replaceName(pathValue: AbsolutePath | URL, replaceWith: string): AbsolutePath;
  replaceName(pathValue: RelativePath, replaceWith: string): RelativePath;
  replaceName(pathValue: string, replaceWith: string): string;
  replaceName(pathValue: string | URL, replaceWith: string): string {
    const parsed = this.parse(this.#coerceToBePath(pathValue));
    return this.join(parsed.dir, `${replaceWith}${parsed.ext}`);
  }

  resolve(value: AbsolutePath | URL, ...paths: string[]): AbsolutePath;
  resolve(value: RelativePath, ...paths: (AbsolutePath | URL)[]): AbsolutePath;
  resolve(value: RelativePath, ...paths: RelativePath[]): RelativePath;
  resolve(...paths: string[]): string;
  resolve(...paths: (URL | string)[]): string {
    return this.p.resolve(...this.#coerceToBePathList(paths));
  }

  #coerceToBePath(value: string | URL): string {
    try {
      // file url ならパスに変換して返す
      return this.fileUrlToPath(value);
    } catch (e) {
      try {
        // それ以外の url ならエラー
        new URL(value);
        throw e;
      } catch {
        // url ではない文字列はパスと見なす
        return value as string;
      }
    }
  }

  #coerceToBePathList(value: readonly (string | URL)[]): readonly string[] {
    const list = new Array<string>(value.length);
    for (let i = 0; i < value.length; i++) {
      const v = value[i];
      // eslint-disable-next-line typescript/no-non-null-assertion
      list[i] = this.#coerceToBePath(v!);
    }
    return list;
  }

  #makeMinimatchOptions(
    options: MatchesGlobOptions | undefined,
  ): MinimatchOptions {
    // eslint-disable-next-line sort-keys
    return {
      // from https://github.com/nodejs/node/blob/dc5d0f9bb4d017c4a4c7e61653da932df8fd9d93/lib/internal/fs/glob.js#L745
      nocase: false,
      windowsPathsNoEscape: true,
      nonegate: true,
      nocomment: true,
      optimizationLevel: 2,
      platform: 'linux',
      nocaseMagicOnly: true,
      // additional
      dot: options?.dot ?? false,
      matchBase: options?.matchBase ?? false,
    };
  }
}
