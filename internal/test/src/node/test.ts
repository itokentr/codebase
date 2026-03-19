import * as platformTest from 'node:test';
import type { Describe, Hook, Test, TestFn } from '../interface.ts';

function d(name: string, fn: TestFn): void {
  void platformTest.describe(name, async () => void (await fn()));
}
export const describe: Describe = d as Describe;
describe.only = (name, fn) =>
  void platformTest.describe(
    name,
    { only: true },
    async () => void (await fn()),
  );
describe.skip = (name, fn) =>
  void platformTest.describe(
    name,
    { skip: true },
    async () => void (await fn()),
  );
describe.todo = (name, fn) =>
  void platformTest.describe(
    name,
    { todo: true },
    async () => void (await fn()),
  );

function i(name: string, fn: TestFn): void {
  void platformTest.it(name, async () => void (await fn()));
}
export const it: Test = i as Test;
it.only = (name, fn) =>
  void platformTest.it(name, { only: true }, async () => void (await fn()));
it.skip = (name, fn) =>
  void platformTest.it(name, { skip: true }, async () => void (await fn()));
it.todo = (name, fn) =>
  void platformTest.it(name, { todo: true }, async () => void (await fn()));

function t(name: string, fn: TestFn): void {
  void platformTest.test(name, async () => void (await fn()));
}
export const test: Test = t as Test;
test.only = (name, fn) =>
  void platformTest.test(name, { only: true }, async () => void (await fn()));
test.skip = (name, fn) =>
  void platformTest.test(name, { skip: true }, async () => void (await fn()));
test.todo = (name, fn) =>
  void platformTest.test(name, { todo: true }, async () => void (await fn()));

export const after: Hook = platformTest.after;
export const afterEach: Hook = platformTest.afterEach;
export const before: Hook = platformTest.before;
export const beforeEach: Hook = platformTest.beforeEach;
