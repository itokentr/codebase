import { GeneralError } from './general-error.ts';

export class AbortError extends GeneralError {
  constructor(error?: unknown, name: string = 'AbortError') {
    super(error, name);
  }
}
