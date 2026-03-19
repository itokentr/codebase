'use client';
import type { ActionDispatch, Key } from 'react';
import { useReducer } from 'react';

export function useKey(
  initialKey?: Key | null,
): [Key, ActionDispatch<[Key | null | undefined] | []>] {
  const [key, changeKey] = useReducer<
    Key,
    Key | null | undefined,
    [Key | null | undefined] | []
  >(
    // do not use rest params to suppress react compiler error,
    () =>
      // instead use `arguments` object.
      // oxlint-disable-next-line prefer-rest-params
      (arguments[1] as Key | null | undefined) ??
      Math.random().toString(36).slice(2),
    initialKey,
    (key) => key ?? Math.random().toString(36).slice(2),
  );
  return [key, changeKey];
}
