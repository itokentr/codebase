import impl from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { AbstractPathModule } from './abstract-path.ts';
import type {
  AbsolutePath,
  MatchesGlobOptions,
  PathModule,
  RelativePath,
} from './types.ts';

type NodePath = typeof impl;

abstract class AbstractNodePath extends AbstractPathModule implements NodePath {
  protected abstract override readonly p: NodePath;

  get cwd(): AbsolutePath {
    return process.cwd() as AbsolutePath;
  }

  get posix(): NodePath & PathModule {
    return posix;
  }

  get win32(): NodePath & PathModule {
    return win32;
  }

  override filePathToUrl(path: string): URL {
    return pathToFileURL(path);
  }

  override fileUrlToPath(url: URL): AbsolutePath {
    return fileURLToPath(url) as AbsolutePath;
  }

  override matchesGlob(
    path: string | URL,
    pattern: string,
    options?: MatchesGlobOptions,
  ): boolean {
    if (!options) {
      return impl.matchesGlob(
        typeof path === 'string' ? path : this.fileUrlToPath(path),
        pattern,
      );
    }
    return super.matchesGlob(path, pattern, options);
  }

  toNamespacedPath(path: string): string {
    return this.p.toNamespacedPath(path);
  }
}

const posix: NodePath & PathModule = new (class extends AbstractNodePath {
  protected readonly p: NodePath = impl.posix;
})();

const win32: NodePath & PathModule = new (class extends AbstractNodePath {
  protected readonly p: NodePath = impl.win32;
})();

class NodePathModule extends AbstractNodePath implements NodePath {
  protected readonly p: NodePath = impl;
}

const path = new NodePathModule();

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
