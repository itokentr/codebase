import * as platformTest from 'bun:test';
import type { Describe, Hook, Test, TestFn } from '../interface.ts';

function d(name: string, fn: TestFn): void {
  platformTest.describe(name, () => void fn());
}
export const describe: Describe = d as Describe;
describe.only = (name, fn) => platformTest.describe.only(name, () => void fn());
describe.skip = (name, fn) => platformTest.describe.skip(name, () => void fn());
describe.todo = (name, fn) => platformTest.describe.todo(name, () => void fn());

function i(name: string, fn: TestFn): void {
  platformTest.it(name, fn);
}
export const it: Test = i as Test;
it.only = (name, fn) => platformTest.it.only(name, fn);
it.skip = (name, fn) => platformTest.it.skip(name, fn);
it.todo = (name, fn) => platformTest.it.todo(name, fn);

function t(name: string, fn: TestFn): void {
  platformTest.test(name, fn);
}
export const test: Test = t as Test;
test.only = (name, fn) => platformTest.test.only(name, fn);
test.skip = (name, fn) => platformTest.test.skip(name, fn);
test.todo = (name, fn) => platformTest.test.todo(name, fn);

export const after: Hook = platformTest.afterAll;
export const afterEach: Hook = platformTest.afterEach;
export const before: Hook = platformTest.beforeAll;
export const beforeEach: Hook = platformTest.beforeEach;
