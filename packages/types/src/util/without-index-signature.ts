/**
 * @see https://stackoverflow.com/questions/51465182/how-to-remove-index-signature-using-mapped-types/66252656#66252656
 * @copyright Oleg Valter
 * @copyright T.J. Crowder
 */
export type WithoutIndexSignature<T extends object> = {
  [P in keyof T as string extends P
    ? never
    : number extends P
      ? never
      : symbol extends P
        ? never
        : P]: T[P];
};
