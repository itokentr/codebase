import type { FunctionComponent } from 'react';

export function exports<T extends FunctionComponent<any>, U extends object>(
  component: T,
  exports: U,
): T & Readonly<U> {
  type Return = T & U;
  const ret = component as Return;

  for (const [name, value] of Object.entries(exports) as [keyof U, any][]) {
    // oxlint-disable-next-line typescript/no-unsafe-assignment
    (ret as U)[name] = value;
  }
  return ret;
}
