'use client';
import { useState } from 'react';

export interface ValueRef<T> {
  readonly value: T;
  set(value: T): void;
}

/** like `useRef` create a state that does not trigger new render */
export function useValueRef<T>(initialValue: T): ValueRef<T> {
  const [ret] = useState<ValueRef<T>>(
    () => new ValueRefImpl(initialValue),
  );
  return ret;
}

class ValueRefImpl<T> implements ValueRef<T> {
  #value: T;

  constructor(initialValue: T) {
    this.#value = initialValue;
  }

  get value(): T {
    return this.#value;
  }

  set(value: T): void {
    this.#value = value;
  }
}
