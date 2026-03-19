import type { Blob, File } from '../../web/blob.ts';
import type { FormData, FormDataIterator } from '../../web/form.ts';

export type FormControlValue =
  | string
  | Blob
  | readonly string[]
  | readonly Blob[];

export type FormControlStringValue = string | readonly string[];
export type ToStringValue<V extends FormControlValue> = V extends
  readonly unknown[] ? readonly string[] : string;

export interface TypedFormDataMap {
  readonly [name: string]: FormControlValue;
}

export type ToTypedFormDataMap<T extends object> = {
  readonly [K in keyof T]: T[K] extends FormControlValue ? T[K] : never;
};

type GetArrayValue<T extends FormControlValue> = T extends readonly (infer U)[]
  ? U extends Blob ? File
  : U
  : (T extends Blob ? File : T)[];

type GetValue<T extends FormControlValue> = T extends readonly (infer U)[]
  ? U extends Blob ? File
  : U
  : T extends Blob ? File
  : T;

type SetValue<T extends FormControlValue> = T extends readonly (infer U)[] ? U
  : T;

export interface TypedFormData<T extends TypedFormDataMap> extends FormData {
  append<K extends keyof T>(
    name: K,
    value: SetValue<T[K]>,
    filename?: SetValue<T[K]> extends Blob ? string : never,
  ): void;
  append(name: never, value: never, filename?: never): never;
  delete(name: keyof T): void;
  delete(name: never): never;
  get<K extends keyof T>(name: K): GetValue<T[K]>;
  get(name: never): never;
  getAll<K extends keyof T>(name: K): GetArrayValue<T[K]>[];
  getAll(name: never): never;
  has(name: keyof T): boolean;
  has(name: never): never;
  set<K extends keyof T>(
    name: K,
    value: SetValue<T[K]>,
    filename?: SetValue<T[K]> extends Blob ? string : never,
  ): void;
  set(name: never, value: never, filename?: never): never;
  forEach(
    callbackfn: <K extends keyof T>(
      value: K,
      key: GetValue<T[K]>,
      parent: TypedFormData<T>,
    ) => void,
    thisArg?: any,
  ): void;
  forEach(callbackfn: never, thisArg?: never): never;
  [Symbol.iterator](): FormDataIterator<[keyof T, T[keyof T]]>;
  [Symbol.iterator](): never;
  entries(): FormDataIterator<[keyof T, T[keyof T]]>;
  entries(): never;
  keys(): FormDataIterator<keyof T>;
  keys(): never;
  values(): FormDataIterator<T[keyof T]>;
  values(): never;
}

export type ReadonlyTypedFormData<T extends TypedFormDataMap> = Omit<
  TypedFormData<T>,
  'append' | 'delete' | 'set'
>;
