import { enabled as loggerEnabled } from './state/enabled.ts';
import { logTypeEnabled } from './state/log-type.ts';
import { matchNamespace } from './state/namespace.ts';
import type {
  ConsoleCompat,
  InputLog,
  LogInputEventMap,
  LogInputEventTarget,
  OutputFormat,
} from './types.ts';
import { LogInputEvent, logTypes } from './types.ts';

export interface LoggerOptions {
  readonly label?: string | undefined;
  readonly namespace?: string | undefined;
  readonly namespaceSeparator?: string | undefined;
}

const kParent: unique symbol = Symbol();
interface LoggerOptionsInternal<
  I,
  L extends InputLog<I>,
> extends LoggerOptions {
  readonly [kParent]?: Logger<I, L> | undefined;
}

export abstract class Logger<
  I,
  L extends InputLog<I>,
> extends EventTarget implements ConsoleCompat<I>, LogInputEventTarget<I, L> {
  protected readonly label: string | null;
  protected readonly namespace: string | null;
  readonly #disabledLogTypes = new Set<OutputFormat>();
  #enabled = true;
  readonly #options: LoggerOptions | null;
  readonly #parent: Logger<I, L> | null;
  readonly #sep: string;

  constructor(options?: LoggerOptions) {
    super();
    type O = LoggerOptionsInternal<I, L> | undefined;
    const parent = (options as O)?.[kParent];

    this.#options = options ?? null;
    this.#parent = parent ?? null;
    this.#sep = options?.namespaceSeparator ?? ':';
    this.label = options?.label ?? null;
    this.namespace = options?.namespace ?? null;
  }

  get enabled(): boolean {
    return this.#isEnabled(true);
  }

  set enabled(value: boolean) {
    this.#enabled = value;
  }

  override addEventListener<K extends keyof LogInputEventMap<I, L>>(
    type: K,
    listener: (
      this: LogInputEventTarget<I, L>,
      ev: LogInputEventMap<I, L>[K],
    ) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  override addEventListener(
    type: never,
    listener: never,
    options?: never,
  ): never;
  override addEventListener(
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions,
  ): void {
    super.addEventListener(type, listener, options);
  }

  debug(message?: I, ...params: unknown[]): void {
    if (this.enabled && this.logTypeEnabled(logTypes.debug)) {
      this.dispatchEvent(
        new LogInputEvent<I, L>(
          'debug',
          this.createFormatInput(message, 'debug', null, params),
        ),
      );
    }
  }

  disableLogType(type: OutputFormat, ...types: readonly OutputFormat[]): void {
    for (const value of [type, ...types]) {
      this.#disabledLogTypes.add(value);
    }
  }

  override dispatchEvent(event: Event): boolean {
    const result = super.dispatchEvent(event);

    if (event instanceof LogInputEvent) {
      this.#parent?.dispatchEvent(event);
    }
    return result;
  }

  enableLogType(type: OutputFormat, ...types: readonly OutputFormat[]): void {
    for (const value of [type, ...types]) {
      this.#disabledLogTypes.delete(value);
    }
  }

  error(message?: I, ...params: unknown[]): void {
    if (this.enabled && this.logTypeEnabled(logTypes.error)) {
      this.dispatchEvent(
        new LogInputEvent<I, L>(
          'error',
          this.createFormatInput(message, 'error', null, params),
        ),
      );
    }
  }

  log(message?: I, ...params: unknown[]): void {
    if (this.enabled && this.logTypeEnabled(logTypes.log)) {
      this.dispatchEvent(
        new LogInputEvent<I, L>(
          'log',
          this.createFormatInput(message, 'log', null, params),
        ),
      );
    }
  }

  override removeEventListener<K extends keyof LogInputEventMap<I, L>>(
    type: K,
    listener: (
      this: LogInputEventTarget<I, L>,
      ev: LogInputEventMap<I, L>[K],
    ) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  override removeEventListener(
    type: never,
    listener: never,
    options?: never,
  ): never;
  override removeEventListener(
    type: string,
    listener: EventListener,
    options?: boolean | EventListenerOptions,
  ): void {
    super.removeEventListener(type, listener, options);
  }

  trace(message?: I, ...params: unknown[]): void {
    if (this.enabled && this.logTypeEnabled(logTypes.trace)) {
      this.dispatchEvent(
        new LogInputEvent<I, L>(
          'trace',
          this.createFormatInput(
            message,
            'trace',
            this.#getStacktrace(1),
            params,
          ),
        ),
      );
    }
  }

  warn(message?: I, ...params: unknown[]): void {
    if (this.enabled && this.logTypeEnabled(logTypes.warn)) {
      this.dispatchEvent(
        new LogInputEvent<I, L>(
          'warn',
          this.createFormatInput(message, 'warn', null, params),
        ),
      );
    }
  }

  protected extendNamespace(namespace: string | undefined): string | undefined {
    return typeof namespace === 'string'
      ? this.namespace
        ? `${this.namespace}${this.#sep}${namespace}`
        : namespace
      : undefined;
  }

  protected extendOptions<T extends LoggerOptions>(options: T | undefined): T;
  protected extendOptions(
    optionsOrNamespace: LoggerOptions | string | undefined,
  ): LoggerOptions;
  protected extendOptions(
    optionsOrNamespace: LoggerOptions | string | undefined,
  ): LoggerOptions {
    let newOptions: LoggerOptionsInternal<I, L>;

    if (typeof optionsOrNamespace === 'string') {
      newOptions = {
        ...this.#options,
        [kParent]: this,
        namespace: this.extendNamespace(optionsOrNamespace),
      };
    } else {
      const { namespace } = optionsOrNamespace ?? {};
      newOptions = {
        ...this.#options,
        ...optionsOrNamespace,
        [kParent]: this,
        namespace: this.extendNamespace(namespace),
      };
    }
    return newOptions;
  }

  protected logTypeEnabled(logType: OutputFormat): boolean {
    if (!this.#parent) {
      return !this.#disabledLogTypes.has(logType) && logTypeEnabled(logType);
    }
    return (
      !this.#disabledLogTypes.has(logType)
      && this.#parent.logTypeEnabled(logType)
    );
  }

  #getStacktrace(offset: number): string[] {
    offset = Math.max(offset, 0);
    const stack = new Error().stack ?? '';
    let actualOffset = offset + 2;

    if (!Number.isSafeInteger(actualOffset)) {
      actualOffset = 2;
    }
    const lines: string[] = [];

    for (const line of stack.split('\n').slice(actualOffset)) {
      lines.push(line.trim());
    }
    return lines;
  }

  #isEnabled(testNamespace: boolean): boolean {
    const matched = testNamespace
      ? this.namespace
        ? matchNamespace(this.namespace)
        : true
      : true;
    if (!this.#parent) {
      return this.#enabled && loggerEnabled() && matched;
    }
    return (
      this.#enabled
      && matched
      // 親の namespace がマッチしてなくても、子の namespace がマッチしていれば
      // 実行可能と見なしたいので、親は namespace の確認をしないようにする。
      && this.#parent.#isEnabled(false)
    );
  }

  abstract extend(namespace: string): typeof this;
  abstract extend(options?: LoggerOptions): typeof this;

  protected abstract createFormatInput(
    message: I | undefined,
    format: OutputFormat,
    stack: readonly string[] | null,
    params: readonly unknown[],
  ): L;
}
