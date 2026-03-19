export type LooseObject<T extends object> = T extends (infer U)[]
  ? U extends object
    ? LooseObject<U>[]
    : U[]
  : T extends readonly (infer U)[]
    ? U extends object
      ? readonly LooseObject<U>[]
      : readonly U[]
    : {
        [P in keyof T]?:
          | (NonNullable<T[P]> extends (infer U)[]
              ? U extends object
                ? LooseObject<U>[]
                : U[]
              : NonNullable<T[P]> extends readonly (infer U)[]
                ? U extends object
                  ? readonly LooseObject<U>[]
                  : readonly U[]
                : NonNullable<T[P]> extends object
                  ? LooseObject<NonNullable<T[P]>>
                  : T[P])
          | null
          | undefined;
      };
