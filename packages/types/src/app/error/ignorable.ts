import { GeneralError } from './general-error.ts';

/**
 * 致命的ではなく無視することが可能なエラーを表す際に使用する｡
 * 処理の流れとしてエラーをスローする必要があるが､
 * エラーを捕捉する側はこのエラーを無視してもいい場合など｡
 */
export class IgnorableError extends GeneralError {
  constructor(message?: string, name: string = 'IgnorableError') {
    super(message ?? 'the error has occurred but can be ignored', name);
  }
}
