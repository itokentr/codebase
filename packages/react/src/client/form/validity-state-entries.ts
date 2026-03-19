export function createValidityStateEntries<
  const T extends Partial<ValidityState>,
>(from: T): IterableIterator<[keyof T, NonNullable<T[keyof T]>]> {
  const {
    badInput,
    customError,
    patternMismatch,
    rangeOverflow,
    rangeUnderflow,
    stepMismatch,
    tooLong,
    tooShort,
    typeMismatch,
    valid,
    valueMissing,
  } = from;
  const validity: Record<keyof ValidityState, boolean | undefined> = {
    badInput,
    customError,
    patternMismatch,
    rangeOverflow,
    rangeUnderflow,
    stepMismatch,
    tooLong,
    tooShort,
    typeMismatch,
    valid,
    valueMissing,
  };
  const iter = new Map<keyof T, NonNullable<T[keyof T]>>();
  for (const [name, value] of Object.entries(validity)) {
    if (value == undefined) {
      continue;
    }
    iter.set(name as keyof T, value as NonNullable<T[keyof T]>);
  }
  return iter.entries();
}
