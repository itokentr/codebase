import type { RouteConfigEntry } from '@react-router/dev/routes';

const paramsRegex = /(?::\w+\??|\*)/;

export function getDynamicPaths(
  routes: readonly RouteConfigEntry[],
  dynamicParamName: string | null = 'id',
): string[] {
  const ret: string[] = [];
  for (let { path } of routes) {
    if (!path) {
      continue;
    }
    if (!path.startsWith('/')) {
      path = `/${path}`;
    }
    paramsRegex.lastIndex = 0;
    if (paramsRegex.test(path)) {
      if (dynamicParamName != null) {
        paramsRegex.lastIndex = 0;
        path = path.replace(paramsRegex, dynamicParamName);
      }
      ret.push(`${path}/index.html`);
    }
  }
  return ret;
}

export function getPrerenderPaths(
  routes: readonly RouteConfigEntry[],
  dynamicParamName: string | null = 'id',
  parentPath: string = '/',
): string[] {
  if (!parentPath.startsWith('/')) {
    parentPath = `/${parentPath}`;
  }
  if (parentPath.length > 1 && parentPath.endsWith('/')) {
    parentPath = parentPath.substring(0, parentPath.length - 1);
  }
  const ret: string[] = [];
  // eslint-disable-next-line prefer-const
  for (let { children, path } of routes) {
    let nextParentPath = parentPath;
    if (path) {
      paramsRegex.lastIndex = 0;
      if (dynamicParamName != null && paramsRegex.test(path)) {
        paramsRegex.lastIndex = 0;
        path = path.replace(paramsRegex, dynamicParamName);
      }
      path = parentPath === '/' ? `/${path}` : `${parentPath}/${path}`;
      nextParentPath = path;
      ret.push(path);
    }
    if (children) {
      ret.push(
        ...getPrerenderPaths(children, dynamicParamName, nextParentPath),
      );
    }
  }
  // duplication will be present
  // when `fileSystemRoutes({indexOutlet: true})` is used at app/routes.ts
  return Array.from(new Set(ret));
}
