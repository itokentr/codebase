import type { RouteConfigEntry } from '@react-router/dev/routes';
import { getAppDirectory } from '@react-router/dev/routes';
import { readdir, stat } from 'node:fs/promises';
import { posix as path } from 'node:path';

export interface FileSystemRoutesOptions {
  readonly appDir?: string;
  /** @default false */
  readonly indexOutlet?: boolean;
}

export async function fileSystemRoutes({
  appDir,
  indexOutlet,
}: FileSystemRoutesOptions = {}): Promise<RouteConfigEntry[]> {
  appDir ??= getAppDirectory();
  indexOutlet ??= false;
  const into: RouteConfigEntry[] = [];
  const routesRoot = path.join(appDir, 'routes');
  const { nextInto } = await storeRouteConfigEntry(
    routesRoot,
    true,
    appDir,
    into,
    '',
    indexOutlet,
  );
  await walkThrough(routesRoot, appDir, nextInto, '', indexOutlet);
  return into;
}

const outletId = `outlet_${Math.random().toString(36).substring(2, 10)}`;

/**
 * convert `@react-router/fs-routes` like path to
 * acceptable by `@react-router/dev/routes`
 *
 * @see https://reactrouter.com/how-to/file-route-conventions
 * @see https://reactrouter.com/start/framework/routing
 */
function canonRouteDirName(name: string, parent: string): string {
  if (name.startsWith('($')) {
    let value: string | undefined;
    if (name.endsWith(')')) {
      value = name.substring(2, Math.max(2, name.length - 1));
    }
    if (!value) {
      throw Error(`illigal directory name "${name}" at ${parent}`);
    }
    return `:${value}?`;
  }
  if (name.startsWith('$')) {
    if (name === '$') {
      return '*';
    }
    return `:${name.substring(1)}`;
  }
  return name;
}

async function getFilename(dir: string, name: string): Promise<string | null> {
  const fullName = path.join(dir, name);
  try {
    return (await stat(fullName)).isFile() ? fullName : null;
  } catch {
    return null;
  }
}

async function getLayoutFilename(dir: string): Promise<string | null> {
  return getFilename(dir, 'layout.tsx');
}

/** @returns filename and boolean indicates whether the file is an index */
async function getRouteComponentFile(
  dir: string,
): Promise<[string, boolean] | null> {
  let value = await getFilename(dir, 'route.tsx');
  if (value) {
    return [value, false];
  }
  // https://reactrouter.com/how-to/file-route-conventions#basic-routes
  // https://reactrouter.com/start/framework/routing#index-routes
  value = await getFilename(dir, '_index.tsx');
  if (value) {
    return [value, true];
  }
  return null;
}

/**
 * @param isRoutesRoot whether called for the root route or not
 * @param appDir directory name returned by {@link getAppDirectory}
 */
async function storeRouteConfigEntry(
  targetDirName: string,
  isRoutesRoot: boolean,
  appDir: string,
  into: RouteConfigEntry[],
  pathPrefix: string,
  indexOutlet: boolean,
): Promise<{ nextInto: RouteConfigEntry[]; nextPrefix: string }> {
  const layoutTsx = await getLayoutFilename(targetDirName);
  const routeTsx = await getRouteComponentFile(targetDirName);
  const urlDirName = canonRouteDirName(
    path.basename(targetDirName),
    path.dirname(targetDirName),
  );
  const routePath = isRoutesRoot
    ? ''
    : indexOutlet
      ? urlDirName
      : path.join(pathPrefix, urlDirName);
  let nextInto = into;
  let nextPrefix = path.join(pathPrefix, urlDirName);

  if (layoutTsx) {
    const layoutEntry = {
      children: [] as RouteConfigEntry[],
      file: path.relative(appDir, layoutTsx),
    } satisfies RouteConfigEntry;
    nextInto.push(layoutEntry);
    nextInto = layoutEntry.children;

    if (!routeTsx) {
      nextPrefix = pathPrefix;
    }
  }
  if (routeTsx) {
    const file = path.relative(appDir, routeTsx[0]);
    const routeEntry: RouteConfigEntry = {
      file: path.relative(appDir, routeTsx[0]),
    };
    // for routes using <WithRouterOutlet>
    if (indexOutlet) {
      const id = path.join(path.dirname(file), outletId);
      const subrouteEntry: RouteConfigEntry = {
        children: [],
        file: path.relative(appDir, routeTsx[0]),
        id,
      };
      routeEntry.index = true;
      if (routePath) {
        routeEntry.path = routePath;
        subrouteEntry.path = routePath;
      }
      nextInto.push(routeEntry, subrouteEntry);
      nextInto = subrouteEntry.children as typeof nextInto;
    } else {
      if (routeTsx[1]) {
        routeEntry.index = true;
      } else {
        routeEntry.path = routePath;
      }
      nextInto.push(routeEntry);
    }
  }
  return { nextInto, nextPrefix };
}

async function walkThrough(
  parent: string,
  appDir: string,
  into: RouteConfigEntry[],
  pathPrefix: string,
  indexOutlet: boolean,
): Promise<void> {
  const paramRegex = /\/(?:\(\$[^/]+\)|\$[^/]*)/;
  for (const entry of await readdir(parent, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const { name: dirName } = entry;
      const fullName = path.join(parent, dirName);
      const { nextInto, nextPrefix } = await storeRouteConfigEntry(
        path.join(parent, entry.name),
        false,
        appDir,
        into,
        pathPrefix,
        indexOutlet,
      );
      // /path/to/page と /path/to/$id のように同じ階層にパラメータがある場合に
      // パラメータの位置を配列内の後ろにする
      into.sort(({ file: a }, { file: b }) => {
        const segsA = a.split('/');
        const segsB = b.split('/');
        const n = Math.min(segsA.length, segsB.length);
        let endIndex = 0;
        for (let i = 0; i < n; i++) {
          if (segsA[i] !== segsB[i]) {
            endIndex = i + 1;
            break;
          }
        }
        const av = segsA.slice(0, endIndex).join('/');
        const bv = segsB.slice(0, endIndex).join('/');
        const cmp = av > bv ? 1 : -1;
        return paramRegex.test(av)
          ? paramRegex.test(bv)
            ? cmp
            : 1
          : paramRegex.test(bv)
            ? -1
            : cmp;
      });
      await walkThrough(fullName, appDir, nextInto, nextPrefix, indexOutlet);
    }
  }
}
