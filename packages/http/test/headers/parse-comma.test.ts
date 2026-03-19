import * as assert from '@lib/assert';
import { HttpHeaders } from '@lib/http';
import { describe, it } from '@repo/test';

describe(`parsing comma separated`, () => {
  const h = new HttpHeaders([[
    `Some-Header`,
    `Foo, Bar, "Baz, Bum", Blur (comment), Busy, ,,Buster`,
  ]]);

  describe(`getStringValues()`, () => {
    const a = h.getStringValues(`some-header`);

    it(`should return an array contains 6 items`, () => {
      assert.ok(Array.isArray(a));
      assert.equal(6, a.length);
    });
  });
});
