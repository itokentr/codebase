import type { Headers, HeadersInit } from '@lib/types/web/fetch';
import type { StandardHttpHeaderName } from './standard-header-name.ts';

export type HttpHeaderValue = string | string[] | number;

export type StandardHttpHeaders = Partial<
  Record<StandardHttpHeaderName, HttpHeaderValue | undefined>
>;

export type NonStandardHttpHeaders = Record<
  string,
  HttpHeaderValue | undefined
>;

export type HttpHeaderCollection =
  & StandardHttpHeaders
  & NonStandardHttpHeaders;

export type HttpHeaderAppendableValue =
  | HeadersInit
  | Headers
  | Readonly<Readonly<HttpHeaderCollection>>;
