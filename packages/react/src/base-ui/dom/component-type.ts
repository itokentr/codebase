import type { useRender } from '@base-ui/react/use-render';
import type { ElementType, JSX, RefAttributes } from 'react';
import type { ExtractElementType } from '../../client/dom/util-types.ts';
import type { ComponentStates, PropsWithClassName } from './class-name.ts';

/**
 * @template P any props to resolve an element to be bound the component
 * @template S Base UI component state like `Checkbox.Root.State`
 */
export type BaseUiComponentCommonProps<
  P extends object,
  S extends object,
  E extends keyof JSX.IntrinsicElements = 'div',
> =
  & Partial<Omit<useRender.ComponentProps<ElementType<P, E>, S>, 'className'>>
  & PropsWithClassName<S, null>;

/**
 * @template P Base UI component properties like `Checkbox.Root.Props`
 * @template S Base UI component state like `Checkbox.Root.State`
 * @template O properties to be excluded from `P`
 * @template C Base UI states for child components of the component
 * @template E DOM element type bound with the component
 */
export type BaseUiComponentProps<
  P extends object,
  S extends object,
  O extends keyof P | null = null,
  C extends ComponentStates | null = null,
  E extends keyof JSX.IntrinsicElements | '*' = '*',
> =
  & (NonNullable<O> extends never ? Omit<P, 'className' | 'ref'>
    : Omit<P, 'className' | 'ref' | NonNullable<O>>)
  & RefAttributes<
    E extends keyof JSX.IntrinsicElements ? ExtractElementType<E> : HTMLElement
  >
  & PropsWithClassName<S, C>;

export type ExtractBaseUiComponentStates<
  T extends BaseUiComponentProps<any, any>,
> = T extends BaseUiComponentProps<any, infer S> ? S : never;
