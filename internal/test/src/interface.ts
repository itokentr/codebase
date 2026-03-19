/* eslint-disable @typescript-eslint/no-invalid-void-type */

export type TestFn = () => void | Promise<unknown>;

export interface Describe {
  (name: string, fn: TestFn): void;
  only: (name: string, fn: TestFn) => void;
  skip: (name: string, fn: TestFn) => void;
  todo: (name: string, fn: TestFn) => void;
}

export interface Test {
  (name: string, fn: TestFn): void;
  only: (name: string, fn: TestFn) => void;
  skip: (name: string, fn: TestFn) => void;
  todo: (name: string, fn: TestFn) => void;
}

export type HookFn = () => void | Promise<unknown>;
export type Hook = (fn: HookFn) => void;

export declare const after: Hook;
export declare const afterEach: Hook;
export declare const before: Hook;
export declare const beforeEach: Hook;
export declare const describe: Describe;
export declare const it: Test;
export declare const test: Test;
