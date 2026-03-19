import {
  HeaderFieldCommentString,
  HeaderFieldQuotedString,
  HeaderFieldRawString,
} from './types.ts';
import type { HeaderFieldString } from './types.ts';

const lowerCaseRegex = /\b([a-z])/g;
export const tokenRegex = /^[!#$%&'*+-.^_`|~A-Za-z0-9]+$/;
export const tokenOrZeroRegex = /^[!#$%&'*+-.^_`|~A-Za-z0-9]*$/;

function lowerCaseReplacer(substr: string, g1: string): string {
  return g1.toUpperCase();
}

export function normalizeFieldName(name: string): string {
  lowerCaseRegex.lastIndex = 0;
  return name.replace(lowerCaseRegex, lowerCaseReplacer);
}

export function canonFieldName(name: string): string {
  return name.toLowerCase();
}

export function canonParamName(name: string): string {
  return name.toLowerCase();
}

type GetChar = (v: Uint8Array | string, i: number) => number;

function getCharFromBuffer(buf: Uint8Array, i: number): number {
  return buf[i] as number;
}

function getCharFromString(str: string, i: number): number {
  return str.charCodeAt(i);
}

export function generateGetChar(chunk: Uint8Array | string): GetChar {
  return ((typeof chunk === `string`)
    ? getCharFromString
    : getCharFromBuffer) as GetChar;
}

export function toLiteralString(strs: HeaderFieldString[]): string {
  const ret: string[] = [];

  for (let i = 0, n = strs.length; i < n; i++) {
    const str = strs[i];

    if (str instanceof HeaderFieldRawString) {
      ret.push(str.toString());
    } else if (str instanceof HeaderFieldQuotedString) {
      ret.push(`"${String(str)}"`);
    } else if (str instanceof HeaderFieldCommentString) {
      ret.push(`(${String(str)})`);
    }
  }
  return ret.join(` `);
}
