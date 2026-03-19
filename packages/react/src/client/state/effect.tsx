'use client';
import type { DependencyList, EffectCallback } from 'react';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { equals } from '../util/equals.ts';

const voidRef: unique symbol = Symbol();

/**
 * call an effectful function with dependency comparison using deep-equal
 * instead of `Object.is`.
 * @deprecated use React Compiler to make memoizations to be stable.
 */
export function useEffect2(
  effect: EffectCallback,
  deps?: DependencyList,
): void {
  const ref = useRef<typeof deps | typeof voidRef>(voidRef);
  useEffect(() => {
    if (!equals(deps, ref.current)) {
      ref.current = deps;
      return effect();
    }
  });
}

/**
 * call an effectful function with dependency comparison using deep-equal
 * instead of `Object.is`.
 * @deprecated use React Compiler to make memoizations to be stable.
 */
export function useLayoutEffect2(
  effect: EffectCallback,
  deps?: DependencyList,
): void {
  const ref = useRef<typeof deps | typeof voidRef>(voidRef);
  useLayoutEffect(() => {
    if (!equals(deps, ref.current)) {
      ref.current = deps;
      return effect();
    }
  });
}
