import { after, test } from '@repo/test';
import * as assert from 'node:assert/strict';

let tested = false;

after(() => {
  assert.ok(tested, 'after called but test not called');
});

test('after', () => {
  tested = true;
  assert.ok(true);
});
