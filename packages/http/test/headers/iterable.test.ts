import * as assert from '@lib/assert';
import { HttpHeaders } from '@lib/http';
import { describe, it } from '@repo/test';

describe(`headers iteration`, () => {
  it(`iterate record`, () => {
    const h = new HttpHeaders(
      [
        [`content-type`, `text/html`],
        [`Set-Cookie`, [`foo=1`, `bar=2`, `baz=3`]],
      ],
    );
    let iterated = 0;
    for (const [name, value] of h.toIterableRecord()) {
      switch (name) {
        case `content-type`: {
          assert.ok(typeof value === `string`);
          assert.equal(value, `text/html`);
          iterated++;
          break;
        }
        case `set-cookie`: {
          assert.ok(Array.isArray(value));
          assert.equal(value.length, 3);
          assert.equal(value[0], `foo=1`);
          assert.equal(value[1], `bar=2`);
          assert.equal(value[2], `baz=3`);
          iterated++;
          break;
        }
        default: {
          assert.fail(`unexpected header name ${name}`);
        }
      }
    }
    assert.equal(iterated, 2);
  });
});
