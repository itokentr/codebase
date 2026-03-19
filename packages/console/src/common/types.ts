// #region console interfaces

export interface ConsoleClear {
  clear(): void;
}

export interface ConsoleDebug<I> {
  debug(message?: I, ...params: unknown[]): void;
}

export interface ConsoleError<I> {
  error(message?: I, ...params: unknown[]): void;
}

export interface ConsoleLog<I> {
  log(message?: I, ...params: unknown[]): void;
}

export interface ConsoleTrace<I> {
  trace(message?: I, ...params: unknown[]): void;
}

export interface ConsoleWarn<I> {
  warn(message?: I, ...params: unknown[]): void;
}

export type ConsoleCompat<I> =
  & ConsoleDebug<I>
  & ConsoleError<I>
  & ConsoleLog<I>
  & ConsoleTrace<I>
  & ConsoleWarn<I>;

export type ConsoleLike<I> =
  | ConsoleDebug<I>
  | ConsoleError<I>
  | ConsoleLog<I>
  | ConsoleTrace<I>
  | ConsoleWarn<I>;

// #endregion

export type OutputFormat = Exclude<keyof ConsoleCompat<any>, 'clear'>;

export interface LogType {
  readonly debug: OutputFormat;
  readonly error: OutputFormat;
  readonly log: OutputFormat;
  readonly trace: OutputFormat;
  readonly warn: OutputFormat;
}

export type LogTypes = ReadonlyArray<OutputFormat> & LogType;

export const logTypes: LogTypes = Object.assign<
  ReadonlyArray<OutputFormat>,
  LogType
>(
  ['debug', 'error', 'log', 'trace', 'warn'],
  {
    debug: 'debug',
    error: 'error',
    log: 'log',
    trace: 'trace',
    warn: 'warn',
  },
);

// #region user input log

export interface InputLog<I> {
  readonly format: OutputFormat;
  readonly label: string | null;
  readonly message: I | undefined;
  readonly namespace: string | null;
  readonly params: readonly unknown[];
  readonly stack: readonly string[] | null;
}

export class LogInputEvent<I, L extends InputLog<I>> extends CustomEvent<L> {
  declare readonly currentTarget: LogInputEventTarget<I, L>;
  declare readonly target: LogInputEventTarget<I, L>;
  declare readonly type: keyof LogInputEventMap<I, L>;

  constructor(type: keyof LogInputEventMap<I, L>, log: L) {
    super(type, { detail: log });
  }
}

export type LogInputEventMap<I, L extends InputLog<I>> = {
  [K in OutputFormat]: LogInputEvent<I, L>;
};

export interface LogInputEventTarget<I, L extends InputLog<I>>
  extends EventTarget {
  addEventListener<K extends keyof LogInputEventMap<I, L>>(
    type: K,
    listener: (
      this: LogInputEventTarget<I, L>,
      ev: LogInputEventMap<I, L>[K],
    ) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(type: never, listener: never, options?: never): never;
  removeEventListener<K extends keyof LogInputEventMap<I, L>>(
    type: K,
    listener: (
      this: LogInputEventTarget<I, L>,
      ev: LogInputEventMap<I, L>[K],
    ) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(type: never, listener: never, options?: never): never;
}

// #endregion
// #region formatted log (suited for output)

export interface OutputLog<O, P extends readonly unknown[]> {
  readonly message: O;
  readonly outputParams?: P | null;
}

export class LogOutputEvent<O, P extends readonly unknown[]>
  extends CustomEvent<OutputLog<O, P>> {
  declare readonly currentTarget: LogOutputEventTarget<O, P>;
  declare readonly target: LogOutputEventTarget<O, P>;
  declare readonly type: keyof LogOutputEventMap<O, P>;

  constructor(
    type: keyof LogOutputEventMap<O, P>,
    formatted: OutputLog<O, P>,
  ) {
    super(type, { detail: formatted });
  }
}

export type LogOutputEventMap<O, P extends readonly unknown[]> = {
  [K in OutputFormat]: LogOutputEvent<O, P>;
};

/** implemented by a formatter. */
export interface LogOutputEventTarget<O, P extends readonly unknown[]>
  extends EventTarget {
  addEventListener<K extends keyof LogOutputEventMap<O, P>>(
    type: K,
    listener: (
      this: LogOutputEventTarget<O, P>,
      ev: LogOutputEventMap<O, P>[K],
    ) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(type: never, listener: never, options?: never): never;
  removeEventListener<K extends keyof LogOutputEventMap<O, P>>(
    type: K,
    listener: (
      this: LogOutputEventTarget<O, P>,
      ev: LogOutputEventMap<O, P>[K],
    ) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(type: never, listener: never, options?: never): never;
}

// #endregion
