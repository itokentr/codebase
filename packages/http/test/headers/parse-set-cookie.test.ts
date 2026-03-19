import * as assert from '@lib/assert';
import { HttpHeaders } from '@lib/http';
import { describe, it } from '@repo/test';

describe(`parsing set-cookie header`, () => {
  const setCookie =
    `__cfduid=dd496c8aacf1c51f6f92c4c9676c37e191598070860; expires=Mon, 21-Sep-20 04:34:20 GMT; path=/; domain=.nodejs.org; HttpOnly; SameSite=Lax`;
  const h = new HttpHeaders([[`Set-Cookie`, setCookie]]);

  it(`get('set-cookie')`, () => {
    assert.equal(setCookie, h.get(`set-cookie`));
  });

  it(`getParsed('set-cookie')`, () => {
    assert.equal(1, h.getParsedValue(`set-cookie`)?.length);
  });

  it(`getParamValues('set-cookie', 'expires')`, () => {
    const p = h.getParamValues(`set-cookie`, `expires`);
    assert.ok(Array.isArray(p));
    assert.equal(1, p.length);
    assert.equal(`Mon, 21-Sep-20 04:34:20 GMT`, p[0]);
  });
});
