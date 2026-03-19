export type PartialDeep<T extends object> = T extends (infer U)[]
  ? U extends object
    ? PartialDeep<U>[]
    : U[]
  : T extends readonly (infer U)[]
    ? U extends object
      ? readonly PartialDeep<U>[]
      : readonly U[]
    : {
        [P in keyof T]?: NonNullable<T[P]> extends (infer U)[]
          ? U extends object
            ? PartialDeep<U>[]
            : U[]
          : NonNullable<T[P]> extends readonly (infer U)[]
            ? U extends object
              ? readonly PartialDeep<U>[]
              : readonly U[]
            : NonNullable<T[P]> extends object
              ? PartialDeep<NonNullable<T[P]>>
              : T[P];
      };

export type PartialNullable<T extends object> = T extends (infer U)[]
  ? U extends object
    ? PartialNullable<U>[]
    : U[]
  : T extends readonly (infer U)[]
    ? U extends object
      ? readonly PartialNullable<U>[]
      : readonly U[]
    : {
        [P in keyof T]?:
          | (NonNullable<T[P]> extends (infer U)[]
              ? U extends object
                ? PartialNullable<U>[]
                : U[]
              : NonNullable<T[P]> extends readonly (infer U)[]
                ? U extends object
                  ? readonly PartialNullable<U>[]
                  : readonly U[]
                : NonNullable<T[P]> extends object
                  ? PartialNullable<NonNullable<T[P]>>
                  : T[P])
          | null;
      };

export type PartialUndefinedable<T extends object> = T extends (infer U)[]
  ? U extends object
    ? PartialUndefinedable<U>[]
    : U[]
  : T extends readonly (infer U)[]
    ? U extends object
      ? readonly PartialUndefinedable<U>[]
      : readonly U[]
    : {
        [P in keyof T]?:
          | (NonNullable<T[P]> extends (infer U)[]
              ? U extends object
                ? PartialUndefinedable<U>[]
                : U[]
              : NonNullable<T[P]> extends readonly (infer U)[]
                ? U extends object
                  ? readonly PartialUndefinedable<U>[]
                  : readonly U[]
                : NonNullable<T[P]> extends object
                  ? PartialUndefinedable<NonNullable<T[P]>>
                  : T[P])
          | undefined;
      };

export type PartialNullishUndefinedable<T extends object> =
  T extends (infer U)[]
    ? U extends object
      ? PartialNullishUndefinedable<U>[]
      : U[]
    : T extends readonly (infer U)[]
      ? U extends object
        ? readonly PartialNullishUndefinedable<U>[]
        : readonly U[]
      : {
          [P in keyof T]?:
            | (NonNullable<T[P]> extends (infer U)[]
                ? U extends object
                  ? PartialNullishUndefinedable<U>[]
                  : U[]
                : NonNullable<T[P]> extends readonly (infer U)[]
                  ? U extends object
                    ? readonly PartialNullishUndefinedable<U>[]
                    : readonly U[]
                  : NonNullable<T[P]> extends object
                    ? PartialNullishUndefinedable<NonNullable<T[P]>>
                    : T[P])
            | null
            | undefined;
        };
