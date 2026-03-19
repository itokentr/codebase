import type { Headers, HeadersInit } from '@lib/types/web/fetch';
import type { HeaderFieldParseOptions } from './parser/field.ts';
import { HeaderField } from './parser/field.ts';
import type { HeaderFieldValueList } from './parser/types.ts';
import {
  HeaderFieldCommentString,
  HeaderFieldQuotedString,
  HeaderFieldRawString,
} from './parser/types.ts';
import type { StandardHttpHeaderName } from './standard-header-name.ts';

const parseOptionsDefault: HeaderFieldParseOptions = {
  keyValueDelimiters: `=`,
  listDelimiters: `,`,
  paramDelimiters: [`;`, ` `].join(``),
  strictKeyValuePair: true,
};
const parseOptionsNoop: HeaderFieldParseOptions = {};
const qvalueRegex = /^(?:(?:0(?:\.\d{0,3})?)|(?:1(?:\.0{0,3})?))$/;

export interface HttpHeadersValueWithQuality {
  params: Map<string, string> | null;
  qvalue: number;
  strings: string[] | null;
}

export type HttpHeadersInit =
  | HeadersInit
  | readonly (readonly [string, string])[]
  | readonly (readonly [string, string | readonly string[]])[]
  | Readonly<Record<string, string>>
  | Readonly<Record<string, string | readonly string[]>>;

/**
 * @template K ヘッダのフィールド名
 * @template P ヘッダのパラメータ名
 */
export class HttpHeaders<
  K extends string = string,
  P extends string = string,
> extends Headers {
  constructor(init?: HttpHeadersInit) {
    super();
    if (init) {
      this.append(init);
    }
  }

  get size(): number {
    return Array.from(this.keys()).length;
  }

  override [Symbol.iterator](): IteratorObject<
    [StandardHttpHeaderName | K, string],
    BuiltinIteratorReturn
  > {
    return super[Symbol.iterator]() as IteratorObject<
      [StandardHttpHeaderName | K, string],
      BuiltinIteratorReturn
    >;
  }

  [Symbol.toPrimitive](hint: `default` | `number` | `string`): string | null {
    return hint === `number` ? null : this.toString();
  }

  override append(
    name: StandardHttpHeaderName | K,
    value: string | readonly string[],
  ): void;
  override append(
    headers: HttpHeadersInit,
  ): void;
  override append(
    arg1: StandardHttpHeaderName | K | HttpHeadersInit,
    arg2?: string | readonly string[],
  ): void {
    if (typeof arg1 !== `string`) {
      for (const [name, value] of this.#toIterable(arg1)) {
        this.append(name as K, value);
      }
    } else {
      const name = this.#canonFieldName(arg1);
      const value = arg2 as string | readonly string[];
      const appended: string[] = [];

      if (typeof value === `string`) {
        super.append(name, value);
        appended.push(value);
      } else {
        for (const v of value) {
          super.append(name, v);
          appended.push(v);
        }
      }
    }
  }

  /** `headers` のフィールド名がテンプレート `K` と互換性があるかはチェックされない｡ */
  appendHeaders(headers: HttpHeadersInit): void {
    for (const [key, value] of new HttpHeaders(headers)) {
      this.append(key as K, value);
    }
  }

  clear(): void {
    for (const key of this.keys()) {
      this.delete(key);
    }
  }

  override delete(name: StandardHttpHeaderName | K): void {
    super.delete(name);
  }

  override entries(): IteratorObject<
    [StandardHttpHeaderName | K, string],
    BuiltinIteratorReturn
  > {
    return super.entries() as IteratorObject<
      [StandardHttpHeaderName | K, string],
      BuiltinIteratorReturn
    >;
  }

  override forEach(
    callbackfn: (
      value: string,
      key: StandardHttpHeaderName | K,
      parent: Headers,
    ) => void,
    thisArg?: unknown,
  ): void {
    type F = (value: string, key: string, parent: Headers) => void;
    super.forEach(callbackfn as F, thisArg);
  }

  override get(name: StandardHttpHeaderName | K): string | null {
    // headers.append() で値を追加した場合、headers.get() の戻り値は
    // カンマで区切られた文字列になる｡
    // そのため super.get(name) と #appended.get(name)[0] の値が､
    // 一致するとは限らないことになるので、#appended の値を返さないこと｡
    return super.get(name);
  }

  /**
   * 引用符で括られていたりカンマなどで区切られているフィールドの値を､
   * 解析して扱いやすい形に変換したものを返す｡
   */
  getParsedValue(
    name: StandardHttpHeaderName | K,
    options?: HeaderFieldParseOptions,
  ): HeaderFieldValueList | undefined {
    const value = this.get(name);

    if (value == null) {
      return undefined;
    }
    options ??= this.determineParseOptions(name);
    return HeaderField.parseBody(value, options);
  }

  /** フィールドの値に含まれるパラメータ (key=value) をすべて取得する。*/
  getParams(
    fieldName: StandardHttpHeaderName | K,
    merge: true,
    options?: HeaderFieldParseOptions,
  ): Map<P, string> | undefined;
  /**
   * フィールドの値に含まれるパラメータ (key=value) をすべて取得する｡
   * フィールドの値がカンマなど指定された文字で区切られている場合は､
   * その区切りごとのパラメータを返す｡
   */
  getParams(
    fieldName: StandardHttpHeaderName | K,
    merge: false,
    options?: HeaderFieldParseOptions,
  ): Map<P, string>[] | undefined;
  getParams(
    fieldName: StandardHttpHeaderName | K,
    merge: boolean,
    options?: HeaderFieldParseOptions,
  ): Map<string, string> | Map<string, string>[] | undefined {
    const list = this.getParsedValue(fieldName, options)?.flat(1);
    if (!list) {
      return undefined;
    }
    const params: Map<string, string>[] = [];

    for (const value of list) {
      if (!Array.isArray(value)) {
        const map = new Map<string, string>();

        for (const [k, v] of value.entries()) {
          if (v.length !== 1 || typeof v[0] === 'undefined') {
            throw Error(`unexpected length of param value`);
          }
          map.set(k, v[0].toString());
        }
        if (map.size > 0) {
          params.push(map);
        }
      }
    }
    return merge ? this.#mergeMap(params, false) : params;
  }

  /** フィールドの値に含まれるパラメータ (key=value) すべての値を取得する。*/
  getParamValues(
    fieldName: StandardHttpHeaderName | K,
    paramName: P,
    options?: HeaderFieldParseOptions,
  ): string[] | undefined {
    const params = this.getParams(fieldName, false, options);

    if (!params) {
      return undefined;
    }
    const ret: string[] = [];
    paramName = HeaderField.canonParamName(paramName) as P;

    for (const map of params) {
      const value = map.get(paramName);

      if (typeof value !== `undefined`) {
        ret.push(value);
      }
    }
    return ret;
  }

  /** フィールドの値に含まれる文字列（パラメータやコメントではないもの）を返す｡ */
  getStringValues(
    fieldName: StandardHttpHeaderName | K,
    options?: HeaderFieldParseOptions,
  ): string[] | undefined {
    const list = this.getParsedValue(fieldName, options)?.flat(1);

    if (!list) {
      return undefined;
    }
    const ret: string[] = [];

    for (const value of list) {
      if (Array.isArray(value)) {
        for (const v of value) {
          if (
            (v instanceof HeaderFieldRawString)
            || (v instanceof HeaderFieldQuotedString)
          ) {
            ret.push(v.toString());
          }
        }
      }
    }
    return ret;
  }

  /**
   * クオリティ指定があるフィールドの値 (例：`text/html;q=0.7`) を､
   * クオリティの高い順に並べて返す｡
   */
  getValueWithQuality(
    fieldName: StandardHttpHeaderName | K,
    options?: HeaderFieldParseOptions,
  ): HttpHeadersValueWithQuality[] | undefined {
    const parsed = this.getParsedValue(fieldName, options);

    if (!parsed) {
      return undefined;
    }
    const ret: HttpHeadersValueWithQuality[] = [];

    for (const delimited of parsed) {
      const strs: string[] = [];
      const params = new Map<string, string>();
      let qvalue = 1;

      for (const value of delimited) {
        if (typeof value === `undefined`) {
          throw Error(`unexpected undefined value`);
        }
        if (!Array.isArray(value)) {
          if (value.has(`q`) || value.has(`Q`)) {
            const qv = String((value.get(`q`) ?? value.get(`Q`))?.[0]);

            if (qvalueRegex.test(qv)) {
              qvalue = parseFloat(qv);
            }
          } else {
            for (const [k, v] of value.entries()) {
              if (v.length !== 1 || typeof v[0] === 'undefined') {
                throw Error(`unexpected length of param value`);
              }
              params.set(k, v[0].toString());
            }
          }
        } else {
          for (const v of value) {
            if (!(v instanceof HeaderFieldCommentString)) {
              strs.push(v.toString());
            }
          }
        }
      }
      ret.push({
        params: (params.size === 0) ? null : params,
        qvalue,
        strings: (strs.length === 0) ? null : strs,
      });
    }
    return ret.sort(
      (a, b) => a.qvalue > b.qvalue ? -1 : a.qvalue < b.qvalue ? 1 : 0,
    );
  }

  override has(name: StandardHttpHeaderName | K): boolean;
  override has(name: string): boolean {
    return super.has(name);
  }

  override keys(): IteratorObject<
    StandardHttpHeaderName | K,
    BuiltinIteratorReturn
  > {
    return super.keys() as IteratorObject<
      StandardHttpHeaderName | K,
      BuiltinIteratorReturn
    >;
  }

  override set(
    name: StandardHttpHeaderName | K,
    value: string | readonly string[],
  ): void;
  override set(
    headers: HttpHeadersInit,
  ): void;
  override set(
    arg1: StandardHttpHeaderName | K | HttpHeadersInit,
    arg2?: string | readonly string[],
  ): void {
    if (typeof arg1 !== `string`) {
      for (const [name, value] of this.#toIterable(arg1)) {
        this.set(name as K, value);
      }
    } else {
      const name = arg1;
      const value = arg2 as string | readonly string[];

      if (typeof value == `string`) {
        super.set(name, value);
      } else {
        this.delete(name);
        for (const v of value) {
          this.append(name, v);
        }
      }
    }
  }

  toFieldStrings(): string[] {
    const ret: string[] = [];

    for (const [key, value] of this.toIterableRecord()) {
      if (typeof value === `string`) {
        ret.push(new HeaderField(key, value).toFieldString());
      } else {
        for (const v of value) {
          ret.push(new HeaderField(key, v).toFieldString());
        }
      }
    }
    return ret;
  }

  /** `Object.entries(headers.toRecord())` と、ほぼ同等のものを返す｡ */
  toIterableRecord(): Iterable<
    [StandardHttpHeaderName | K, string | string[]]
  > {
    const iter = new Map<StandardHttpHeaderName | K, string | string[]>();
    for (const [key, value] of this) {
      if (key === `set-cookie`) {
        iter.set(key, this.getSetCookie());
      } else {
        iter.set(key, value);
      }
    }
    return iter;
  }

  /** node の http2 サーバーでの使用に互換性のある値を返す｡ */
  toRawHeaders(): string[] {
    const ret: string[] = [];

    for (const [key, value] of this.toIterableRecord()) {
      if (typeof value === `string`) {
        ret.push(key, value);
      } else {
        for (const v of value) {
          ret.push(key, v);
        }
      }
    }
    return ret;
  }

  /** node の `IncomingHttpHeaders` と互換性のある値を返す｡ */
  toRecord(): Record<StandardHttpHeaderName | K, string | string[]> {
    return Object.fromEntries(this.toIterableRecord()) as Record<
      StandardHttpHeaderName | K,
      string
    >;
  }

  override toString(): string {
    return this.toFieldStrings().join(`\n`);
  }

  protected determineParseOptions(
    fieldName: StandardHttpHeaderName | K,
  ): HeaderFieldParseOptions {
    switch (this.#canonFieldName(fieldName)) {
      case `date`:
      case `expires`:
      case `if-modified-since`:
      case `if-unmodified-since`:
      case `last-modified`:
      case `retry-after`: {
        return parseOptionsNoop;
      }
      case `nel`: {
        return parseOptionsNoop;
      }
      case `sec-websocket-accept`: {
        return parseOptionsNoop;
      }
      case `set-cookie`: {
        return {
          keyValueDelimiters: `=`,
          paramDelimiters: `;`,
          strictKeyValuePair: false,
        };
      }
      case `authorization`:
      case `proxy-authorization`: {
        return { listDelimiters: ` ` };
      }
      case `user-agent`: {
        return { listDelimiters: ` ` };
      }
      default: {
        return parseOptionsDefault;
      }
    }
  }

  #canonFieldName<N extends StandardHttpHeaderName | K>(name: N): N {
    return HeaderField.canonFieldName(name) as N;
  }

  #mergeMap<K, V>(values: Map<K, V>[], overwrite = true): Map<K, V> {
    const ret = new Map<K, V>();

    for (const map of values) {
      for (const [key, value] of map.entries()) {
        if (!overwrite && ret.has(key)) {
          continue;
        }
        ret.set(key, value);
      }
    }
    return ret;
  }

  #toIterable(
    init: HttpHeadersInit,
  ): Iterable<readonly [string, string | readonly string[]]> {
    let iter: Iterable<readonly [string, string | readonly string[]]>;

    if (init instanceof Headers) {
      if (init instanceof HttpHeaders) {
        iter = Object.entries(init.toRecord());
      } else {
        const array: [string, string | readonly string[]][] = [];
        for (const [name, value] of init) {
          if (name === `set-cookie`) {
            array.push([name, init.getSetCookie()]);
          } else {
            array.push([name, value]);
          }
        }
        iter = array;
      }
    } else {
      if (Array.isArray(init)) {
        type T =
          | readonly (readonly [string, string])[]
          | readonly (readonly [string, string | readonly string[]])[];
        iter = init as T;
      } else {
        type T =
          | Readonly<Record<string, string>>
          | Readonly<Record<string, string | readonly string[]>>;
        iter = Object.entries(init as T);
      }
    }
    return iter;
  }
}
