'use client';
import { useSyncExternalStore } from 'react';

export abstract class ExternalStore<T> {
  readonly #callbacks = new Set<() => void>();

  readonly getSnapshot: Parameters<typeof useSyncExternalStore<T>>[1] = () => {
    return this.getSnapshotValue();
  };

  readonly subscribe: Parameters<typeof useSyncExternalStore<T>>[0] = (
    onStoreChange,
  ) => {
    this.#callbacks.add(onStoreChange);
    return () => {
      this.#callbacks.delete(onStoreChange);
    };
  };

  protected notifyChange(): void {
    for (const callback of this.#callbacks) {
      callback();
    }
  }

  protected abstract getSnapshotValue(): T;
}

export function useExternalStore<T>(store: ExternalStore<T>): T;
export function useExternalStore<T>(
  store: ExternalStore<T> | null | undefined,
): T | null;
export function useExternalStore<T>(
  store: ExternalStore<T> | null | undefined,
): T | null {
  type P = Parameters<typeof useSyncExternalStore<T | null>>;
  const subscribe: P[0] = store?.subscribe ?? (() => () => undefined);
  const getSnapshot: P[1] = store?.getSnapshot ?? (() => null);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
