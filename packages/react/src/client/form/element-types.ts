import type { StringLike } from '@lib/types';
import type { ReactNode } from 'react';

export type FormControlElementName = Extract<
  keyof HTMLElementTagNameMap,
  'button' | 'input' | 'select' | 'textarea'
>;
export type FormControlElement = HTMLElementTagNameMap[FormControlElementName];

export interface Option {
  readonly disabled?: boolean;
  /** used for a `key` prop. instead `label` is used for `key` if not provided */
  readonly id?: string;
  readonly label: string;
  /** if provided it will be rendered instead of `label` */
  readonly labelNode?: ReactNode;
  readonly value: StringLike;
}

export function optionsEqual(a: Option, b: Option): boolean {
  return optionId(a) === optionId(b);
}

export function optionId({ id, label }: Option): string {
  return id ?? label;
}
