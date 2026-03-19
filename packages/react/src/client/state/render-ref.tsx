'use client';
import type { RefObject } from 'react';
import { useRef, useState } from 'react';
import { useRender } from './render.tsx';

const C: keyof RefObject<unknown> = 'current';

/** returns a ref object which triggers a render when `current` is changed */
export function useRenderRef<T>(initialValue: T): RefObject<T> {
  const ref = useRef(initialValue);
  const render = useRender();
  const [proxy] = useState<RefObject<T>>(
    () =>
      new Proxy(ref, {
        set(target, p, newValue) {
          type K = keyof typeof target;
          let changed: true | undefined;
          if (p === C) {
            if (!Object.is(newValue, target[p as K])) {
              changed = true;
            }
          }
          target[p as K] = newValue as (typeof target)[K];
          if (changed) {
            render();
          }
          return true;
        },
      }),
  );
  return proxy;
}
