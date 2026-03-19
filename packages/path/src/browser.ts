import impl from 'path-browserify';
import { AbstractPathModule } from './abstract-path.ts';
import type { AbsolutePath, PlatformPath, RelativePath } from './types.ts';

interface GlobalThis {
  readonly location?: { readonly pathname: string } | undefined;
}

class BrowserPathModule extends AbstractPathModule {
  protected readonly p: PlatformPath = impl;

  protected get cwd(): AbsolutePath {
    const { pathname } = (globalThis as unknown as GlobalThis).location ?? {
      pathname: '/',
    };
    const ret =
      this.extname(pathname) === '' ? pathname : this.dirname(pathname);
    return ret as AbsolutePath;
  }
}

const path = new BrowserPathModule();

export function abs(value: TemplateStringsArray): AbsolutePath {
  if (value[0] === undefined) {
    throw TypeError();
  }
  return path.ensureAbsolutePath(value[0]);
}

export function rel(value: TemplateStringsArray): RelativePath {
  if (value[0] === undefined) {
    throw TypeError();
  }
  return path.ensureRelativePath(value[0]);
}

export default path;
