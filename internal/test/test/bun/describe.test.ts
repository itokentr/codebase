import { describe, it } from '@repo/test';
import * as assert from 'node:assert/strict';

describe('suite 1', () => {
  const stack: string[] = [];

  it('async 1', async () => {
    await new Promise((r) => {
      setTimeout(r, 1000);
    });
    assert.ok(true);
    stack.push('async 1');
  });

  it('async 2', async () => {
    await new Promise((r) => {
      setTimeout(r, 500);
    });
    assert.ok(true);
    stack.push('async 2');
  });

  it('sync 1', () => {
    assert.ok(true);
    stack.push('sync 1');
  });

  it('sync 2', () => {
    assert.ok(true);
    stack.push('sync 2');
  });

  it('async 3', async () => {
    await new Promise((r) => {
      setTimeout(r, 2000);
    });
    assert.ok(true);
    stack.push('async 3');
  });

  it('finally', () => {
    assert.equal(stack[0], 'async 1');
    assert.equal(stack[1], 'async 2');
    assert.equal(stack[2], 'sync 1');
    assert.equal(stack[3], 'sync 2');
    assert.equal(stack[4], 'async 3');
  });
});
