'use client';
import type { FunctionComponent, ProviderProps, ReactNode } from 'react';
import { createContext, use } from 'react';

const WITHOUT_PROVIDER: unique symbol = Symbol();

export type UseValueHook<T> = () => T;
export type ValueProvider<T> = FunctionComponent<ProviderProps<T>>;

/**
 * @example
 * ```tsx
 * const [StuffProvider, useStuff] = createValueProvider(defaultValue);
 *
 * function Parent({children}) {
 *   return (
 *     <StuffProvider value={stuff}>
 *       {children}
 *     </StuffProvider>
 *   );
 * }
 *
 * function Child() {
 *   const someValue = useStuff();
 *   ...
 * }
 * ```
 */
export function createValueProvider<T>(
  defaultValue?: T,
): [Provider: ValueProvider<T>, useValue: UseValueHook<T>] {
  const hasDefaultValue = arguments.length > 0;
  const Context = createContext<T>(WITHOUT_PROVIDER as unknown as T);
  function Provider({ children, ...props }: ProviderProps<T>): ReactNode {
    'use memo';
    return <Context {...props}>{children}</Context>;
  }
  const useValue: UseValueHook<T> = function useValue() {
    'use memo';
    const value = use(Context);
    if (value === WITHOUT_PROVIDER) {
      if (hasDefaultValue) {
        return defaultValue as T;
      }
      throw TypeError('the hook should be used within the provider');
    }
    return value;
  };
  return [Provider, useValue];
}
