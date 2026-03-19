'use client';
import { ExternalStore, useExternalStore } from './external-store.tsx';

export type ReducerFunction<T> = (
  state: T,
  ...action: readonly any[]
) => T | Promise<T>;

export interface ReducerFunctions<T> {
  readonly [name: string]: ReducerFunction<T>;
}

export type StateLogic<T, F extends ReducerFunction<T>> = F extends (
  state: T,
  ...action: infer U
) => infer V
  // oxlint-disable-next-line typescript/no-invalid-void-type
  ? (...action: U) => V extends Promise<any> ? Promise<void> : void
  : never;

export type StateLogics<T, R extends ReducerFunctions<T>> = {
  readonly [K in keyof R]: StateLogic<T, R[K]>;
};

export type UseStateLogicsHook<T, R extends ReducerFunctions<T>> = () => [
  T,
  StateLogics<T, R>,
];

/**
 * @example
 * ```tsx
 * interface AppState {
 *   readonly count: number;
 * }
 *
 * const reducers = {
 *   increment({count}) {
 *     return {count: count + 1};
 *   },
 *   async update(state, count: number) {
 *     await sleep(200);
 *     return {count};
 *   },
 * } satisfies ReducerFunctions<AppState>;
 *
 * const useAppState = createStateLogics(
 *   {count: 0} as AppState,
 *   reducers,
 * );
 *
 * function Component() {
 *   const [state, logics] = useAppState();
 *
 *   function onIncrement() {
 *     logics.increment();
 *   }
 *   async function onUpdate() {
 *     startTransition(async () =>
 *       await logics.update(123);
 *     });
 *   }
 *   return (
 *     <>
 *       <button onClick={onIncrement}>increment</button>
 *       <button onClick={onUpdate}>update</button>
 *       {state.count}
 *     </>
 *   );
 * }
 * ```
 */
export function createStateLogics<T, const R extends ReducerFunctions<T>>(
  initial: T,
  reducers: R,
): UseStateLogicsHook<T, R> {
  const store = new StateStore<T, R>(initial, reducers);
  const hook: UseStateLogicsHook<T, R> = function useStateActions() {
    'use memo';
    const state = useExternalStore(store);
    return [state, store.logics];
  };
  return hook;
}

class StateStore<T, R extends ReducerFunctions<T>> extends ExternalStore<T> {
  readonly logics: StateLogics<T, R>;
  #pending: Promise<void> | undefined;
  readonly #reducers: R;
  #state: T;

  constructor(state: T, reducers: R) {
    super();
    this.logics = new Proxy({} as StateLogics<T, R>, this.#proxyHandler);
    this.#reducers = reducers;
    this.#state = state;
  }

  protected override getSnapshotValue(): T {
    return this.#state;
  }

  #callReducer(name: keyof R, ...action: unknown[]): void | Promise<void> {
    const fn = this.#reducers[name] as ReducerFunction<T>;
    const newState = fn.apply(this.#reducers, [this.#state, ...action]);

    if (newState instanceof Promise) {
      return newState.then((state: T) => {
        this.#state = state;
        this.notifyChange();
      });
    }
    this.#state = newState;
    this.notifyChange();
  }

  readonly #proxyHandler: ProxyHandler<StateLogics<T, R>> = {
    get: (_target, p) => {
      if (!(p in this.#reducers)) {
        throw TypeError(`unable to access the property: ${String(p)}`);
      }
      return (...args: unknown[]): void | Promise<void> => {
        const name = p as keyof R;

        if (this.#pending) {
          const promise = Promise.resolve(this.#pending)
            .then(() => {
              return this.#callReducer(name, ...args);
            })
            .finally(() => {
              this.#pending = undefined;
            });
          this.#pending = promise;
          return promise;
        }
        return this.#callReducer(name, ...args);
      };
    },
  };
}
