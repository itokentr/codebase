// oxlint-disable no-unsafe-optional-chaining
import * as assert from '@lib/assert';
import { describe, it } from '@repo/test';
import { parseBody } from '../../../src/headers/parser/parse-body.ts';
import {
  type HeaderFieldParam,
  HeaderFieldCommentString,
  HeaderFieldQuotedString,
  HeaderFieldRawString,
} from '../../../src/headers/parser/types.ts';

describe(`result of parsing forwarded`, () => {
  const result = parseBody({
    chunk:
      `for=192.0.2.60, For\\="[2001:db8:cafe::17]:4711"; (some, \\(comment) proto="some,value"; by=203.0.113.43`,
    keyValueDelimiters: `=`,
    listDelimiters: `,`,
    paramDelimiters: `; `,
    strictKeyValuePair: true,
  });

  it(`its length should be 2`, () => {
    assert.equal(2, result.length);
  });

  it(`[0].length should be 1`, () => {
    assert.equal(1, result[0]?.length);
  });

  it(`[0][0] should be a map`, () => {
    assert.ok(result[0]?.[0] instanceof Map);
  });

  it(`size of [0][0] should be 1`, () => {
    assert.equal(1, (result[0]?.[0] as HeaderFieldParam).size);
  });

  it(`[0][0].get('for') should return an array`, () => {
    assert.ok(Array.isArray((result[0]?.[0] as HeaderFieldParam).get(`for`)));
  });

  it(`[0][0].get('for').length should be 1`, () => {
    assert.equal(
      1,
      (result[0]?.[0] as HeaderFieldParam).get(`for`)?.length,
    );
  });

  it(`[0][0].get('for')[0] should be HeaderFieldRawString`, () => {
    assert.ok(
      (result[0]?.[0] as HeaderFieldParam).get(`for`)?.[0]
        instanceof HeaderFieldRawString,
    );
  });

  it(`[1].length should be 4`, () => {
    assert.equal(4, result[1]?.length);
  });

  it(`[1][0] should be an array`, () => {
    assert.ok(Array.isArray(result[1]?.[0]));
  });

  it(`[1][0].length should be 2`, () => {
    assert.equal(2, (result[1]?.[0] as unknown[]).length);
  });

  it(`[1][0][0] should be HeaderFieldRawString`, () => {
    assert.ok((result[1]?.[0] as unknown[])[0] instanceof HeaderFieldRawString);
  });

  it(`[1][0][0] should be stringified as "For="`, () => {
    assert.equal(
      `For=`,
      ((result[1]?.[0] as unknown[])[0] as HeaderFieldRawString).toString(),
    );
  });

  it(`[1][0][1] should be HeaderFieldQuotedString`, () => {
    assert.ok(
      (result[1]?.[0] as unknown[])[1] instanceof HeaderFieldQuotedString,
    );
  });

  it(`[1][0][1] should be stringified as "[2001:db8:cafe::17]:4711"`, () => {
    assert.equal(
      `[2001:db8:cafe::17]:4711`,
      ((result[1]?.[0] as unknown[])[1] as HeaderFieldQuotedString).toString(),
    );
  });

  it(`[1][1] should be an array`, () => {
    assert.ok(Array.isArray(result[1]?.[1]));
  });

  it(`[1][1].length should be 1`, () => {
    assert.equal(1, (result[1]?.[1] as unknown[]).length);
  });

  it(`[1][1][0] should be HeaderFieldCommentString`, () => {
    assert.ok(
      (result[1]?.[1] as unknown[])[0] instanceof HeaderFieldCommentString,
    );
  });

  it(`[1][1][0] should be stringified as "some, (comment"`, () => {
    assert.equal(
      `some, (comment`,
      String((result[1]?.[1] as unknown[])[0] as HeaderFieldCommentString),
    );
  });

  it(`[1][2] should be a map`, () => {
    assert.ok(result[1]?.[2] instanceof Map);
  });

  it(`size of [1][2] should be 1`, () => {
    assert.equal(1, (result[1]?.[2] as HeaderFieldParam).size);
  });

  it(`[1][2].get('proto') should return an array`, () => {
    assert.ok(
      Array.isArray((result[1]?.[2] as HeaderFieldParam).get(`proto`)),
    );
  });

  it(`[1][2].get('proto').length should be 1`, () => {
    assert.equal(
      1,
      (result[1]?.[2] as HeaderFieldParam).get(`proto`)?.length,
    );
  });

  it(`[1][2].get('proto')[0] should be HeaderFieldQuotedString`, () => {
    assert.ok(
      (result[1]?.[2] as HeaderFieldParam).get(`proto`)?.[0]
        instanceof HeaderFieldQuotedString,
    );
  });

  it(`[1][2].get('proto')[0] should be stringified as "some,value"`, () => {
    assert.equal(
      `some,value`,
      ((result[1]?.[2] as HeaderFieldParam)
        .get(`proto`)?.[0] as HeaderFieldQuotedString).toString(),
    );
  });

  it(`[1][3] should be a map`, () => {
    assert.ok(result[1]?.[3] instanceof Map);
  });
});
