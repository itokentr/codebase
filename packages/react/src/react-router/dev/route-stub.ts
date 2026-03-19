import type { RouteConfig, RouteConfigEntry } from '@react-router/dev/routes';
import { getAppDirectory } from '@react-router/dev/routes';
import * as path from 'node:path/posix';
import type { createRoutesStub } from 'react-router';

export type RouteStubEntry = Parameters<
  typeof createRoutesStub
>[0] extends (infer T)[]
  ? T & { id: string }
  : never;

export async function createRouteStubEntryMap(
  appDirectory?: string,
  routes?: readonly RouteConfigEntry[],
): Promise<Map<string, RouteStubEntry>> {
  return new Map(
    (await createRouteStubEntries(appDirectory, routes)).map((value) => [
      value.id,
      value,
    ]),
  );
}

export async function createRouteStubEntries(
  appDirectory?: string,
  routes?: readonly RouteConfigEntry[],
): Promise<RouteStubEntry[]> {
  appDirectory ??= getAppDirectory();
  if (!routes) {
    interface R {
      readonly default: RouteConfig;
    }
    routes = await Promise.resolve(
      ((await import(path.join(appDirectory, 'routes.ts'))) as R).default,
    );
  }
  const entries: RouteStubEntry[] = [];
  async function walk(route: RouteConfigEntry): Promise<void> {
    const componentKey: keyof RouteStubEntry = 'Component';
    const moduleName = path.isAbsolute(route.file)
      ? route.file
      : path.join(appDirectory as string, route.file);
    type Module = RouteStubEntry & {
      clientAction?: RouteStubEntry['action'];
      clientLoader?: RouteStubEntry['loader'];
      default?: RouteStubEntry[typeof componentKey];
    };
    const module = (await import(moduleName)) as Module;
    /** @see https://github.com/remix-run/react-router/blob/main/packages/react-router-dev/config/routes.ts#L354 */
    const id =
      route.id ?? path.normalize(route.file.replace(/\.[a-z0-9]+$/i, ''));

    entries.push({
      ...(module as RouteStubEntry),
      [componentKey]: module.default,
      action: module.action ?? module.clientAction,
      id,
      loader: module.loader ?? module.clientLoader,
      path: `/${route.path ?? ''}`,
    } as RouteStubEntry);

    if (route.children) {
      for (const child of route.children) {
        await walk(child);
      }
    }
  }
  for (const route of routes) {
    await walk(route);
  }
  return entries;
}
