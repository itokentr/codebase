'use client';
import type { Ref, RefAttributes, RefCallback } from 'react';
// oxlint-disable-next-line no-restricted-imports
import { useCallback } from 'react';

export function createMergedRef<T>(
  ref: Ref<T> | RefAttributes<T> | null | undefined,
  ...refs: readonly (Ref<T> | RefAttributes<T> | null | undefined)[]
): RefCallback<T> {
  return (instance) => {
    type A = RefAttributes<T> | null;
    for (const value of [ref, ...refs]) {
      const ref = (value as A)?.ref ?? (value as Ref<T> | null);
      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref) {
        ref.current = instance;
      }
    }
  };
}

export function useMergedRef<T1, T2>(
  ref1: Ref<T1> | RefAttributes<T1> | undefined,
  ref2: Ref<T2> | RefAttributes<T2> | undefined,
): RefCallback<T1 | T2>;
export function useMergedRef<T1, T2, T3>(
  ref1: Ref<T1> | RefAttributes<T1> | undefined,
  ref2: Ref<T2> | RefAttributes<T2> | undefined,
  ref3: Ref<T3> | RefAttributes<T3> | undefined,
): RefCallback<T1 | T2>;
export function useMergedRef<T1, T2, T3, T4>(
  ref1: Ref<T1> | RefAttributes<T1> | undefined,
  ref2: Ref<T2> | RefAttributes<T2> | undefined,
  ref3: Ref<T3> | RefAttributes<T3> | undefined,
  ref4: Ref<T4> | RefAttributes<T4> | undefined,
): RefCallback<T1 | T2>;
export function useMergedRef<T1, T2, T3, T4>(
  ref1: Ref<T1> | RefAttributes<T1> | undefined,
  ref2: Ref<T2> | RefAttributes<T2> | undefined,
  ref3?: Ref<T3> | RefAttributes<T3>,
  ref4?: Ref<T4> | RefAttributes<T4>,
): RefCallback<T1 | T2 | T3 | T4> {
  'use no memo';
  const r1 = toRef(ref1);
  const r2 = toRef(ref2);
  const r3 = toRef(ref3);
  const r4 = toRef(ref4);
  return useCallback<RefCallback<T1 | T2 | T3 | T4>>(
    (instance) => {
      for (const ref of [r1, r2, r3, r4]) {
        if (typeof ref === 'function') {
          (ref as RefCallback<T1>)(instance as T1);
        } else if (ref) {
          ref.current = instance;
        }
      }
    },
    [r1, r2, r3, r4],
  );
}

function toRef<T>(value: Ref<T> | RefAttributes<T> | undefined): Ref<T> {
  type A = RefAttributes<T> | undefined;
  return (value as A)?.ref ?? (value as Ref<T> | undefined) ?? null;
}
