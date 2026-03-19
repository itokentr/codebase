import { jestExpect } from '@jest/expect';
import type { expect as jest } from './types.ts';

export const expect: typeof jest = jestExpect;
