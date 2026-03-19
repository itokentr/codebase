import type { Blob } from './blob.ts';

export interface URL {
  hash: string;
  host: string;
  hostname: string;
  href: string;
  toString(): string;
  readonly origin: string;
  password: string;
  pathname: string;
  port: string;
  protocol: string;
  search: string;
  readonly searchParams: URLSearchParams;
  username: string;
  toJSON(): string;
}

declare global {
  var URL: {
    prototype: URL;
    new(url: string | URL, base?: string | URL): URL;
    canParse(url: string | URL, base?: string | URL): boolean;
    // TODO: support MediaSource
    createObjectURL(obj: Blob): string;
    parse(url: string | URL, base?: string | URL): URL | null;
    revokeObjectURL(url: string): void;
  };
}

export interface URLSearchParams {
  readonly size: number;
  append(name: string, value: string): void;
  delete(name: string, value?: string): void;
  get(name: string): string | null;
  getAll(name: string): string[];
  has(name: string, value?: string): boolean;
  set(name: string, value: string): void;
  sort(): void;
  toString(): string;
  forEach(
    callbackfn: (value: string, key: string, parent: URLSearchParams) => void,
    thisArg?: unknown,
  ): void;
  [Symbol.iterator](): IteratorObject<[string, string], BuiltinIteratorReturn>;
  entries(): IteratorObject<[string, string], BuiltinIteratorReturn>;
  keys(): IteratorObject<string, BuiltinIteratorReturn>;
  values(): IteratorObject<string, BuiltinIteratorReturn>;
}

declare global {
  var URLSearchParams: {
    prototype: URLSearchParams;
    new(
      init?: string[][] | Record<string, string> | string | URLSearchParams,
    ): URLSearchParams;
  };
}
