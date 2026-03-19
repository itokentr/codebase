import {
  after,
  afterEach,
  before,
  beforeEach,
  describe,
  it,
  test,
} from '@repo/test';
import * as assert from 'node:assert/strict';
import * as nodeTest from 'node:test';

await nodeTest.test('after', () => {
  assert.ok(typeof after === 'function');
});

await nodeTest.test('afterEach', () => {
  assert.ok(typeof afterEach === 'function');
});

await nodeTest.test('before', () => {
  assert.ok(typeof before === 'function');
});

await nodeTest.test('beforeEach', () => {
  assert.ok(typeof beforeEach === 'function');
});

await nodeTest.test('describe', () => {
  assert.ok(typeof describe === 'function');
});

await nodeTest.test('it', () => {
  assert.ok(typeof it === 'function');
});

await nodeTest.test('test', () => {
  assert.ok(typeof test === 'function');
});
