import { GeneralError } from './general-error.ts';

export class UnexpectedError extends GeneralError {
  constructor(error?: unknown, name: string = 'UnexpectedError') {
    super(error, name);
  }
}

export function expectDefined<const T>(
  value: T | undefined,
  message?: string,
): asserts value is T {
  if (typeof value === 'undefined') {
    throw new UnexpectedError(message ?? 'unexpected undefined value');
  }
}

export function expectNonNullable<const T>(
  value: T,
  message?: string,
): asserts value is NonNullable<T> {
  if (value == null) {
    throw new UnexpectedError(message ?? 'unexpected nullable value');
  }
}
