'use client';
import type { MotionProps } from 'motion/react';
import * as m from 'motion/react-m';
import type { ExoticComponent, FunctionComponent, ReactNode } from 'react';

export type MotionComponentName =
  | Extract<
      keyof typeof m,
      keyof (HTMLElementTagNameMap & SVGElementTagNameMap)
    >
  | Extract<keyof typeof m, 'webview'>;

/** represents general `HTMLElement` */
export type GeneralMotionComponentName = Extract<MotionComponentName, 'b'>;

export type MotionComponentProps<K extends MotionComponentName> = Parameters<
  (typeof m)[K]
>[0] & {};

export type GeneralMotionComponentProps =
  MotionComponentProps<GeneralMotionComponentName> & {};

/** properties without motion derived */
export type NoMotionComponentProps<K extends MotionComponentName> = Omit<
  MotionComponentProps<K>,
  Exclude<keyof MotionProps, 'children'>
> & {};

/** properties general `HTMLElement` without motion derived */
export type GeneralNoMotionComponentProps =
  NoMotionComponentProps<GeneralMotionComponentName> & {};

export type MotionComponent<K extends MotionComponentName> = ExoticComponent<
  MotionComponentProps<K>
>;

export type MappedMotionComponent<
  K extends MotionComponentName,
  P extends object,
> = FunctionComponent<NoMotionComponentProps<K> & P>;

export type MotionComponentMap<
  K extends MotionComponentName,
  P extends object,
> = {
  readonly [K2 in K]: MappedMotionComponent<K2, P>;
};

export type GeneralMotionComponentMap<P extends object> = {
  readonly [K in MotionComponentName]: MappedMotionComponent<K, P>;
};

export type MotionComponentFactory<
  K extends MotionComponentName,
  P extends object,
> = (Component: MotionComponent<K>, props: P) => ReactNode;

export interface CreateMotionComponentOptions<K extends MotionComponentName> {
  /** allowed tag names */
  readonly tags?: readonly K[];
}

export function createMotionComponent<P extends object>(
  factory: MotionComponentFactory<MotionComponentName, P>,
): GeneralMotionComponentMap<P>;
export function createMotionComponent<
  K extends MotionComponentName,
  P extends object = object,
>(
  options: CreateMotionComponentOptions<K>,
  factory: MotionComponentFactory<K, P>,
): MotionComponentMap<K, P>;
export function createMotionComponent<
  K extends MotionComponentName = MotionComponentName,
  P extends object = object,
>(
  factoryOrOptions:
    | CreateMotionComponentOptions<K>
    | MotionComponentFactory<K, P>,
  factory?: MotionComponentFactory<K, P>,
): MotionComponentMap<K, P> {
  const cache = new Map<K, FunctionComponent<P>>();
  let options: CreateMotionComponentOptions<K> | undefined;
  if (!factory) {
    factory = factoryOrOptions as MotionComponentFactory<K, P>;
  } else {
    options = factoryOrOptions as CreateMotionComponentOptions<K>;
  }
  return new Proxy({} as MotionComponentMap<K, P>, {
    get(_target, p) {
      let component = cache.get(p as K);
      if (component) {
        return component;
      }
      const value = m[p as keyof typeof m];
      if (!isExoticComponent(value)) {
        return value;
      }
      if (options?.tags && !options.tags.includes(p as K)) {
        throw TypeError(`not accepted to use an element "${p as K}"`);
      }
      component = wrapFactory(factory, value);
      cache.set(p as K, component);
      return component;
    },
  });
}

function isExoticComponent(value: unknown): value is ExoticComponent {
  return typeof (value as ExoticComponent | null)?.$$typeof === 'symbol';
}

function wrapFactory<K extends MotionComponentName, P extends object>(
  factory: MotionComponentFactory<K, P>,
  motion: MotionComponent<K>,
): FunctionComponent<P> {
  return (props) => factory(motion, props);
}
