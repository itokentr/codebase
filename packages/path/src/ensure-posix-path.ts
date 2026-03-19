const driveLetterRegex = /^[A-Za-z]:\\/;

/**
 * @see https://github.com/jonschlinkert/normalize-path/blob/20e7fd9f835bbdc4dddd4699a6c06839cc25ed24/index.js
 * @copyright 2018, Jon Schlinkert.
 */
export function ensurePosixPath(
  value: string | URL,
  sep: '/' | '\\',
  stripTrailing: boolean | undefined,
): string {
  if (typeof value !== 'string') {
    if (sep !== '/') {
      throw TypeError(`path separetor "${sep}" is not able to be used for url`);
    }
    if (value.protocol !== 'file:') {
      throw new TypeError('the URL must be of scheme file');
    }
    if (value.hostname !== '') {
      throw new TypeError('file URL host must be empty');
    }
    value = value.pathname;
  }
  if (value === '\\' || value === '/') {
    return '/';
  }
  const len = value.length;

  if (len <= 1) {
    return value;
  }
  let prefix = '';

  if (len > 4 && value[3] === '\\') {
    const ch = value[2];

    if ((ch === '?' || ch === '.') && value.startsWith('\\\\')) {
      value = value.slice(2);
      prefix = '//';
    }
  } else if (driveLetterRegex.test(value)) {
    prefix = '/';
  }
  const sepRegex = new RegExp(`\\${sep}+`);
  const segs = value.split(sepRegex);

  if (stripTrailing && segs[segs.length - 1] === '') {
    segs.pop();
  }
  return `${prefix}${segs.join('/')}`;
}
