export type ArrayItem<T extends readonly unknown[]> =
  T extends readonly (infer U)[] ? U : never;
