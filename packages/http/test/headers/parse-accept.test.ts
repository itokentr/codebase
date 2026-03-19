import * as assert from '@lib/assert';
import { HttpHeaders } from '@lib/http';
import { describe, it } from '@repo/test';

describe(`parsing accept header`, () => {
  // see https://datatracker.ietf.org/doc/html/rfc7231#section-5.3.2
  const accept =
    `text/*;q=0.3, text/html;q=0.7, text/html;level=1;foo-param="some,\\"value\\"", text/html;level=2;q=0.4, */*;q=0.5`;
  const h = new HttpHeaders([[`Accept`, accept]]);

  describe(`get('accept')`, () => {
    it(`should return currect value`, () => {
      assert.equal(accept, h.get(`accept`));
    });
  });

  describe(`getValuesWithQuality('accept')`, () => {
    const q = h.getValueWithQuality(`accept`);

    it(`should return an array contains 5 items`, () => {
      assert.ok(Array.isArray(q));
      assert.equal(5, q.length);
    });

    it(`[0].qvalue should be 1`, () => {
      assert.equal(1, q?.[0]?.qvalue);
    });

    it(`[0].params should be a map`, () => {
      assert.ok(q?.[0]?.params instanceof Map);
    });

    it(`[0].params.size should be 2`, () => {
      assert.equal(2, q?.[0]?.params?.size);
    });

    it(`[0].params.get('level') should return "1"`, () => {
      assert.equal(`1`, q?.[0]?.params?.get(`level`));
    });

    it(`[0].params.get('foo-param') should return <some,"value">`, () => {
      assert.equal(`some,"value"`, q?.[0]?.params?.get(`foo-param`));
    });

    it(`[0].values.length should be 1`, () => {
      assert.equal(1, q?.[0]?.strings?.length);
    });

    it(`[0].values[0] should be 1`, () => {
      assert.equal(`text/html`, q?.[0]?.strings?.[0]);
    });

    it(`[1].qvalue should be 0.7`, () => {
      assert.equal(0.7, q?.[1]?.qvalue);
    });

    it(`[1].params should be null`, () => {
      assert.equal(null, q?.[1]?.params);
    });

    it(`[1].values.length should be 1`, () => {
      assert.equal(1, q?.[1]?.strings?.length);
    });

    it(`[1].values[0] should be 1`, () => {
      assert.equal(`text/html`, q?.[1]?.strings?.[0]);
    });
  });
});
