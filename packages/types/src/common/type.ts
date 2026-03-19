/* eslint-disable typescript/no-explicit-any */
export type Type<T> = new (...args: any) => T;
export type TypeAbstract<T> = abstract new (...args: any) => T;
export type TypeUnabstract<T extends TypeAbstract<any>> = new (
  ...args: ConstructorParameters<T>
) => InstanceType<T>;
