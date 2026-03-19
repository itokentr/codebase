import { afterEach, describe, it } from '@repo/test';
import * as assert from 'node:assert/strict';

describe('afterEach', () => {
  let i = 1;
  afterEach(() => {
    i++;
  });
  it('1st test', () => {
    assert.equal(i, 1);
  });
  it('2nd test', () => {
    assert.equal(i, 2);
  });
  it('3rd test', () => {
    assert.equal(i, 3);
  });
});
