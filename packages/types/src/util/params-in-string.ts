/**
 * @example
 * ```
 * type RouteParams = ParamsInString<'/products/{id}/options/{name}/specs'>;
 * function route({ id, name }: RouteParams) {
 *   // ...
 * }
 * ```
 * @template T
 * @template U
 * @template Open
 * @template Close
 */
export type ParamsInString<
  T extends string,
  U = string,
  Open extends string = '{',
  Close extends string = '}',
> = { readonly [P in ExtractParamNames<T, Open, Close>]: U };

type ParamString<
  Name extends string,
  Open extends string = '{',
  Close extends string = '}',
> = `${Open}${Name}${Close}`;

type ExtractParamNames<
  T extends string,
  Open extends string = '{',
  Close extends string = '}',
> = T extends `${string}${ParamString<infer P1, Open, Close>}${string}${ParamString<infer P2, Open, Close>}${string}${ParamString<infer P3, Open, Close>}${string}${ParamString<infer P4, Open, Close>}${string}${ParamString<infer P5, Open, Close>}${string}`
  ? P1 | P2 | P3 | P4 | P5
  : T extends `${string}${ParamString<infer P1, Open, Close>}${string}${ParamString<infer P2, Open, Close>}${string}${ParamString<infer P3, Open, Close>}${string}${ParamString<infer P4, Open, Close>}${string}`
    ? P1 | P2 | P3 | P4
    : T extends `${string}${ParamString<infer P1, Open, Close>}${string}${ParamString<infer P2, Open, Close>}${string}${ParamString<infer P3, Open, Close>}${string}`
      ? P1 | P2 | P3
      : T extends `${string}${ParamString<infer P1, Open, Close>}${string}${ParamString<infer P2, Open, Close>}${string}`
        ? P1 | P2
        : T extends `${string}${ParamString<infer P1, Open, Close>}${string}`
          ? P1
          : never;
