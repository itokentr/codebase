'use client';
'use no memo';
import type {
  ComponentProps,
  ComponentType,
  DependencyList,
  FunctionComponent,
  MemoExoticComponent,
  NamedExoticComponent,
} from 'react';
// oxlint-disable-next-line no-restricted-imports
import { memo, useEffect, useReducer } from 'react';
import { equals } from '../util/equals.ts';

/**
 * memoize a component with props comparison using deep-equal
 * instead of `Object.is`.
 * @deprecated use React Compiler to make memoizations to be simple.
 */
export function memo2<P extends object>(
  Component: FunctionComponent<P>,
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean,
): NamedExoticComponent<P>;
export function memo2<T extends ComponentType<any>>(
  Component: T,
  propsAreEqual?: (
    prevProps: Readonly<ComponentProps<T>>,
    nextProps: Readonly<ComponentProps<T>>,
  ) => boolean,
): MemoExoticComponent<T>;
export function memo2(component: any, propsAreEqual?: any): any {
  // oxlint-disable-next-line typescript/no-unsafe-argument
  return memo(component, propsAreEqual ?? equals);
}

interface Comparable<T> {
  readonly deps: DependencyList;
  readonly factory: () => T;
}

interface State<T> {
  readonly deps: DependencyList;
  readonly value: T;
}

/**
 * memoize a function with dependency comparison using deep-equal
 * instead of `Object.is`.
 * @deprecated use React Compiler to make memoizations to be simple.
 */
// oxlint-disable-next-line typescript/no-unsafe-function-type
export function useCallback2<T extends Function>(
  callback: T,
  deps: DependencyList,
): T {
  // oxlint-disable-next-line typescript/no-deprecated
  return useMemo2(() => callback, deps);
}

/**
 * memoize something with dependency comparison using deep-equal
 * instead of `Object.is`.
 * @deprecated use React Compiler to make memoizations to be simple.
 */
export function useMemo2<T>(factory: () => T, deps: DependencyList): T {
  const [{ value }, compare] = useReducer<State<T>, null, [Comparable<T>]>(
    (current, { deps, factory }) => {
      return deps.length === 0 && current.deps.length == 0
        ? current
        : equals(deps, current.deps)
        ? current
        : { deps, value: factory() };
    },
    null,
    () => ({ deps, value: factory() }),
  );
  // oxlint-disable-next-line react-x/exhaustive-deps
  useEffect(() => compare({ deps, factory }));
  return value;
}
