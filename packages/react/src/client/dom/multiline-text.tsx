'use client';
import type { PropsWithChildren, ReactNode } from 'react';
import { flatReactNode } from './flat-react-node.ts';

export function MultilineText(
  { children }: PropsWithChildren,
): ReactNode {
  'use memo';
  return flatReactNode(children)?.map((node) => {
    if (typeof node === 'string') {
      return node.split('\n').map((line, i, arr) =>
        // oxlint-disable-next-line @eslint-react/no-array-index-key
        i + 1 < arr.length ? [line, <br key={`br${i}`} />] : line
      );
    }
    return node;
  });
}
