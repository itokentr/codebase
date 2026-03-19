export interface HrefCanActiveOptions {
  readonly currentPath: string;
  readonly excludeActive?: readonly (string | RegExp)[];
  readonly excludeSemiActive?: readonly (string | RegExp)[];
  readonly href: unknown;
}

export function hrefCanActive({
  currentPath,
  excludeActive,
  excludeSemiActive,
  href: hrefValue,
}: HrefCanActiveOptions): 'active' | 'semi-active' | null {
  let href: string;

  if (!hrefValue) {
    return null;
  }
  switch (typeof hrefValue) {
    case 'string': {
      href = hrefValue;
      break;
    }
    case 'object': {
      // url object used by next.js
      const { pathname } = hrefValue as Partial<{ pathname: string }>;
      if (!pathname) {
        return null;
      }
      href = pathname;
      break;
    }
    default: {
      return null;
    }
  }
  if (href === '#') {
    return null;
  }
  currentPath = canonPath(currentPath);
  href = canonPath(href);

  if (href === currentPath) {
    if (canActive(currentPath, excludeActive)) {
      return 'active';
    }
  } else if (currentPath.startsWith(href)) {
    if (canActive(currentPath, excludeSemiActive)) {
      return 'semi-active';
    }
  }
  return null;
}

function canonPath(value: string): string {
  let path: string;
  try {
    const url = new URL(value, 'http://0.0.0.0');
    path = url.pathname;
  } catch {
    path = value;
  }
  return !path.endsWith('/') ? `${path}/` : path;
}

function canActive(
  value: string,
  exclude: readonly (string | RegExp)[] | undefined,
): boolean {
  if (!exclude) {
    return true;
  }
  for (const pattern of exclude) {
    if (typeof pattern === 'string') {
      if (value === canonPath(pattern)) {
        return false;
      }
    } else if (pattern.test(value)) {
      return false;
    }
  }
  return true;
}
