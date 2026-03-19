import type { Event, EventTarget } from './event.ts';

export interface AbortSignal extends EventTarget {
  readonly aborted: boolean;
  readonly reason: unknown;
  throwIfAborted(): void;
  onabort: null | ((this: any, event: Event) => any);
}

declare global {
  var AbortSignal: {
    prototype: AbortSignal;
    new(): AbortSignal;
    abort(reason?: any): AbortSignal;
    any(signals: AbortSignal[]): AbortSignal;
    timeout(milliseconds: number): AbortSignal;
  };
}

export interface AbortController {
  readonly signal: AbortSignal;
  abort(reason?: unknown): void;
}

declare global {
  var AbortController: {
    prototype: AbortController;
    new(): AbortController;
  };
}
