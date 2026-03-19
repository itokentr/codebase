import classNamesFn from 'classnames';
import type { HTMLAttributes } from 'react';

export function classNames(
  ...classNames: readonly (string | null | undefined)[]
): string;
export function classNames(
  props: HTMLAttributes<unknown>,
  ...classNames: readonly (string | null | undefined)[]
): string;
export function classNames(
  first: HTMLAttributes<unknown> | string | null | undefined,
  ...classNames: readonly (string | null | undefined)[]
): string {
  const className =
    typeof first === 'object' && first !== null ? first.className : first;
  return classNamesFn(className, ...classNames);
}
