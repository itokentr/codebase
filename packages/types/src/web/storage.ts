import type { Event, EventInit } from './event.ts';
import type { URL } from './url.ts';

interface _Storage {
  readonly length: number;
  clear(): void;
  getItem(key: string): string | null;
  key(index: number): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
  [key: string]: any;
}
export type Storage = typeof globalThis extends { onabort: any } ? object
  : _Storage;

declare global {
  var Storage: {
    prototype: Storage;
    new(): Storage;
  };
  var localStorage: Storage;
  var sessionStorage: Storage;
}

export interface StorageEvent extends Event {
  readonly key: string | null;
  readonly newValue: string | null;
  readonly oldValue: string | null;
  readonly storageArea: Storage | null;
  readonly url: string;

  initStorageEvent(
    type: string,
    bubbles?: boolean,
    cancelable?: boolean,
    key?: string | null,
    oldValue?: string | null,
    newValue?: string | null,
    url?: string | URL,
    storageArea?: Storage | null,
  ): void;
}

export interface StorageEventInit extends EventInit {
  key?: string | null;
  newValue?: string | null;
  oldValue?: string | null;
  storageArea?: Storage | null;
  url?: string;
}

declare global {
  var StorageEvent: {
    prototype: StorageEvent;
    new(type: string, eventInitDict?: StorageEventInit): StorageEvent;
  };
}
