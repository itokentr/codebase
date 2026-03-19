import type { AbortSignal } from './abort-controller.ts';
import type { Blob } from './blob.ts';
import type { FormData } from './form.ts';
import type { ReadableStream } from './stream.ts';
import type { URL, URLSearchParams } from './url.ts';

export type Fetch = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

declare global {
  var fetch: Fetch;
}

// #region body

export interface Body {
  readonly body: ReadableStream<Uint8Array> | null;
  readonly bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;
  bytes(): Promise<Uint8Array>;
  formData(): Promise<FormData>;
  json(): Promise<any>;
  text(): Promise<string>;
}

export type BodyInit =
  | ReadableStream
  | ArrayBufferView
  | ArrayBuffer
  | Blob
  | FormData
  | URLSearchParams
  | string;

// #endregion
// #region headers

export interface Headers {
  [Symbol.iterator](): IteratorObject<[string, string], BuiltinIteratorReturn>;
  append(name: string, value: string): void;
  delete(name: string): void;
  entries(): IteratorObject<[string, string], BuiltinIteratorReturn>;
  forEach(
    callbackfn: (value: string, key: string, parent: Headers) => void,
    thisArg?: unknown,
  ): void;
  get(name: string): string | null;
  getSetCookie(): string[];
  has(name: string): boolean;
  keys(): IteratorObject<string, BuiltinIteratorReturn>;
  set(name: string, value: string): void;
  values(): IteratorObject<string, BuiltinIteratorReturn>;
}

declare global {
  var Headers: {
    prototype: Headers;
    new(init?: HeadersInit): Headers;
  };
}

export type HeadersInit = [string, string][] | Record<string, string> | Headers;

// #endregion
// #region request

export interface Request extends Body {
  readonly cache: RequestCache;
  readonly credentials: RequestCredentials;
  readonly destination: RequestDestination;
  readonly headers: Headers;
  readonly integrity: string;
  readonly keepalive: boolean;
  readonly method: string;
  readonly mode: RequestMode;
  readonly redirect: RequestRedirect;
  readonly referrer: string;
  readonly referrerPolicy: ReferrerPolicy;
  readonly signal: AbortSignal;
  readonly url: string;
  clone(): Request;
}

declare global {
  var Request: {
    prototype: Request;
    new(input: RequestInfo | URL, init?: RequestInit): Request;
  };
}

export type RequestCache =
  | 'default'
  | 'force-cache'
  | 'no-cache'
  | 'no-store'
  | 'only-if-cached'
  | 'reload';
export type RequestCredentials = 'include' | 'omit' | 'same-origin';
export type RequestDestination =
  | ''
  | 'audio'
  | 'audioworklet'
  | 'document'
  | 'embed'
  | 'font'
  | 'frame'
  | 'iframe'
  | 'image'
  | 'manifest'
  | 'object'
  | 'paintworklet'
  | 'report'
  | 'script'
  | 'sharedworker'
  | 'style'
  | 'track'
  | 'video'
  | 'worker'
  | 'xslt';

export type RequestMode = 'cors' | 'navigate' | 'no-cors' | 'same-origin';
export type RequestRedirect = 'error' | 'follow' | 'manual';
export type ReferrerPolicy =
  | ''
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url';
export type RequestPriority = 'auto' | 'high' | 'low';
export type RequestInfo = Request | string;

export interface RequestInit {
  body?: BodyInit | null;
  cache?: RequestCache;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
  integrity?: string;
  keepalive?: boolean;
  method?: string;
  mode?: RequestMode;
  priority?: RequestPriority;
  redirect?: RequestRedirect;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  signal?: AbortSignal | null;
  window?: null;
}

// #endregion
// #region response

export interface Response extends Body {
  readonly headers: Headers;
  readonly ok: boolean;
  readonly redirected: boolean;
  readonly status: number;
  readonly statusText: string;
  readonly type: ResponseType;
  readonly url: string;
  clone(): Response;
}

declare global {
  var Response: {
    prototype: Response;
    new(body?: BodyInit | null, init?: ResponseInit): Response;
    error(): Response;
    json(data: any, init?: ResponseInit): Response;
    redirect(url: string | URL, status?: number): Response;
  };
}

export interface ResponseInit {
  headers?: HeadersInit;
  status?: number;
  statusText?: string;
}

export type ResponseType =
  | 'basic'
  | 'cors'
  | 'default'
  | 'error'
  | 'opaque'
  | 'opaqueredirect';

// #endregion
