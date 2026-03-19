import { LogFormatter } from '../formatter.ts';
import type { InputLog, OutputLog } from '../types.ts';
import { formatDuration } from './format-duration.ts';
import { canSetColor, setColor } from './set-color.ts';

export interface FormattedConsoleOutput {
  readonly message: unknown;
  readonly namespace: string;
  readonly label: string;
  readonly output: ConsoleLogFormatterOutput;
  readonly params: readonly unknown[];
  readonly stack: string;
  readonly timestamp: string;
}

export interface ConsoleLogFormatterColors {
  readonly debug?: boolean | number | string | undefined;
  readonly error?: boolean | number | string | undefined;
  readonly label?: boolean | number | string | undefined;
  readonly log?: boolean | number | string | undefined;
  readonly namespace?: boolean | number | string | undefined;
  readonly timestamp?: boolean | number | string | undefined;
  readonly warn?: boolean | number | string | undefined;
}

export interface ConsoleLogFormatterOutput {
  readonly durationTimestamp?: boolean | undefined;
  readonly label?: boolean | undefined;
  readonly namespace?: boolean | undefined;
  readonly timestamp?: boolean | undefined;
}

export interface ConsoleLogFormatterAnalytic {
  readonly colors?: ConsoleLogFormatterColors | boolean | undefined;
  readonly output?: ConsoleLogFormatterOutput | boolean | undefined;
}

export interface ConsoleLogFormatterOptions {
  readonly analytic?: ConsoleLogFormatterAnalytic | boolean | undefined;
  readonly initialTimestamp?: number | undefined;
}

export class ConsoleLogFormatter extends LogFormatter<
  unknown,
  unknown,
  unknown[],
  InputLog<unknown>
> {
  protected readonly options: Readonly<ConsoleLogFormatterOptions> | undefined;
  #timestamp: number;

  constructor(options?: ConsoleLogFormatterOptions) {
    super();
    this.options = options;
    this.#timestamp = options?.initialTimestamp ?? Date.now();
  }

  protected get canSetColor(): boolean {
    return canSetColor;
  }

  protected finalizeOutput(
    { label, message, namespace, output, params, stack, timestamp }:
      FormattedConsoleOutput,
  ): OutputLog<unknown, unknown[]> {
    const outputParams: unknown[] = [];

    if (namespace) {
      outputParams.push(namespace);
    }
    if (label) {
      outputParams.push(label);
    }
    if (timestamp) {
      if (output.durationTimestamp) {
        outputParams.push(timestamp);
      } else {
        outputParams.unshift(timestamp);
      }
    }
    outputParams.push(...params);

    if (stack) {
      outputParams.push(stack);
    }
    return { message, outputParams };
  }

  protected formatDuration(ms: number): string {
    return formatDuration(ms);
  }

  protected formatLabel({ label }: InputLog<unknown>): string {
    return label ?? '';
  }

  protected formatMessage(input: InputLog<unknown>): unknown {
    return input.message;
  }

  protected formatNamespace({ namespace }: InputLog<unknown>): string {
    return namespace ?? '';
  }

  protected formatTimestamp(
    input: InputLog<unknown>,
    timestamp: number,
    previousTimestamp: number,
    asDuration: boolean | undefined,
  ): string {
    if (asDuration) {
      const duration = timestamp - previousTimestamp;
      return `(${this.formatDuration(duration)})`;
    }
    const date = new Date(timestamp);
    const ymd = this.sprintf(
      '%04d-%02d-%02d',
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    );
    const hms = this.sprintf(
      '%02d:%02d:%02d.%03d',
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    );
    return `${ymd}T${hms}`;
  }

  protected override format(
    input: InputLog<unknown>,
  ): OutputLog<unknown, unknown[]> {
    const previousTimestamp = this.#timestamp;
    this.#timestamp = Date.now();
    let analytic = this.options?.analytic ?? {};

    if (typeof analytic === 'boolean') {
      analytic = {
        colors: analytic,
        output: analytic,
      } satisfies Required<ConsoleLogFormatterAnalytic>;
    }
    let output = analytic.output ?? {};

    if (typeof output === 'boolean') {
      output = {
        durationTimestamp: output,
        label: output,
        namespace: output,
        timestamp: output,
      } satisfies Required<ConsoleLogFormatterOutput>;
    }
    let timestamp = output.timestamp
      ? this.formatTimestamp(
        input,
        this.#timestamp,
        previousTimestamp,
        output.durationTimestamp,
      )
      : '';
    let namespace = output.namespace ? this.formatNamespace(input) : '';
    let label = output.label ? this.formatLabel(input) : '';
    let message = this.formatMessage(input);
    let params = input.params;
    let stack = '';
    let colors = analytic.colors ?? {};

    if (typeof colors === 'boolean') {
      colors = {
        debug: colors,
        error: colors,
        label: colors,
        log: colors,
        namespace: colors,
        timestamp: colors,
        warn: colors,
      } satisfies Required<ConsoleLogFormatterColors>;
    }
    if (timestamp) {
      timestamp = this.#setColor(timestamp, colors.timestamp, 'gray');
    }
    if (namespace) {
      namespace = this.#setColor(namespace, colors.namespace, undefined);
    }
    if (label) {
      label = this.#setColor(label, colors.label, undefined);
    }
    if (typeof message === 'string' && message) {
      const msg = params.length > 0
        ? this.sprintf(message, ...params)
        : message;
      params = [];

      switch (input.format) {
        case 'debug': {
          message = this.#setColor(msg, colors.debug, false);
          break;
        }
        case 'error':
        case 'trace': {
          message = this.#setColor(msg, colors.error, 'red');
          break;
        }
        case 'warn': {
          message = this.#setColor(msg, colors.warn, 'yellow');
          break;
        }
        default: {
          message = this.#setColor(msg, colors.log, false);
          break;
        }
      }
    }
    if (input.stack && input.stack.length > 0) {
      stack = `\n    ${input.stack.join('\n    ')}`;
      switch (input.format) {
        case 'debug': {
          stack = this.#setColor(stack, colors.debug, false);
          break;
        }
        case 'error':
        case 'trace': {
          stack = this.#setColor(stack, colors.error, 'red');
          break;
        }
        case 'warn': {
          stack = this.#setColor(stack, colors.warn, 'yellow');
          break;
        }
        default: {
          stack = this.#setColor(stack, colors.log, false);
          break;
        }
      }
    }
    return this.finalizeOutput({
      label,
      message,
      namespace,
      output,
      params,
      stack,
      timestamp,
    });
  }

  /**
   * @param str
   * @param color ansi256, hex or color name
   * @param force
   */
  protected setColor(
    str: string,
    color?: number | string,
    force = true,
  ): string {
    return this.canSetColor || force ? setColor(str, color) : str;
  }

  #setColor(
    str: string,
    color: boolean | number | string | undefined,
    defaultColor: boolean | number | string | undefined,
  ): string {
    if (color === false) {
      return str;
    }
    if (color === true || typeof color === 'undefined') {
      if (defaultColor === false) {
        return str;
      }
      if (defaultColor === true) {
        defaultColor = undefined;
      }
      return this.setColor(str, defaultColor);
    }
    return this.setColor(str, color);
  }
}
