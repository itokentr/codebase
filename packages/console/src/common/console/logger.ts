import type { LoggerOptions } from '../logger.ts';
import { Logger } from '../logger.ts';
import type { InputLog, OutputFormat } from '../types.ts';

export class ConsoleLogger extends Logger<unknown, InputLog<unknown>> {
  override extend(namespace: string): typeof this;
  override extend(options?: LoggerOptions): typeof this;
  override extend(options?: LoggerOptions | string): typeof this {
    return new ConsoleLogger(this.extendOptions(options)) as typeof this;
  }

  protected override createFormatInput(
    message: unknown,
    format: OutputFormat,
    stack: readonly string[] | null,
    params: readonly unknown[],
  ): InputLog<unknown> {
    return {
      format,
      label: this.label,
      message,
      namespace: this.namespace,
      params,
      stack,
    };
  }
}
