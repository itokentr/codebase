import type { JestExpect } from '@jest/expect';

export type ExpectFn = {
  (value: unknown): Pick<
    ReturnType<JestExpect>,
    // pick supported by bun
    | 'not'
    | 'toBe'
    | 'toEqual'
    | 'toBeNull'
    | 'toBeUndefined'
    | 'toBeNaN'
    | 'toBeDefined'
    | 'toBeFalsy'
    | 'toBeTruthy'
    | 'toStrictEqual'
    | 'toContain'
    | 'toHaveLength'
    | 'toMatch'
    | 'toContainEqual'
    | 'toHaveProperty'
    | 'toMatchObject'
    | 'toBeCloseTo'
    | 'toBeGreaterThan'
    | 'toBeGreaterThanOrEqual'
    | 'toBeLessThan'
    | 'toBeLessThanOrEqual'
    | 'toThrow'
    | 'toBeInstanceOf'
    | 'resolves'
    | 'rejects'
    | 'toHaveBeenCalled'
    | 'toHaveBeenCalledTimes'
    | 'toHaveBeenCalledWith'
    | 'toHaveBeenLastCalledWith'
    | 'toHaveBeenNthCalledWith'
    | 'toHaveReturned'
    | 'toHaveReturnedTimes'
    | 'toHaveReturnedWith'
    | 'toHaveLastReturnedWith'
    | 'toHaveNthReturnedWith'
    | 'toMatchSnapshot'
    | 'toMatchInlineSnapshot'
    | 'toThrowErrorMatchingSnapshot'
    | 'toThrowErrorMatchingInlineSnapshot'
  >;
} & Pick<
  JestExpect,
  | 'arrayContaining'
  | 'closeTo'
  | 'objectContaining'
  | 'stringContaining'
  | 'stringMatching'
  | 'extend'
  | 'anything'
  | 'any'
  | 'assertions'
  | 'hasAssertions'
>;

export declare const expect: ExpectFn;
