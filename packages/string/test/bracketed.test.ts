import assert from '@lib/assert';
import type { Bracketed } from '@lib/string/bracketed';
import { createBracketed } from '@lib/string/bracketed';
import { describe, it } from '@repo/test';

describe('createBracketed', () => {
  it('should handle nested brackets correctly', () => {
    const text = '((a)(b))';
    const generator = createBracketed(text, '(', ')');
    const results = Array.from(generator);

    assert.equal(results.length, 3);
    assert.equal(results[0]?.text, '((a)(b))');
    assert.equal(results[0].innerText, '(a)(b)');
    assert.equal(results[1]?.text, '(a)');
    assert.equal(results[1].innerText, 'a');
    assert.equal(results[2]?.text, '(b)');
    assert.equal(results[2].innerText, 'b');
  });

  it('should handle siblings if the first match has no children', () => {
    const text = '(a)(b)';
    const generator = createBracketed(text, '(', ')');
    const results = Array.from(generator);

    assert.equal(results.length, 2);
    assert.equal(results[0]?.text, '(a)');
    assert.equal(results[1]?.text, '(b)');
  });
});

describe('bracketed iteration', () => {
  const openRegex = /^\/\/\s*#region(?:\s+(.+)|\s*?)$/m;
  const closeRegex = /^\/\/\s*#endregion\s*?$/m;
  const text = `
// #region foobarbaz
const foo = 'foo';
const bar = 'bar';
// #region hogehuga
const hoge = 'hoge';
const huga = 'huga';
// #endregion
const baz = 'baz';
// #endregion
`;
  function doIteration(iter: Iterable<Bracketed>): void {
    let iterated = 0;
    for (const bracketed of iter) {
      switch (++iterated) {
        case 1: {
          assert.ok(bracketed.text.startsWith('// #region foobarbaz'));
          break;
        }
        case 2: {
          assert.ok(bracketed.text.startsWith('// #region hogehuga'));
          break;
        }
        default: {
          assert.fail(`unexpected iterations: ${iterated}`);
        }
      }
    }
    assert.equal(iterated, 2);
  }
  it('by generator should be done well', () => {
    const iter = createBracketed(text, openRegex, closeRegex);
    doIteration(iter);
  });
});
