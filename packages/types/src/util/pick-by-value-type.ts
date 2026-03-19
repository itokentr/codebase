// from https://javascript.plainenglish.io/typescript-essentials-conditionally-filter-types-488705bfbf56

export type PickByValueType<T extends object, ValueType> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends never
      ? never
      : T[K] extends ValueType
        ? K
        : never;
  }[keyof T]
>;

export type OmitByValueType<T extends object, ValueType> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends never
      ? never
      : T[K] extends ValueType
        ? never
        : K;
  }[keyof T]
>;
