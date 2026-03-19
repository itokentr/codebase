import { Writable } from 'node:stream';
import { format, inspect } from 'node:util';
import { ConsoleLogFormatter as Base } from '../common/console/formatter.ts';
import type { ConsoleLike, LogOutputEvent } from '../common/types.ts';
import { logTypes } from '../common/types.ts';

export class ConsoleLogFormatter extends Base {
  inspectColors = true;
  inspectDepth: number | null = null;

  override outputTo(console: ConsoleLike<unknown> | Writable): Disposable {
    if (!(console instanceof Writable)) {
      return super.outputTo(console);
    }
    function handler(
      this: ConsoleLogFormatter,
      { detail: { message, outputParams } }: LogOutputEvent<
        unknown,
        unknown[]
      >,
    ): void {
      this.#output(console as Writable, [message, ...(outputParams ?? [])]);
    }
    for (const type of logTypes) {
      this.addEventListener(type, handler as EventListener);
    }
    return {
      [Symbol.dispose]: () => {
        for (const type of logTypes) {
          this.removeEventListener(type, handler as EventListener);
        }
      },
    };
  }

  #output(to: Writable, values: unknown[]): void {
    if (to.writable) {
      const params: unknown[] = [];

      for (const value of values) {
        if (typeof value === 'object') {
          params.push(
            inspect(value, {
              colors: this.inspectColors,
              depth: this.inspectDepth,
            }),
          );
        } else {
          params.push(value);
        }
      }
      to.write(`${format(...params)}\n`);
    }
  }
}
