import { setCurrentURL } from '@lib/react/next/server/current-url';
import type { NextRequest, ProxyConfig } from 'next/server';
import { NextResponse } from 'next/server';

export const config: ProxyConfig = {
  matcher: ['/((?!api|_next/static|\\.).*)'],
};

export default async function proxy(req: NextRequest): Promise<NextResponse> {
  const request = await setCurrentURL(req);
  return NextResponse.next({ request });
}
