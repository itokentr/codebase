export interface Stringifyable {
  [Symbol.toPrimitive](hint?: 'default' | 'number' | 'string'): string;
}

export type StringLike = string | Stringifyable;
