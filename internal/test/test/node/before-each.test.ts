import { beforeEach, describe, it } from '@repo/test';
import * as assert from 'node:assert/strict';

describe('beforeEach', () => {
  let i = 0;
  beforeEach(() => {
    i += 1;
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
