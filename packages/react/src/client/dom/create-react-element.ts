import type {
  ComponentProps,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from 'react';
import { createElement } from 'react';

export function createReactElement<
  const T extends keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap,
  P extends Omit<ComponentProps<T>, 'children'>,
>(
  tagName: T,
  props?: P | null,
  ...children: readonly ReactNode[]
): ReactElement<PropsWithChildren<P>, T> {
  return createElement(
    tagName,
    props,
    // TODO: flat 必要？
    ...children.flat(Infinity),
  ) as unknown as ReactElement<PropsWithChildren<P>, T>;
}
