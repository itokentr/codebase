const regexpCache = new Map<string, RegExp>();
let usedNamespaces: NamespaceStore = new Set<string>();

export interface NamespaceStore {
  add(value: string): any;
  clear(): any;
  delete(value: string): any;
  has(value: string): boolean;
  keys(): SetIterator<string>;
}

export function clearNamespaces(): void {
  usedNamespaces.clear();
}

function createRegExps(namespaces: string): Map<string, RegExp> {
  const patterns = namespaces
    .replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
    .replaceAll('*', '.*')
    .split(/[,\s]+/);
  const ret = new Map<string, RegExp>();

  for (const pattern of patterns) {
    const regexp = new RegExp(`^${pattern}$`, 'i');
    ret.set(regexp.toString(), regexp);
  }
  return ret;
}

export function deleteNamespaces(namespaces: string): void {
  for (const pattern of createRegExps(namespaces).keys()) {
    usedNamespaces.delete(pattern);
  }
}

export function matchNamespace(namespace: string): boolean {
  let iterated = false;

  for (const pattern of usedNamespaces.keys()) {
    let regexp = regexpCache.get(pattern);

    if (!regexp) {
      regexp = new RegExp(pattern);
      regexpCache.set(pattern, regexp);
    }
    if (regexp.test(namespace)) {
      return true;
    }
    iterated = true;
  }
  return !iterated;
}

export function setNamespaceStore(store: NamespaceStore): void {
  usedNamespaces = store;
}

export function useNamespaces(
  namespace: string,
  ...namespaces: readonly string[]
): void {
  for (const n of [namespace, ...namespaces]) {
    for (const [pattern, regexp] of createRegExps(n).entries()) {
      if (!usedNamespaces.has(pattern)) {
        usedNamespaces.add(pattern);
        regexpCache.set(pattern, regexp);
      }
    }
  }
}
