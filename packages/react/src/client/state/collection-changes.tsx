// oxlint-disable typescript/no-unsafe-assignment typescript/no-unsafe-return
'use client';
import { useSyncExternalStore } from 'react';

export type CollectionLike =
  | any[]
  | Map<any, any>
  | Set<any>
  | DOMTokenList
  | Record<string, any>;

type MutationArrayFns = Omit<any[], keyof (readonly any[])>;
type MutationMapFns = Omit<
  Omit<Map<any, any>, keyof ReadonlyMap<any, any>>,
  SymbolConstructor['toStringTag']
>;
type MutationSetFns = Omit<
  Omit<Set<any>, keyof ReadonlySet<any>>,
  SymbolConstructor['toStringTag']
>;
type MutationDOMTokenListFns = Pick<
  DOMTokenList,
  'add' | 'remove' | 'replace' | 'toggle'
>;
// @ts-expect-error reserved for future
// oxlint-disable-next-line no-unused-vars
type MutationFns =
  & MutationArrayFns
  & MutationMapFns
  & MutationSetFns
  & MutationDOMTokenListFns;

type TrappableMutationFns =
  & MutationMapFns
  & MutationSetFns
  & MutationDOMTokenListFns;

export type CollectionChange<C extends CollectionLike> = C extends (infer T)[] ?
    | readonly [index: number, value: T, deleted: true]
    | readonly [index: number, value: T | undefined, deleted: false]
  : C extends Map<infer K, infer V>
    ? readonly [key: K, value: V, deleted: boolean]
  : C extends Set<infer T> ? readonly [value: T, deleted: boolean]
  : C extends DOMTokenList
    ? readonly [index: number, value: string, deleted: boolean]
  : C extends Record<infer K, infer V> ? readonly [key: K, value: V]
  : never;

/**
 * returns given collection which triggers a render when they are changed.
 * @deprecated instead use [useState()](https://react.dev/reference/react/useState) to get simplicity.
 */
export function useCollectionChanges<const T extends CollectionLike>(
  collection: T,
): [T, ...CollectionChange<T>[]] {
  const [subscribe, getSnapshot] = proxyCollection(collection);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** @deprecated instead use [useState()](https://react.dev/reference/react/useState) to get simplicity. */
export function useArrayChanges<T>(
  init?: ArrayLike<T>,
): [T[], ...CollectionChange<T[]>[]] {
  const collection = Array.from(init ?? []);
  // oxlint-disable-next-line typescript/no-deprecated
  return useCollectionChanges(collection);
}

/** @deprecated instead use [useState()](https://react.dev/reference/react/useState) to get simplicity. */
export function useMapChanges<T, U>(
  init?: ConstructorParameters<typeof Map<T, U>>[0],
): [Map<T, U>, ...CollectionChange<Map<T, U>>[]] {
  const collection = new Map(init);
  // oxlint-disable-next-line typescript/no-deprecated
  return useCollectionChanges(collection);
}

/** @deprecated instead use [useState()](https://react.dev/reference/react/useState) to get simplicity. */
export function useRecordChanges<
  T extends Iterable<readonly [PropertyKey, any]>,
>(
  init?: T,
): T extends Iterable<readonly [infer K, infer V]>
  ? K extends PropertyKey ? [Record<K, V>, ...CollectionChange<Record<K, V>>[]]
  : never
  : never {
  const collection = Object.fromEntries(init ?? []);
  // oxlint-disable-next-line typescript/no-deprecated
  return useCollectionChanges(collection) as any;
}

/** @deprecated instead use [useState()](https://react.dev/reference/react/useState) to get simplicity. */
export function useSetChanges<T>(
  init?: ConstructorParameters<typeof Set<T>>[0],
): [Set<T>, ...CollectionChange<Set<T>>[]] {
  const collection = new Set(init);
  // oxlint-disable-next-line typescript/no-deprecated
  return useCollectionChanges(collection);
}

interface Context<T extends CollectionLike> {
  // changes: CollectionChange<T>[];
  readonly onValueChange: (changes: CollectionChange<T>[]) => void;
  proxy: T;
}
const regexIndex = /^(?:0|[1-9]\d*)$/;

function proxyCollection<T extends CollectionLike>(
  collection: T,
): Parameters<typeof useSyncExternalStore<[T, ...CollectionChange<T>[]]>> {
  type P = Parameters<
    typeof useSyncExternalStore<[T, ...CollectionChange<T>[]]>
  >;
  type Subscribe = P[0];
  type GetSnapshot = P[1];
  let snapshot: ReturnType<GetSnapshot>;
  const context: Context<T> = {
    onValueChange(changes) {
      snapshot = [context.proxy, ...changes];
      for (const callback of callbacks) {
        callback();
      }
    },
    // @ts-expect-error reassign later
    proxy: null,
  };
  const callbacks = new Set<() => void>();
  const subscribe: Subscribe = (callback) => {
    callbacks.add(callback);
    snapshot = [context.proxy];
    return () => {
      callbacks.delete(callback);
    };
  };
  const getSnapshot: GetSnapshot = () => snapshot;
  const boundFns = new Map<string | symbol, (...args: any[]) => any>();
  const trappedFns: Partial<TrappableMutationFns> = {
    add: createTrappedFn(context, collection as Set<any>, 'add'),
    clear: createTrappedFn(context, collection as Set<any>, 'clear'),
    delete: createTrappedFn(context, collection as Set<any>, 'delete'),
    getOrInsert: createTrappedFn(
      context,
      collection as Map<any, any>,
      'getOrInsert',
    ),
    getOrInsertComputed: createTrappedFn(
      context,
      collection as Map<any, any>,
      'getOrInsertComputed',
    ),
    remove: createTrappedFn(context, collection as DOMTokenList, 'remove'),
    replace: createTrappedFn(context, collection as DOMTokenList, 'replace'),
    set: createTrappedFn(context, collection as Map<any, any>, 'set'),
    toggle: createTrappedFn(context, collection as DOMTokenList, 'toggle'),
  } satisfies Required<TrappableMutationFns>;

  context.proxy = new Proxy(collection, {
    get(target, p) {
      const value = target[p as keyof typeof target];

      if (typeof value !== 'function') {
        return value;
      }
      type K = keyof typeof trappedFns;
      let fn: ((...args: any[]) => any) | undefined = trappedFns[p as K];
      if (!fn) {
        fn = boundFns.get(p);
        if (!fn) {
          fn = value.bind(collection);
          boundFns.set(p, fn as NonNullable<typeof fn>);
        }
      }
      return fn;
    },
    set: !Array.isArray(collection)
      ? !(
          typeof DOMTokenList !== 'undefined'
          && collection instanceof DOMTokenList
        )
        // collection is a Map, Set or plain object. there is no trap.
        ? (target, index, value) => {
          target[index as keyof typeof target] = value;
          return true;
        }
        // collection is a DOMTokenList. treat setting the `value` prop.
        : (target, index, value) => {
          if (index === 'value') {
            const changes: CollectionChange<DOMTokenList>[] = [];
            const tokens = target as DOMTokenList;
            const removed = new Map(
              Array.from(tokens.entries()).map(([index, value]) => [
                value,
                index,
              ]),
            );
            tokens[index] = value;

            for (const [value, index] of removed) {
              if (!tokens.contains(value)) {
                changes.push([index, value, true]);
              }
            }
            for (const [index, value] of tokens.entries()) {
              if (!removed.has(value)) {
                changes.push([index, value, false]);
              }
            }
            if (changes.length > 0) {
              context.onValueChange(changes as CollectionChange<T>[]);
            }
          } else {
            target[index as keyof typeof target] = value;
          }
          return true;
        }
      // collection is an Array. treat setting a value with index like `[0]`.
      // also treat setting the `length` prop.
      : (target, index, value) => {
        let changes: CollectionChange<any[]>[] | undefined;

        if (typeof index === 'string') {
          const list = target as any[];

          if (regexIndex.test(index)) {
            const i = Number(index);

            if (list[i] !== value) {
              list[i] = value;
              changes = [i, value, false];
            }
          } else if (index === 'length') {
            const beforeLength = list[index];
            const afterLength = value as number;

            if (afterLength > beforeLength) {
              for (let i = beforeLength; i < afterLength; i++) {
                changes ??= [];
                changes.push([i, undefined, false]);
              }
            } else if (afterLength < beforeLength) {
              for (let i = beforeLength - 1; i > afterLength; i--) {
                changes ??= [];
                changes.unshift([i, list[i], false]);
              }
            }
          }
        }
        target[index as keyof typeof target] = value;

        if ((changes?.length ?? 0) > 0) {
          context.onValueChange(changes as CollectionChange<T>[]);
        }
        return true;
      },
  });
  snapshot = [context.proxy];
  return [subscribe, getSnapshot, getSnapshot];
}

function createTrappedFn<
  T extends MutationMapFns | MutationSetFns | MutationDOMTokenListFns,
  K extends keyof T,
>(
  context: Context<any>,
  collection: T,
  name: K,
): T[K] extends (...args: any[]) => unknown
  ? (...params: Parameters<T[K]>) => ReturnType<T[K]>
  : undefined {
  const value = collection[name];

  if (typeof value !== 'function') {
    return undefined as any;
  }
  const ret: (...args: any[]) => any = (...args) => {
    const fnName = name as keyof TrappableMutationFns;
    let changes: CollectionChange<CollectionLike>[] | undefined;
    let noKeyBeforeGetOrInsert = false;

    switch (fnName) {
      case 'add': {
        const n = getLength(collection);
        if (args.length > 1) {
          const ch: CollectionChange<DOMTokenList>[] = [];
          for (let i = 0; i < args.length; i++) {
            ch.push([n + i, args[i], false]);
          }
          changes = ch;
        } else {
          changes = [[args[0], false]] satisfies CollectionChange<Set<any>>[];
        }
        break;
      }
      case 'clear': {
        if ((collection as Partial<MutationSetFns>).add) {
          const ch: CollectionChange<Set<any>>[] = [];
          for (const value of collection as Set<any>) {
            ch.push([value, true]);
          }
          changes = ch;
        } else {
          const ch: CollectionChange<Map<any, any>>[] = [];
          for (const [key, value] of collection as Map<any, any>) {
            ch.push([key, value, true]);
          }
          changes = ch;
        }
        break;
      }
      case 'delete': {
        if ((collection as Partial<MutationSetFns>).add) {
          const ch: CollectionChange<Set<any>>[] = [[args[0], true]];
          changes = ch;
        } else {
          const ch: CollectionChange<Map<any, any>>[] = [
            [args[0], (collection as Map<any, any>).get(args[0]), false],
          ];
          changes = ch;
        }
        break;
      }
      case 'getOrInsert':
      case 'getOrInsertComputed': {
        const map = collection as Map<any, any>;
        noKeyBeforeGetOrInsert = !map.has(args[0]);
        break;
      }
      case 'remove': {
        const ch: CollectionChange<DOMTokenList>[] = [];
        const tokens = collection as DOMTokenList;

        for (const [index, value] of tokens.entries()) {
          if (args.includes(value)) {
            ch.push([index, value, true]);
          }
        }
        changes = ch;
        break;
      }
      case 'replace': {
        const tokens = collection as DOMTokenList;
        const [oldVal, newVal] = args as Parameters<DOMTokenList['replace']>;

        if (oldVal !== newVal) {
          for (const [index, value] of tokens.entries()) {
            if (value === oldVal) {
              const ch: CollectionChange<DOMTokenList>[] = [
                [index, oldVal, true],
                [index, newVal, false],
              ];
              changes = ch;
              break;
            }
          }
        }
        break;
      }
      case 'set': {
        const [key, value] = args as Parameters<Map<any, any>['set']>;

        if ((collection as Map<any, any>).get(key) !== value) {
          const ch: CollectionChange<Map<any, any>>[] = [[key, value, false]];
          changes = ch;
        }
        break;
      }
      case 'toggle': {
        const tokens = collection as DOMTokenList;
        const [token, force] = args as Parameters<DOMTokenList['toggle']>;

        for (const [index, value] of tokens.entries()) {
          if (value === token) {
            const ch: CollectionChange<DOMTokenList>[] = [];

            switch (force) {
              case true: {
                if (!tokens.contains(token)) {
                  ch.push([index, value, false]);
                }
                break;
              }
              case false: {
                if (tokens.contains(token)) {
                  ch.push([index, value, true]);
                }
                break;
              }
              default: {
                if (tokens.contains(token)) {
                  ch.push([index, value, true]);
                } else {
                  ch.push([index, value, false]);
                }
              }
            }
            if (ch.length > 0) {
              changes = ch;
            }
            break;
          }
        }
        break;
      }
      default: {
        const n: never = fnName;
        // oxlint-disable-next-line no-unused-expressions
        n;
        break;
      }
    }
    const ret = value.apply(collection, args);

    switch (fnName) {
      case 'getOrInsert':
      case 'getOrInsertComputed': {
        if (noKeyBeforeGetOrInsert) {
          const ch: CollectionChange<Map<any, any>>[] = [[args[0], ret, false]];
          changes ??= [];
          changes.push(...ch);
        }
      }
    }
    if (changes) {
      context.onValueChange(changes);
    }
    // ensure to support method chaining
    return ret === collection ? context.proxy : ret;
  };
  // avoid an error like "Set.prototype.add called on incompatible receiver"
  return ret.bind(collection) as ReturnType<typeof createTrappedFn<T, K>>;
}

function getLength(collection: CollectionLike): number {
  const length: number | undefined =
    (collection as Partial<any[] | DOMTokenList>).length
      ?? (collection as Partial<Map<any, any> | Set<any>>).size;

  if (length == undefined) {
    throw TypeError('unable to get a length');
  }
  return length;
}
