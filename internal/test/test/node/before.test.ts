import { before, test } from '@repo/test';
import * as assert from 'node:assert/strict';

let init = false;

before(() => {
  init = true;
});

test('before', () => {
  assert.equal(init, true);
});
