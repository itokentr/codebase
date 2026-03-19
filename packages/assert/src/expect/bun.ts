import { expect as bunExpect } from 'bun:test';
import type { expect as jest } from './types.ts';

export const expect: typeof jest = bunExpect as unknown as typeof jest;
export type { ExpectFn } from './types.ts';
