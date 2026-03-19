/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  DetailedHTMLProps,
  HTMLAttributes,
  HTMLProps,
  JSX,
  SVGProps,
} from 'react';

export type ExtractElementType<E extends keyof JSX.IntrinsicElements> =
  JSX.IntrinsicElements[E] extends DetailedHTMLProps<
    HTMLAttributes<any>,
    infer U
  >
    ? U
    : JSX.IntrinsicElements[E] extends SVGProps<infer U>
      ? U
      : never;

export type HTMLPropsWith<T, P extends object> = Omit<HTMLProps<T>, keyof P> &
  P;
