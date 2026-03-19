import pattern from './uri-regexp.ts';

export interface UriRegExpMatch {
  readonly [Symbol.toStringTag]: string;
  readonly fragment: string;
  readonly host: string;
  readonly index: number;
  readonly pathname: string;
  readonly port: number | null;
  readonly query: string;
  readonly scheme: string;
  readonly uri: string;
  readonly userInfo: string;
  [Symbol.toPrimitive](): string;
  toString(): string;
}

export function createUriRegExp(flags?: string): RegExp {
  return new RegExp(pattern, flags);
}

function createUriRegExpMatch(
  match: RegExpExecArray,
  regex: RegExp,
): UriRegExpMatch {
  const uri = match[0];
  const port = Number(match[4] ?? null);
  const index = regex.lastIndex - uri.length;
  // eslint-disable-next-line sort-keys
  return {
    [Symbol.toStringTag]: 'UriRegExpMatch',
    fragment: match[8] ?? '',
    host: match[3] ?? '',
    index,
    pathname: match[5] ?? '',
    port: isNaN(port) ? null : port,
    query: match[7] ?? '',
    scheme: match[1] ?? '',
    uri,
    userInfo: match[2] ?? '',
    [Symbol.toPrimitive]() {
      return uri;
    },
    toString() {
      return uri;
    },
  };
}

export function* createUriMatches(str: string): Generator<UriRegExpMatch> {
  const regex = createUriRegExp('g');
  for (let match = regex.exec(str); match; match = regex.exec(str)) {
    yield createUriRegExpMatch(match, regex);
  }
}
