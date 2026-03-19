const nonWordChars = /(\W)/g;

export function quotemeta(str: string): string {
  nonWordChars.lastIndex = 0;
  return str.replace(nonWordChars, '\\$1');
}
