import type { AbortSignal } from './abort-controller.ts';
import type { URL } from './url.ts';

type _AddEventListenerOptions = typeof globalThis extends { onmessage: any }
  ? unknown
  : __AddEventListenerOptions;
interface __AddEventListenerOptions extends EventListenerOptions {
  once?: boolean;
  passive?: boolean;
  signal?: AbortSignal;
}
export type AddEventListenerOptions = _AddEventListenerOptions & {};

type _CustomEvent<T = any> = typeof globalThis extends { onmessage: any }
  ? unknown
  : __CustomEvent<T>;
interface __CustomEvent<T = any> extends __Event {
  readonly detail: T;
}
export type CustomEvent<T = any> = _CustomEvent<T> & {};

declare global {
  var CustomEvent: {
    prototype: CustomEvent;
    new<T>(type: string, eventInitDict?: CustomEventInit<T>): CustomEvent<T>;
  };
}

export interface CustomEventInit<T = any> extends EventInit {
  detail?: T;
}

type _Event = typeof globalThis extends { onmessage: any } ? unknown : __Event;
interface __Event {
  readonly bubbles: boolean;
  cancelBubble: boolean;
  readonly cancelable: boolean;
  readonly composed: boolean;
  readonly currentTarget: __EventTarget | null;
  readonly defaultPrevented: boolean;
  readonly eventPhase: 0 | 2;
  readonly isTrusted: boolean;
  returnValue: boolean;
  readonly srcElement: __EventTarget | null;
  readonly target: __EventTarget | null;
  readonly timeStamp: number;
  readonly type: string;
  /** @returns {EventTarget[]} */
  composedPath(): any;
  initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void;
  preventDefault(): void;
  stopImmediatePropagation(): void;
  stopPropagation(): void;
}
export type Event = _Event & {};

declare global {
  var Event: {
    prototype: Event;
    new(type: string, eventInitDict?: EventInit): Event;
    readonly NONE: 0;
    readonly CAPTURING_PHASE: 1;
    readonly AT_TARGET: 2;
    readonly BUBBLING_PHASE: 3;
  };
}

export interface EventInit {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}

type _EventListener = typeof globalThis extends { onmessage: any } ? unknown
  : __EventListener;
interface __EventListener {
  (evt: Event): void;
}
export type EventListener = _EventListener & {};

type _EventListenerObject = typeof globalThis extends { onmessage: any }
  ? unknown
  : __EventListenerObject;
interface __EventListenerObject {
  handleEvent(object: Event): void;
}
export type EventListenerObject = _EventListenerObject & {};

type _EventListenerOptions = typeof globalThis extends { onmessage: any }
  ? unknown
  : __EventListenerOptions;
interface __EventListenerOptions {
  capture?: boolean;
}
export type EventListenerOptions = _EventListenerOptions & {};

type _EventTarget = typeof globalThis extends { onmessage: any } ? unknown
  : __EventTarget;
interface __EventTarget {
  addEventListener(
    type: string,
    listener: EventListener | EventListenerObject,
    options?: AddEventListenerOptions | boolean,
  ): void;
  dispatchEvent(event: Event): boolean;
  removeEventListener(
    type: string,
    listener: EventListener | EventListenerObject,
    options?: EventListenerOptions | boolean,
  ): void;
}
export type EventTarget = _EventTarget & {};

declare global {
  var EventTarget: {
    prototype: EventTarget;
    new(): EventTarget;
  };
}

export type EventSource = __EventTarget & {
  onerror: ((this: EventSource, ev: Event) => any) | null;
  onmessage: ((this: EventSource, ev: MessageEvent) => any) | null;
  onopen: ((this: EventSource, ev: Event) => any) | null;
  readonly readyState: number;
  readonly url: string;
  readonly withCredentials: boolean;
  close(): void;
  readonly CONNECTING: 0;
  readonly OPEN: 1;
  readonly CLOSED: 2;
};

declare global {
  var EventSource: {
    prototype: EventSource;
    new(url: string | URL, eventSourceInitDict?: EventSourceInit): EventSource;
    readonly CONNECTING: 0;
    readonly OPEN: 1;
    readonly CLOSED: 2;
  };
}

export interface EventSourceInit {
  withCredentials?: boolean;
}

export interface MessageEvent<T = any> extends Event {
  readonly data: T;
  readonly lastEventId: string;
  readonly origin: string;
  readonly ports: readonly MessagePort[];
  /** `WindowProxy | MessagePort | ServiceWorker | null` */
  readonly source: MessagePort | __EventTarget | null;
  initMessageEvent(
    type: string,
    bubbles?: boolean,
    cancelable?: boolean,
    data?: unknown,
    origin?: string,
    lastEventId?: string,
    /** `WindowProxy | MessagePort | ServiceWorker` */
    source?: MessagePort | __EventTarget,
    ports?: MessagePort[],
  ): void;
}

export interface MessageEventInit<T = any> extends EventInit {
  data?: T;
  lastEventId?: string;
  origin?: string;
  ports?: MessagePort[];
  source?: MessagePort | null;
}

declare global {
  var MessageEvent: {
    prototype: MessageEvent;
    new<T>(type: string, eventInitDict?: MessageEventInit<T>): MessageEvent<T>;
  };
}

export type MessagePort = __EventTarget & {
  close(): void;
  onmessage: ((this: MessagePort, ev: MessageEvent) => any) | null;
  onmessageerror: ((this: MessagePort, ev: MessageEvent) => any) | null;
  postMessage(message: unknown, options?: { transfer?: any[] }): void;
  postMessage(message: unknown, transfer: any[]): void;
  start(): void;
};

declare global {
  var MessagePort: {
    prototype: MessagePort;
    new(): MessagePort;
  };
}
