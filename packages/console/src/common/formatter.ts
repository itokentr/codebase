import { sprintf } from 'sprintf-js';
import type {
  ConsoleCompat,
  ConsoleLike,
  InputLog,
  LogInputEvent,
  LogInputEventTarget,
  LogOutputEventMap,
  LogOutputEventTarget,
  OutputLog,
} from './types.ts';
import { LogOutputEvent, logTypes } from './types.ts';

export abstract class LogFormatter<
  I,
  O,
  P extends readonly unknown[],
  L extends InputLog<I> = InputLog<I>,
> extends EventTarget implements LogOutputEventTarget<O, P> {
  override addEventListener<K extends keyof LogOutputEventMap<O, P>>(
    type: K,
    listener: (
      this: LogOutputEventTarget<O, P>,
      ev: LogOutputEventMap<O, P>[K],
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
    callback: EventListener,
    options?: AddEventListenerOptions | boolean,
  ): void {
    super.addEventListener(type, callback, options);
  }

  inputFrom(
    logger: LogInputEventTarget<I, L>,
    ...loggers: readonly LogInputEventTarget<I, L>[]
  ): Disposable {
    loggers = [logger, ...loggers];

    for (const target of loggers) {
      for (const type of logTypes) {
        target.addEventListener(type, this.#onInput);
      }
    }
    return {
      [Symbol.dispose]: () => {
        for (const target of loggers) {
          for (const type of logTypes) {
            target.removeEventListener(type, this.#onInput);
          }
        }
      },
    };
  }

  outputTo(
    console: ConsoleLike<O>,
    ...consoles: readonly ConsoleLike<O>[]
  ): Disposable {
    consoles = [console, ...consoles];

    function handler(
      this: LogOutputEventTarget<O, P>,
      { detail: { message, outputParams }, type }: LogOutputEvent<O, P>,
    ): void {
      type C = Partial<ConsoleCompat<O>>;
      if (outputParams) {
        for (const target of consoles) {
          (target as C)[type]?.(message, ...outputParams);
        }
      } else {
        for (const target of consoles) {
          (target as C)[type]?.(message);
        }
      }
    }
    for (const type of logTypes) {
      this.addEventListener(type, handler);
    }
    return {
      [Symbol.dispose]: () => {
        for (const type of logTypes) {
          this.removeEventListener(type, handler);
        }
      },
    };
  }

  override removeEventListener<K extends keyof LogOutputEventMap<O, P>>(
    type: K,
    listener: (
      this: LogOutputEventTarget<O, P>,
      ev: LogOutputEventMap<O, P>[K],
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
    callback: EventListener,
    options?: EventListenerOptions | boolean,
  ): void {
    super.removeEventListener(type, callback, options);
  }

  protected sprintf(message: unknown, ...params: readonly unknown[]): string {
    try {
      return sprintf(String(message), ...params);
    } catch {
      return [message, ...params].join(' ');
    }
  }

  readonly #onInput = (event: LogInputEvent<I, L>): void => {
    this.dispatchEvent(
      new LogOutputEvent(event.type, this.format(event.detail)),
    );
  };

  protected abstract format(input: L): OutputLog<O, P>;
}
