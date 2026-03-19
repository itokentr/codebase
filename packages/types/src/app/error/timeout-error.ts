import { AbortError } from './abort-error.ts';

export class TimeoutError extends AbortError {
  constructor(error?: unknown, name: string = 'TimeoutError') {
    super(error, name);
  }
}
