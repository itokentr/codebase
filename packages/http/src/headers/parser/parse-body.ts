import type {} from '@lib/types/web/encoding';
import {
  HeaderFieldCommentString,
  HeaderFieldQuotedString,
  HeaderFieldRawString,
} from './types.ts';
import type {
  HeaderFieldString,
  HeaderFieldValueDelimited,
  HeaderFieldValueList,
} from './types.ts';
import {
  canonParamName,
  generateGetChar,
  toLiteralString,
  tokenOrZeroRegex,
  tokenRegex,
} from './utils.ts';

const spaceRegex = /^\x20+$/;

class CharacterContext extends Number {
  static readonly Comment = new CharacterContext(1);
  static readonly QuotedString = new CharacterContext(2);
  static readonly Top = new CharacterContext(3);
}

class Rfc2047Context extends Number {
  static readonly Charset = new CharacterContext(1);
  static readonly Encoding = new CharacterContext(2);
  static readonly EncodedText = new CharacterContext(3);
}

class FieldMeta extends Number {
  static readonly ParamDelimiter = new FieldMeta(1);
  static readonly KeyValueDelimiter = new FieldMeta(2);
}

type FieldComponent = HeaderFieldString | FieldMeta;

interface ParsingRfc2047Result {
  length: number;
  text: string;
}

export interface ParseBodyOptions {
  readonly chunk: Uint8Array | string;
  readonly listDelimiters?: string | undefined;
  readonly paramDelimiters?: string | undefined;
  readonly keyValueDelimiters?: string | undefined;
  readonly strictKeyValuePair?: boolean | undefined;
}

function createDelimiterSet(
  delimiters: string | undefined,
): Set<number> | undefined {
  if (!delimiters) {
    return undefined;
  }
  const ret = new Set<number>();

  for (const ch of delimiters) {
    const char = ch.charCodeAt(0);

    if (char < 0x20 || char > 0x7E) {
      throw TypeError(
        `delimiter should be printable ascii (range from 0x20 to 0x7E)`,
      );
    }
    switch (char) {
      case 0x22:
      case 0x28:
      case 0x29:
      case 0x5C: {
        throw TypeError(
          `character ${String.fromCharCode(char)} cannot be used for delimiter`,
        );
      }
    }
    ret.add(char);
  }
  return ret;
}

function toParamName(
  components: FieldComponent[],
  strict: boolean | undefined,
): string | null {
  if (strict) {
    if (components.length !== 1) {
      return null;
    }
    if (!(components[0] instanceof HeaderFieldRawString)) {
      return null;
    }
    if (!tokenRegex.test(components[0].toString())) {
      return null;
    }
  }
  let ret = ``;
  for (const v of components) {
    if (
      (v instanceof HeaderFieldRawString)
      || (v instanceof HeaderFieldQuotedString)
    ) {
      ret += v.toString();
    }
  }
  return canonParamName(ret);
}

function toParamValue(
  components: FieldComponent[],
  strict: boolean | undefined,
): HeaderFieldString[] | null {
  if (strict) {
    if (components.length > 1) {
      return null;
    }
    if (components.length === 1) {
      const value = components[0];

      if (value instanceof HeaderFieldRawString) {
        if (!tokenOrZeroRegex.test(value.toString())) {
          return null;
        }
      } else if (!(value instanceof HeaderFieldQuotedString)) {
        return null;
      }
    }
  }
  return components as HeaderFieldString[];
}

export function parseBody(options: ParseBodyOptions): HeaderFieldValueList {
  const parsed: FieldComponent[][] = [];
  const chunk = options.chunk;
  const getChar = generateGetChar(chunk);
  const listDelimSet = createDelimiterSet(options.listDelimiters);
  const paramDelimSet = createDelimiterSet(options.paramDelimiters);
  const keyValueDelimSet = createDelimiterSet(options.keyValueDelimiters);
  let context: CharacterContext = CharacterContext.Top;
  let commentNestLevel = 0;
  let store: FieldComponent[] = [];
  let parsedStr = ``;

  function storeParsedString(
    as:
      | typeof HeaderFieldRawString
      | typeof HeaderFieldCommentString
      | typeof HeaderFieldQuotedString,
    renewStore: boolean,
  ): void {
    if (parsedStr.length > 0) {
      if (as === HeaderFieldRawString) {
        if (!spaceRegex.test(parsedStr)) {
          store.push(new as(parsedStr));
        }
      } else {
        store.push(new as(parsedStr));
      }
      parsedStr = ``;
    }
    if (renewStore && store.length > 0) {
      parsed.push(store);
      store = [];
    }
  }
  LOOP:
  for (let i = 0, n = chunk.length; i < n; i++) {
    let char = getChar(chunk, i);

    if (char < 0x20 || char > 0x7E) {
      throw TypeError(
        `character ${String.fromCharCode(char)} cannot be used in header`,
      );
    }
    switch (char) {
      case 0x22: /* " */ {
        switch (context) {
          case CharacterContext.Top: {
            storeParsedString(HeaderFieldRawString, false);
            context = CharacterContext.QuotedString;
            break;
          }
          case CharacterContext.QuotedString: {
            storeParsedString(HeaderFieldQuotedString, false);
            context = CharacterContext.Top;
            break;
          }
          default: {
            parsedStr += `"`;
            break;
          }
        }
        continue LOOP;
      }
      case 0x28: /* ( */ {
        switch (context) {
          case CharacterContext.Top: {
            storeParsedString(HeaderFieldRawString, false);
            context = CharacterContext.Comment;
            commentNestLevel++;
            break;
          }
          case CharacterContext.Comment: {
            commentNestLevel++;
            parsedStr += `(`;
            break;
          }
          default: {
            parsedStr += `(`;
            break;
          }
        }
        continue LOOP;
      }
      case 0x29: /* ) */ {
        switch (context) {
          case CharacterContext.Comment: {
            if (--commentNestLevel === 0) {
              storeParsedString(HeaderFieldCommentString, false);
              context = CharacterContext.Top;
            } else {
              parsedStr += `)`;
            }
            break;
          }
          case CharacterContext.QuotedString: {
            parsedStr += `)`;
            break;
          }
          default: {
            throw TypeError(`unexpected charaster ")" at ${i + 1}`);
          }
        }
        continue LOOP;
      }
      case 0x5C: /* \ */ {
        if (i + 1 < n) {
          char = getChar(chunk, ++i);

          if (char === 0x0D && getChar(chunk, i + 1) === 0x0A) {
            i++;
            char = 0x0A;
          }
          parsedStr += String.fromCharCode(char);
        } else {
          throw TypeError(`unexpected charaster "\\" at ${i + 1}`);
        }
        continue LOOP;
      }
      case 0x3D: /* = */ {
        if (getChar(chunk, i + 1) === 0x3F) { // =?
          const result = parseRfc2047(chunk, i);
          parsedStr += result.text;
          i += result.length;
          continue LOOP;
        }
        break;
      }
    }
    switch (context) {
      case CharacterContext.Top: {
        let isDelimiter = false;

        if (listDelimSet?.has(char)) {
          storeParsedString(HeaderFieldRawString, true);
          isDelimiter = true;
        } else if (paramDelimSet?.has(char)) {
          storeParsedString(HeaderFieldRawString, false);
          store.push(FieldMeta.ParamDelimiter);
          isDelimiter = true;
        } else if (keyValueDelimSet?.has(char)) {
          storeParsedString(HeaderFieldRawString, false);
          store.push(FieldMeta.KeyValueDelimiter);
          isDelimiter = true;
        }
        if (isDelimiter) {
          // oxlint-disable-next-line typescript/no-unnecessary-condition
          while (true) {
            char = getChar(chunk, ++i);

            if (i >= n) {
              break LOOP;
            }
            if (char !== 0x20) {
              i--;
              break;
            }
          }
        } else {
          parsedStr += String.fromCharCode(char);
        }
        break;
      }
      default: {
        parsedStr += String.fromCharCode(char);
        break;
      }
    }
  }
  switch (context) {
    case CharacterContext.Comment: {
      throw TypeError(`there is unclosed comment`);
    }
    case CharacterContext.QuotedString: {
      throw TypeError(`there is unclosed quoted string`);
    }
    default: {
      storeParsedString(HeaderFieldRawString, true);
      break;
    }
  }
  const ret: HeaderFieldValueList = [];

  for (const components of parsed) {
    const values: HeaderFieldValueDelimited = [];
    const delimitedValues: FieldComponent[][] = [];
    let paramComponents: FieldComponent[] = [];

    for (const c of components) {
      if (c === FieldMeta.ParamDelimiter) {
        delimitedValues.push(paramComponents);
        paramComponents = [];
      } else {
        paramComponents.push(c);
      }
    }
    if (paramComponents.length > 0) {
      delimitedValues.push(paramComponents);
    }
    for (const co of delimitedValues) {
      let kvAt = -1;

      for (let i = 0; i < co.length; i++) {
        if (co[i] === FieldMeta.KeyValueDelimiter) {
          if (kvAt !== -1) {
            throw TypeError(`unparsable key-value pair: ${chunk.toString()}`);
          }
          kvAt = i;
        }
      }
      if (kvAt !== -1) {
        const paramName = toParamName(
          co.slice(0, kvAt),
          options.strictKeyValuePair,
        );
        const paramValue = toParamValue(
          co.slice(kvAt + 1),
          options.strictKeyValuePair,
        );

        if (!paramName || !paramValue) {
          throw TypeError(
            `there is unparsable key-value pair: `
              + toLiteralString(co.slice(0, kvAt) as HeaderFieldString[])
              + `=`
              + toLiteralString(co.slice(kvAt + 1) as HeaderFieldString[]),
          );
        }
        values.push(new Map([[paramName, paramValue]]));
      } else {
        values.push(co as HeaderFieldString[]);
      }
    }
    if (values.length > 0) {
      ret.push(values);
    }
  }
  return ret;
}

function parseRfc2047(
  chunk: Uint8Array | string,
  startAt: number,
): ParsingRfc2047Result {
  const getChar = generateGetChar(chunk);
  let context: Rfc2047Context = Rfc2047Context.Charset;
  let str = ``;
  let charset = str;
  let encoding = str;

  LOOP:
  for (let i = startAt + 2, n = chunk.length; i < n; i++) {
    const char = getChar(chunk, i);

    switch (char) {
      case 0x3F: /* ? */ {
        switch (context) {
          case Rfc2047Context.Charset: {
            charset = str;
            str = ``;
            context = Rfc2047Context.Encoding;
            break;
          }
          case Rfc2047Context.Encoding: {
            encoding = str;
            str = ``;
            context = Rfc2047Context.EncodedText;
            break;
          }
          case Rfc2047Context.EncodedText:
            if (getChar(chunk, i + 1) === 0x3D) {
              if (!/^utf-?8$/i.test(charset)) {
                throw TypeError(
                  `character encoding "${charset}" is not supported`,
                );
              }
              switch (encoding) {
                case `b`:
                case `B`: {
                  return {
                    length: i + 1 - startAt,
                    text: new TextDecoder().decode(Uint8Array.fromBase64(str)),
                  };
                }
                default: {
                  throw TypeError(
                    `MIME encoding "${encoding}" is not supported`,
                  );
                }
              }
            }
            break LOOP;
        }
        break;
      }
      default: {
        str += String.fromCharCode(char);
        break;
      }
    }
  }
  throw TypeError(`unparsable encoded text`);
}
