import { GeneralError } from '../error/general-error.ts';
import type { TypedFormData, TypedFormDataMap } from './form-data.ts';

export type FormValidationErrors<
  T extends TypedFormDataMap | TypedFormData<any>,
> = T extends TypedFormData<infer U>
  ? { readonly [K in keyof U]?: readonly string[] }
  : { readonly [K in keyof T]?: readonly string[] };

export class FormValidationError<
  T extends TypedFormDataMap,
> extends GeneralError {
  readonly errors: FormValidationErrors<T>;

  constructor(
    errors: FormValidationErrors<T>,
    message?: string,
    name: string = 'FormValidationError',
  ) {
    super(message ?? 'validation errors', name);
    this.errors = errors;
  }
}
