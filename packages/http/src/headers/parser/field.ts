import type { ParseBodyOptions } from './parse-body.ts';
import { parseBody } from './parse-body.ts';
import type { HeaderFieldValueList } from './types.ts';
import {
  canonFieldName,
  canonParamName,
  normalizeFieldName,
  tokenRegex,
} from './utils.ts';

export type HeaderFieldParseOptions = Pick<
  ParseBodyOptions,
  Exclude<keyof ParseBodyOptions, 'chunk'>
>;

export class HeaderField {
  readonly name: string;
  readonly body: string;

  constructor(name: string, body: string) {
    this.name = canonFieldName(name);
    this.body = body;
  }

  static canonFieldName(name: string): string {
    return canonFieldName(name);
  }

  static canonParamName(name: string): string {
    return canonParamName(name);
  }

  static isValidForName(value: string): boolean {
    return tokenRegex.test(value);
  }

  static normalizeFieldName(name: string): string {
    return normalizeFieldName(name);
  }

  static parseBody(
    body: string,
    options?: HeaderFieldParseOptions,
  ): HeaderFieldValueList {
    return parseBody({ ...options, chunk: body });
  }

  [Symbol.toPrimitive](hint: 'default' | 'number' | 'string'): string | number {
    return (hint === `number`) ? Number.NaN : this.toString();
  }

  toFieldString(): string {
    return `${normalizeFieldName(this.name)}: ${this.body}`;
  }

  toString(): string {
    return this.body;
  }
}
