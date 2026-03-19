import { quotemeta } from './quotemeta.ts';

export interface Bracketed {
  readonly closeBracket: RegExpExecArray;
  readonly index: number;
  readonly length: number;
  readonly innerIndex: number;
  readonly innerLength: number;
  readonly innerText: string;
  readonly openBracket: RegExpExecArray;
  readonly text: string;
}

export function getBracketed(
  str: string,
  openBracket: string | RegExp,
  closeBracket: string | RegExp,
  startIndex?: number,
): Bracketed | null;
export function getBracketed(
  str: string,
  bracket: string | RegExp,
  startIndex?: number,
): Bracketed | null;
export function getBracketed(
  str: string,
  openBracket: string | RegExp,
  closeBracketOrStartIndex: string | RegExp | number | undefined,
  startIndex: number = 0,
): Bracketed | null {
  if (str.length === 0) {
    return null;
  }
  let closeBracket: string | RegExp | undefined;

  if (typeof closeBracketOrStartIndex !== 'undefined') {
    if (typeof closeBracketOrStartIndex === 'number') {
      startIndex = closeBracketOrStartIndex;
    } else {
      closeBracket = closeBracketOrStartIndex;
    }
  }
  if (startIndex >= str.length || startIndex < 0) {
    throw new RangeError(
      `startIndex ${startIndex} is out of range (${str.length})`,
    );
  }
  let openRegex: RegExp;
  let closeRegex: RegExp;

  if (openBracket instanceof RegExp) {
    openRegex = new RegExp(
      openBracket.source,
      'g' +
        (openBracket.ignoreCase ? 'i' : '') +
        (openBracket.multiline ? 'm' : ''),
    );
  } else {
    openRegex = new RegExp(quotemeta(openBracket), 'g');
  }
  openRegex.lastIndex = startIndex;

  let openMatch = openRegex.exec(str);
  if (!openMatch) {
    return null;
  }
  if (closeBracket instanceof RegExp) {
    closeRegex = new RegExp(
      closeBracket.source,
      'g' +
        (closeBracket.ignoreCase ? 'i' : '') +
        (closeBracket.multiline ? 'm' : ''),
    );
  } else {
    if (typeof closeBracket === 'undefined') {
      closeBracket = openMatch[0];
    }
    closeRegex = new RegExp(quotemeta(closeBracket), 'g');
  }
  const open1stBeginPos = openMatch.index;
  const open1stEndPos = openRegex.lastIndex;
  let openEndPos = open1stEndPos;
  let openCount = 1;
  let closeBeginPos: number;
  let closeEndPos = openEndPos;
  let closeMatch: RegExpExecArray | null;

  do {
    closeRegex.lastIndex = closeEndPos;
    closeMatch = closeRegex.exec(str);

    if (!closeMatch) {
      return null;
    }
    openCount -= 1;
    closeBeginPos = closeMatch.index;
    closeEndPos = closeRegex.lastIndex;
    let innerText = str.substring(openEndPos, closeMatch.index);

    do {
      openRegex.lastIndex = 0;
      const nestedOpenMatch = openRegex.exec(innerText);
      if (nestedOpenMatch) openMatch = nestedOpenMatch;
      else break;
      openEndPos += openRegex.lastIndex;
      openCount += 1;
      innerText = str.substring(openEndPos, closeMatch.index);
    } while (openMatch.index < closeMatch.index);
  } while (openCount > 0);

  return {
    closeBracket: closeMatch,
    index: open1stBeginPos,
    innerIndex: open1stEndPos,
    innerLength: closeBeginPos - open1stEndPos,
    get innerText() {
      return str.substring(this.innerIndex, this.innerIndex + this.innerLength);
    },
    length: closeEndPos - open1stBeginPos,
    openBracket: openMatch,
    get text() {
      return str.substring(this.index, this.index + this.length);
    },
  };
}

export function* createBracketed(
  str: string,
  openBracket: string | RegExp,
  closeBracket: string | RegExp,
  startIndex?: number,
): Generator<Bracketed> {
  let bracketed = getBracketed(str, openBracket, closeBracket, startIndex);
  while (bracketed) {
    yield bracketed;
    startIndex = bracketed.innerIndex;
    bracketed = getBracketed(str, openBracket, closeBracket, startIndex);
  }
}
