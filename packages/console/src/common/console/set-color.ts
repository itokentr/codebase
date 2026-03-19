import { Chalk, supportsColor, supportsColorStderr } from 'chalk';

const chalk = new Chalk({ level: 2 });

// dprint-ignore-next
const colors = [
  20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68,
  69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134,
  135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171,
  172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204,
  205, 206, 207, 208, 209, 214, 215, 220, 221,
] as const;

/**
 * @see https://github.com/debug-js/debug/blob/b6d12fdbc63b483e5c969da33ea6adc09946b5ac/src/common.js#L41
 */
function determineColor(value: string): number {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % colors.length;
  const ret = colors[index];
  if (typeof ret !== 'number') {
    throw Error(`unexpected undefined color at ${index} for ${value}`);
  }
  return ret;
}

export const canSetColor = supportsColor
  ? supportsColor.hasBasic
  : supportsColorStderr
    ? supportsColorStderr.hasBasic
    : false;

/**
 * @param value
 * @param color ansi256, hex or color name
 * @returns
 */
export function setColor(value: string, color?: number | string): string {
  color ??= determineColor(value);
  return typeof color === 'string'
    ? color.startsWith('#')
      ? chalk.hex(color)(value)
      : chalk[color as 'red'](value)
    : chalk.ansi256(color)(value);
}
