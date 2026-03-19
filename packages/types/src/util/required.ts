export type RequiredDeep<T extends object> = T extends (infer U)[]
  ? U extends object
    ? RequiredDeep<U>[]
    : U[]
  : T extends readonly (infer U)[]
    ? U extends object
      ? readonly RequiredDeep<U>[]
      : readonly U[]
    : {
        [P in keyof T]-?: NonNullable<T[P]> extends (infer U)[]
          ? U extends object
            ? RequiredDeep<U>[]
            : U[]
          : NonNullable<T[P]> extends readonly (infer U)[]
            ? U extends object
              ? readonly RequiredDeep<U>[]
              : readonly U[]
            : NonNullable<T[P]> extends object
              ? RequiredDeep<NonNullable<T[P]>>
              : T[P];
      };

export type RequiredNullable<T extends object> = T extends (infer U)[]
  ? U extends object
    ? RequiredNullable<U>[]
    : U[]
  : T extends readonly (infer U)[]
    ? U extends object
      ? readonly RequiredNullable<U>[]
      : readonly U[]
    : {
        [P in keyof T]-?:
          | (NonNullable<T[P]> extends (infer U)[]
              ? U extends object
                ? RequiredNullable<U>[]
                : U[]
              : NonNullable<T[P]> extends readonly (infer U)[]
                ? U extends object
                  ? readonly RequiredNullable<U>[]
                  : readonly U[]
                : NonNullable<T[P]> extends object
                  ? RequiredNullable<NonNullable<T[P]>>
                  : T[P])
          | null;
      };

export type RequiredUndefinedable<T extends object> = T extends (infer U)[]
  ? U extends object
    ? RequiredUndefinedable<U>[]
    : U[]
  : T extends readonly (infer U)[]
    ? U extends object
      ? readonly RequiredUndefinedable<U>[]
      : readonly U[]
    : {
        [P in keyof T]-?:
          | (NonNullable<T[P]> extends (infer U)[]
              ? U extends object
                ? RequiredUndefinedable<U>[]
                : U[]
              : NonNullable<T[P]> extends readonly (infer U)[]
                ? U extends object
                  ? readonly RequiredUndefinedable<U>[]
                  : readonly U[]
                : NonNullable<T[P]> extends object
                  ? RequiredUndefinedable<NonNullable<T[P]>>
                  : T[P])
          | undefined;
      };

export type RequiredNullishUndefinedable<T extends object> =
  T extends (infer U)[]
    ? U extends object
      ? RequiredNullishUndefinedable<U>[]
      : U[]
    : T extends readonly (infer U)[]
      ? U extends object
        ? readonly RequiredNullishUndefinedable<U>[]
        : readonly U[]
      : {
          [P in keyof T]-?:
            | (NonNullable<T[P]> extends (infer U)[]
                ? U extends object
                  ? RequiredNullishUndefinedable<U>[]
                  : U[]
                : NonNullable<T[P]> extends readonly (infer U)[]
                  ? U extends object
                    ? readonly RequiredNullishUndefinedable<U>[]
                    : readonly U[]
                  : NonNullable<T[P]> extends object
                    ? RequiredNullishUndefinedable<NonNullable<T[P]>>
                    : T[P])
            | null
            | undefined;
        };
