import {
  after,
  afterEach,
  before,
  beforeEach,
  describe,
  it,
  test,
} from '@repo/test';
import * as bunTest from 'bun:test';
import * as assert from 'node:assert/strict';

bunTest.test('after', () => {
  assert.ok(typeof after === 'function');
});

bunTest.test('afterEach', () => {
  assert.ok(typeof afterEach === 'function');
});

bunTest.test('before', () => {
  assert.ok(typeof before === 'function');
});

bunTest.test('beforeEach', () => {
  assert.ok(typeof beforeEach === 'function');
});

bunTest.test('describe', () => {
  assert.ok(typeof describe === 'function');
});

bunTest.test('it', () => {
  assert.ok(typeof it === 'function');
});

bunTest.test('test', () => {
  assert.ok(typeof test === 'function');
});
