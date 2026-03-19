'use client';
import type {
  Dispatch,
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
} from 'react';
import { ExternalStore, useExternalStore } from './external-store.tsx';
import { createValueProvider } from './value-provider.tsx';

export type GetSharedValue<T> = () => T;
export type ResetSharedValue = Dispatch<void>;
export type SetSharedValue<T> = Dispatch<SetStateAction<T>>;
export type SharingKey<T> = { readonly value?: T | undefined };
export type UseSharedValueHook<T> = () => [
  T,
  SetSharedValue<T>,
  ResetSharedValue,
];

/**
 * @example
 * ```tsx
 * const [useCount] = createSharableValue(0);
 *
 * function Component() {
 *   const [count, setCount, resetCount] = useCount();
 *   ...
 * }
 * ```
 */
export function createSharableValue<T>(
  initialValue: T,
): [
  useValue: UseSharedValueHook<T>,
  getValue: GetSharedValue<T>,
  setValue: SetSharedValue<T>,
  resetValue: ResetSharedValue,
] {
  const key = createSharingKey(initialValue);
  const useValue: UseSharedValueHook<T> = () => {
    return useSharableValue(key);
  };
  const store = getSharingStore(key);
  return [useValue, store.getValue, store.setValue, store.resetValue];
}

export type SharableValueProvider<T> = FunctionComponent<
  PropsWithChildren<{ readonly initialValue: T }>
>;

export function createSharableValueContext<T>(): [
  SharableValueProvider<T>,
  UseSharedValueHook<T>,
] {
  const [KeyProvider, useKey] = createValueProvider<SharingKey<T>>();
  const useSharedValue: UseSharedValueHook<T> = () => {
    'use memo';
    const key = useKey();
    return useSharableValue(key);
  };
  function SharableValueProvider({
    children,
    initialValue,
  }: Parameters<SharableValueProvider<T>>[0]): ReactNode {
    'use memo';
    const key = createSharingKey(initialValue);
    return <KeyProvider value={key}>{children}</KeyProvider>;
  }
  return [SharableValueProvider, useSharedValue];
}

export function createSharingKey<T>(initialValue: T): SharingKey<T> {
  const store = new Store(initialValue);
  sharingKeys.add(store);
  return store;
}

export function deleteSharedValue<T>(key: SharingKey<T>): void {
  sharingKeys.delete(key);
}

/** get the shared value. purpose for use outside a component */
export function getSharedValue<T>(key: SharingKey<T>): T {
  return getSharingStore(key).getValue();
}

/** reset the shared value to its initial value. purpose for use outside a component */
export function resetSharedValue<T>(key: SharingKey<T>): void {
  getSharingStore(key).resetValue();
}

/** set the shared value to given value. purpose for use outside a component */
export function setSharedValue<T>(key: SharingKey<T>, value: T): void {
  getSharingStore(key).setValue(value);
}

/** share a value between any components */
export function useSharableValue<T>(
  key: SharingKey<T>,
): [T, SetSharedValue<T>, ResetSharedValue] {
  const store = getSharingStore(key);
  const value = useExternalStore(store);
  return [value, store.setValue, store.resetValue];
}

const sharingKeys = new (class extends WeakSet<SharingKey<any>> {
  isStore<T>(key: SharingKey<T>): key is Store<T> {
    return this.has(key);
  }
})();

function getSharingStore<T>(key: SharingKey<T>): Store<T> {
  if (!sharingKeys.isStore<T>(key)) {
    throw TypeError('specified sharing key does not exist');
  }
  return key;
}

class Store<T> extends ExternalStore<T> {
  readonly #initial: T;
  #value: T;

  constructor(value: T) {
    super();
    this.#initial = Store.#clone(value);
    this.#value = value;
  }

  static #clone<T>(value: T): T {
    if (value != null && typeof value === 'object') {
      value = structuredClone(value);
    }
    return value;
  }

  get value(): T {
    return this.#value;
  }

  readonly getValue: GetSharedValue<T> = () => {
    return this.#value;
  };

  readonly resetValue: ResetSharedValue = () => {
    this.setValue(Store.#clone(this.#initial));
  };

  readonly setValue: SetSharedValue<T> = (value) => {
    const prev = this.#value;
    let next: T;
    if (typeof value === 'function') {
      next = (value as (prev: T) => T)(prev);
    } else {
      next = value;
    }
    this.#value = next;
    this.notifyChange();
  };

  protected override getSnapshotValue(): T {
    return this.#value;
  }
}
