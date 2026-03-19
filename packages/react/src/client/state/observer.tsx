'use client';
import { ExternalStore, useExternalStore } from './external-store.tsx';

/** @see https://rxjs.dev/api/index/interface/CompletionObserver */
export interface CompletionObserver {
  closed?: boolean;
  complete(): void;
}

/** @see https://rxjs.dev/api/index/interface/ErrorObserver */
export interface ErrorObserver {
  error(err: any): void;
}

/** @see https://rxjs.dev/api/index/interface/NextObserver */
export interface NextObserver<T> {
  next(value: T): void;
}

/** @see https://rxjs.dev/api/index/interface/Observer */
export type Observer<T> = CompletionObserver & ErrorObserver & NextObserver<T>;

/**
 * @example
 * ```tsx
 * function Component() {
 *   const [value, observer] = useObserver(0);
 *
 *   function onClick() {
 *     observer.next(value + 1);
 *   }
 *   ...
 * }
 * ```
 */
export function useObserver<T>(initial: T): [T, Observer<T>] {
  const observer = new ObserverImpl(initial);
  const value = useExternalStore(observer);
  return [value, observer];
}

class ObserverImpl<T> extends ExternalStore<T> implements Observer<T> {
  static readonly #unsetError: unique symbol = Symbol();
  #closed = false;
  #error: unknown = ObserverImpl.#unsetError;
  #value: T;

  constructor(initial: T) {
    super();
    this.#value = initial;
  }

  get closed(): boolean {
    return this.#closed;
  }

  set closed(_value: any) {
    //
  }

  get value(): T {
    return this.#value;
  }

  complete(): void {
    if (!this.#closed) {
      this.#closed = true;
      this.notifyChange();
    }
  }

  error(err: unknown): void {
    if (!this.#closed && this.#error === ObserverImpl.#unsetError) {
      this.#closed = true;
      this.#error = err;
      this.notifyChange();
    }
  }

  next(value: T): void {
    if (!this.#closed) {
      this.#value = value;
      this.notifyChange();
    }
  }

  protected getSnapshotValue(): T {
    if (this.#error !== ObserverImpl.#unsetError) {
      throw this.#error;
    }
    return this.#value;
  }
}
