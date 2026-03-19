import { GeneralError } from './general-error.ts';

export class DisposedError extends GeneralError {
  constructor(message?: string, name: string = 'DisposedError') {
    super(message ?? 'unable to access disposed resource', name);
  }
}
