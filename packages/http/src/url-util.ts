import type { URL } from '@lib/types/web/url';

export function getHostWithProtocol(url: URL): string {
  return `${url.protocol}//${url.hostname}:${getPort(url)}`;
}

export function getPort(url: URL): number {
  return (url.port.length > 0)
    ? Number(url.port)
    : (url.protocol.startsWith(`https`))
    ? 443
    : 80;
}
