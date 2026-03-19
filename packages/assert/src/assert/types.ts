/* eslint-disable typescript/no-invalid-void-type */
export interface AssertModule {
  (this: void, value: unknown, message?: string | Error): asserts value;
  deepEqual(
    this: void,
    actual: unknown,
    expected: unknown,
    message?: string | Error,
  ): void;
  doesNotMatch(
    this: void,
    value: string,
    regExp: RegExp,
    message?: string | Error,
  ): void;
  doesNotReject(
    this: void,
    block: (() => Promise<unknown>) | Promise<unknown>,
    message?: string | Error,
  ): Promise<void>;
  doesNotThrow(
    this: void,
    block: () => unknown,
    message?: string | Error,
  ): void;
  equal<T>(
    this: void,
    actual: unknown,
    expected: T,
    message?: string | Error,
  ): asserts actual is T;
  fail(this: void, message?: string | Error): never;
  ifError(this: void, value: unknown): asserts value is null | undefined;
  match(
    this: void,
    value: string,
    regExp: RegExp,
    message?: string | Error,
  ): void;
  notDeepEqual(
    this: void,
    actual: unknown,
    expected: unknown,
    message?: string | Error,
  ): void;
  notEqual(
    this: void,
    actual: unknown,
    expected: unknown,
    message?: string | Error,
  ): void;
  ok(this: void, value: unknown, message?: string | Error): asserts value;
  rejects(
    this: void,
    block: (() => Promise<unknown>) | Promise<unknown>,
    message?: string | Error,
  ): Promise<void>;
  throws(this: void, block: () => unknown, message?: string | Error): void;
}

export class AssertionError extends Error {}
export declare const deepEqual: AssertModule['deepEqual'];
export declare const doesNotMatch: AssertModule['doesNotMatch'];
export declare const doesNotReject: AssertModule['doesNotReject'];
export declare const doesNotThrow: AssertModule['doesNotThrow'];
export declare const equal: AssertModule['equal'];
export declare const fail: AssertModule['fail'];
export declare const ifError: AssertModule['ifError'];
export declare const match: AssertModule['match'];
export declare const notDeepEqual: AssertModule['notDeepEqual'];
export declare const notEqual: AssertModule['notEqual'];
export declare const ok: AssertModule['ok'];
export declare const rejects: AssertModule['rejects'];
export declare const throws: AssertModule['throws'];
declare const assert: AssertModule;
export default assert;
