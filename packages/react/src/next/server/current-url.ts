'use server';
import { headers as nextHeaders } from 'next/headers';
import type { NextRequest, NextResponse } from 'next/server';
import assert from 'node:assert/strict';
import { cache } from 'react';

// TODO: consider security risk
const HEADER_NAME = `X-NEXT-URL-${Math.random().toString(36).substring(2, 10)}`;

/**
 * get current route url for a server component.
 *
 * for a client component use hook [usePathname()](https://nextjs.org/docs/app/api-reference/functions/use-pathname) instead.
 */
export const currentURL = cache(async function currentURL(): Promise<URL> {
  const headers = await nextHeaders();
  const currentUrl = headers.get(HEADER_NAME);
  assert.ok(currentUrl, 'unexpected no current-url set in a next.js proxy');
  return new URL(currentUrl);
});

/**
 * provide current route url for a server component.
 *
 * should be called within [/proxy.ts](https://nextjs.org/docs/app/api-reference/file-conventions/proxy).
 *
 * use {@link currentURL} to get the url in a server component.
 */
// eslint-disable-next-line typescript/require-await
export async function setCurrentURL(
  request: NextRequest,
): Promise<NonNullable<Parameters<typeof NextResponse.next>[0]>['request']> {
  const headers = new Headers(request.headers);
  headers.set(HEADER_NAME, request.url);
  return { headers };
}
