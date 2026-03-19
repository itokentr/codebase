import * as assert from '@lib/assert';
import { HttpHeaders } from '@lib/http';
import { describe, it } from '@repo/test';

describe(`parsing forwarded header`, () => {
  const forwarded =
    `for=192.0.2.60, For="[2001:db8:cafe::17]:4711"; (some, \\(comment) Proto="some,value"; BY=203.0.113.43`;
  const h = new HttpHeaders([[`Forwarded`, forwarded]]);

  describe(`getParams('forwarded', true)`, () => {
    const p = h.getParams(`forwarded`, true);

    it(`should return a map contains 3 items`, () => {
      assert.ok(p instanceof Map);
      assert.equal(3, p.size);
    });

    it(`the map should have "for" with "192.0.2.60"`, () => {
      assert.equal(`192.0.2.60`, p?.get(`for`));
    });

    it(`the map should have "proto" with "some,value"`, () => {
      assert.equal(`some,value`, p?.get(`proto`));
    });

    it(`the map should have "by" with "203.0.113.43"`, () => {
      assert.equal(`203.0.113.43`, p?.get(`by`));
    });
  });

  describe(`getParams('forwarded', false)`, () => {
    const p = h.getParams(`forwarded`, false);

    it(`should return an array contains 4 items`, () => {
      assert.ok(Array.isArray(p));
      assert.equal(4, p.length);
    });

    it(`[0].size should be 1`, () => {
      assert.equal(1, p?.[0]?.size);
    });

    it(`[0].get('for') should return "192.0.2.60"`, () => {
      assert.equal(`192.0.2.60`, p?.[0]?.get(`for`));
    });

    it(`[1].size should be 1`, () => {
      assert.equal(1, p?.[1]?.size);
    });

    it(`[1].get('for') should return "[2001:db8:cafe::17]:4711"`, () => {
      assert.equal(`[2001:db8:cafe::17]:4711`, p?.[1]?.get(`for`));
    });

    it(`[2].size should be 1`, () => {
      assert.equal(1, p?.[2]?.size);
    });

    it(`[2].get('proto') should return "some,value"`, () => {
      assert.equal(`some,value`, p?.[2]?.get(`proto`));
    });

    it(`[3].size should be 1`, () => {
      assert.equal(1, p?.[3]?.size);
    });

    it(`[3].get('by') should return "203.0.113.43"`, () => {
      assert.equal(`203.0.113.43`, p?.[3]?.get(`by`));
    });
  });

  describe(`getParamValue('forwarded', 'for')`, () => {
    const p = h.getParamValues(`forwarded`, `for`);

    it(`should return an array contains 2 items`, () => {
      assert.ok(Array.isArray(p));
      assert.equal(2, p.length);
    });

    it(`[0] should be "192.0.2.60"`, () => {
      assert.equal(`192.0.2.60`, p?.[0]);
    });

    it(`[1] should be "[2001:db8:cafe::17]:4711"`, () => {
      assert.equal(`[2001:db8:cafe::17]:4711`, p?.[1]);
    });
  });
});
