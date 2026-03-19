import classNamesFn from 'classnames';

/** @template S Base UI component states. */
export type ClassName<S> = string | ClassNameFn<S>;

/** @template S Base UI component states. */
export type ClassNameFn<S> = NonNullable<S> extends never
  ? () => string | undefined
  : (state: S) => string | undefined;

export type ComponentClassNames<C extends ComponentStates> = {
  readonly [K in keyof C]?: ClassName<C[K]>;
};

export type ComponentClassNameFns<C extends ComponentStates> = {
  readonly [K in keyof C]?: ClassNameFn<C[K]>;
};

/** @template S Base UI component states. */
export type PropsWithClassName<S, C extends ComponentStates | null> =
  NonNullable<C> extends never
    ? { readonly className?: ClassName<S> | undefined }
    :
      & { readonly className?: ClassName<S> | undefined }
      & {
        readonly classNames?: ComponentClassNames<
          RootComponentStates<S, NonNullable<C>>
        >;
      };

/** General type consists of key value pairs of a component name and Base UI component states. */
export type ComponentStates = object;

export type RootComponentState<S> = { readonly root: S };

/**
 * @template S Base UI component states for a root component.
 * @template C
 */
export type RootComponentStates<
  S,
  C extends ComponentStates = ComponentStates,
> =
  & Omit<C, keyof RootComponentState<S>>
  & RootComponentState<S>;

/**
 * A react hook to get a CSS class name for bound root component.
 * @template S Base UI component states for a root component.
 */
export type UseClassName<S> = (
  propValue: ClassName<S> | undefined,
) => ClassNameFn<S> | undefined;

function createUseClassName<S>(
  map: ComponentClassNameMap<any>,
): UseClassName<S> {
  return (prop) => {
    'use memo';
    type C = RootComponentStates<S>;
    return createClassNameFn(
      null,
      ...((map as ComponentClassNameMap<C>).get('root') ?? []),
      prop,
    );
  };
}

/**
 * A react hook to get a CSS class name for bound component named as given `name`.
 * @template C
 */
export type UseClassNameOf<C extends ComponentStates> = <K extends keyof C>(
  name: K,
  value?: ClassName<C[K]>,
) => ClassNameFn<C[K]> | undefined;

function createUseClassNameOf<C extends ComponentStates>(
  map: ComponentClassNameMap<C>,
): UseClassNameOf<C> {
  return <K extends keyof C>(
    name: K,
    className?: ClassName<C[K]>,
  ): ClassNameFn<C[K]> | undefined => {
    'use memo';
    return createClassNameFn(null, ...(map.get(name) ?? []), className);
  };
}

/**
 * A react hook to get CSS class names for bound root and relevant components.
 * @template S Base UI component states for a root component.
 * @template C
 */
export type UseClassNames<S, C extends ComponentStates> = (
  classNames: ComponentClassNames<C> | undefined,
  className?: ClassName<S>,
) => ComponentClassNameFns<C> | undefined;

function createUseClassNames<S, C extends ComponentStates>(
  map: ComponentClassNameMap<C>,
): UseClassNames<S, C> {
  return (
    classNames: ComponentClassNames<C> | undefined,
    className?: ClassName<S>,
  ): ComponentClassNameFns<C> | undefined => {
    'use memo';
    type R = RootComponentState<S>;
    type RootKey = keyof R;
    const ret: Record<string | number | symbol, ClassNameFn<any> | undefined> =
      {};
    const rootFn = createClassNameFn<S>(
      null,
      ...((map as ComponentClassNameMap<R>).get('root') ?? []),
      (classNames as ComponentClassNames<R> | undefined)?.root,
      className,
    );
    let hasValue = false;
    if (rootFn) {
      ret['root' satisfies RootKey] = rootFn;
      hasValue = true;
    }
    if (classNames) {
      const componentNames = new Set([
        ...Object.keys(classNames),
        ...map.keys(),
      ]) as Set<RootKey | keyof C>;
      componentNames.delete('root');

      for (const name of componentNames) {
        const fn = createClassNameFn(
          null,
          ...(map.get(name as keyof C) ?? []),
          classNames[name as keyof C],
        );
        if (fn) {
          ret[name] = fn;
          hasValue = true;
        }
      }
    } else {
      for (const [name, value] of map.entries()) {
        if (name === 'root') {
          continue;
        }
        const fn = createClassNameFn(null, ...value);
        if (fn) {
          ret[name] = fn;
          hasValue = true;
        }
      }
    }
    return hasValue ? (ret as ComponentClassNameFns<C>) : undefined;
  };
}

/**
 * @template S Base UI component states for a root component.
 * @template C
 */
export interface ClassNameSet<S, C extends ComponentStates> {
  /**
   * Add default CSS class names to bound components.
   *
   * @example
   * ```tsx
   * fieldClassNames.add({ label: styles.Label, root: styles.Root });
   *
   * function Field({ className, ...props }) {
   *
   *   return (
   *     <div {...props}></div>
   *   );
   * }
   *
   * function Label() {
   * }
   * ```
   */
  add(values: ComponentClassNames<RootComponentStates<S, C>>): void;

  /** Make specified set to accept additional components represented as the type `C2`. */
  extendTypes<C2 extends ComponentStates>(): CreatedClassNameSet<
    S,
    C & C2
  >;
}

type ComponentClassNameMap<C extends ComponentStates> =
  & Map<keyof C, Set<ClassName<C[keyof C]>>>
  & {
    get<K extends keyof C>(name: K): Set<ClassName<C[K]>>;
  };

class ClassNameSetImpl<S, C extends ComponentStates>
  implements ClassNameSet<S, C> {
  readonly useClassName: UseClassName<S>;
  readonly useClassNameOf: UseClassNameOf<C>;
  readonly useClassNames: UseClassNames<S, C>;
  readonly #map: ComponentClassNameMap<C>;

  constructor(map?: ComponentClassNameMap<C>) {
    this.#map = map ?? (new Map() as ComponentClassNameMap<C>);
    this.useClassName = createUseClassName<S>(this.#map);
    this.useClassNameOf = createUseClassNameOf(this.#map);
    this.useClassNames = createUseClassNames(this.#map);
  }

  add(values: ComponentClassNames<RootComponentStates<S, C>>): void {
    for (const name of Object.keys(values) as Iterable<keyof typeof values>) {
      const value = values[name] as ClassName<C[keyof C]> | undefined;
      if (!value) {
        continue;
      }
      let classNames = this.#map.get(name as keyof C);
      if (!classNames) {
        classNames = new Set();
        this.#map.set(name as keyof C, classNames);
      }
      classNames.add(value);
    }
  }

  extendTypes<C2 extends ComponentStates>(): CreatedClassNameSet<
    S,
    C & C2
  > {
    type CX = RootComponentStates<S, C & C2>;
    const extended = new ClassNameSetImpl<S, CX>(
      this.#map as ComponentClassNameMap<CX>,
    );
    return [
      extended,
      extended.useClassName,
      extended.useClassNameOf,
      extended.useClassNames,
    ];
  }
}

/**
 * @template S Base UI component states.
 */
export function createClassNameFn<S>(
  className: ClassName<S> | null | undefined,
  ...classNames: readonly (ClassName<S> | null | undefined)[]
): ClassNameFn<S> | undefined {
  const list = [className, ...classNames].filter<ClassName<S>>(
    (value): value is ClassName<S> => !!value,
  );
  if (list.length === 0) {
    return undefined;
  }
  return (state?: S) => {
    const names: (string | undefined)[] = [];
    for (const value of list) {
      if (typeof value === 'function') {
        names.push(value(state as S));
      } else {
        names.push(value);
      }
    }
    return classNamesFn(...names);
  };
}

export type CreatedClassNameSet<S, C extends ComponentStates> = [
  ClassNameSet<S, RootComponentStates<S, C>>,
  UseClassName<S>,
  UseClassNameOf<RootComponentStates<S, C>>,
  UseClassNames<S, RootComponentStates<S, C>>,
];

export function createClassNameSet<S>(): CreatedClassNameSet<
  S,
  ComponentStates
>;
export function createClassNameSet<
  S,
  C extends ComponentStates,
>(): CreatedClassNameSet<S, C>;
export function createClassNameSet<
  S,
  C1 extends ComponentStates,
  C2 extends ComponentStates,
>(): CreatedClassNameSet<S, C1 & C2>;
export function createClassNameSet<
  S,
  C1 extends ComponentStates,
  C2 extends ComponentStates,
  C3 extends ComponentStates,
>(): CreatedClassNameSet<S, C1 & C2 & C3>;
export function createClassNameSet<
  S,
  C1 extends ComponentStates,
  C2 extends ComponentStates,
  C3 extends ComponentStates,
  C4 extends ComponentStates,
>(): CreatedClassNameSet<S, C1 & C2 & C3 & C4>;
export function createClassNameSet<
  S,
  C extends ComponentStates,
>(): CreatedClassNameSet<S, C> {
  const classNameSet = new ClassNameSetImpl<S, RootComponentStates<S, C>>();
  return [
    classNameSet,
    classNameSet.useClassName,
    classNameSet.useClassNameOf,
    classNameSet.useClassNames,
  ];
}
