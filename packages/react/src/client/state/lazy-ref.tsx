'use client';
import type { RefObject } from 'react';
import { useReducer, useRef } from 'react';

export function useLazyRef<T>(init: () => T): RefObject<T>;
export function useLazyRef<T, U>(init: (arg: U) => T, initArg: U): RefObject<T>;
export function useLazyRef(
  init: (arg?: unknown) => unknown,
  initArg?: unknown,
): RefObject<unknown> {
  const [value] = useReducer((state) => state, initArg, init);
  return useRef(value);
}
