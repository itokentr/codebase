import { parse } from 'ansicolor';
import type { FormattedConsoleOutput } from '../common/console/formatter.ts';
import { ConsoleLogFormatter as Base } from '../common/console/formatter.ts';
import type { OutputLog } from '../common/types.ts';

export class ConsoleLogFormatter extends Base {
  protected override finalizeOutput(
    { label, message, namespace, output, params, stack, timestamp }:
      FormattedConsoleOutput,
  ): OutputLog<unknown, unknown[]> {
    let prefix: string | undefined;
    const sufix: unknown[] = [];
    let chunks: string[] | undefined;

    if (namespace) {
      chunks ??= [];
      chunks.push(namespace);
    }
    if (label) {
      chunks ??= [];
      chunks.push(label);
    }
    if (timestamp) {
      chunks ??= [];
      if (output.durationTimestamp) {
        chunks.push(timestamp);
      } else {
        chunks.unshift(timestamp);
      }
    }
    if (typeof message === 'string') {
      chunks ??= [];
      chunks.push(message);
    }
    if (chunks) {
      for (let i = 0; i < chunks.length; i++) {
        // oxlint-disable-next-line typescript/no-non-null-assertion
        const parsed = parse(chunks[i]!);
        // oxlint-disable-next-line typescript/no-non-null-assertion
        chunks[i] = parsed.asChromeConsoleLogArguments[0]!;
        if (i > 0) {
          // join の結合子用
          sufix.push('');
        }
        sufix.push(...parsed.asChromeConsoleLogArguments.slice(1));
      }
      prefix = chunks.join('%c ');
    }
    if (typeof message !== 'string') {
      sufix.push(message);
    }
    sufix.push(...params);

    if (stack) {
      sufix.push(stack);
    }
    return {
      message,
      outputParams: typeof prefix === 'string' ? [prefix, ...sufix] : sufix,
    };
  }
}
