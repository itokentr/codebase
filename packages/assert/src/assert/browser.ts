import { assert as chai } from 'chai';
import type { AssertModule } from './types.ts';

const assert: AssertModule = chai as unknown as AssertModule;

function ensureMessage(
  message: string | RegExp | Error | null | undefined,
): string | undefined {
  switch (typeof message) {
    case 'string':
    case 'undefined': {
      return message;
    }
    default: {
      return String(message);
    }
  }
}

async function rejectsFn(
  block: (() => Promise<unknown>) | Promise<unknown>,
  message: string | Error | undefined,
  not: boolean,
): Promise<void> {
  const promise = typeof block === 'function' ? block() : block;
  let thrown = false;
  try {
    await promise;
  } catch {
    thrown = true;
  }
  if (thrown) {
    if (!not) {
      chai.fail(ensureMessage(message));
    }
  } else if (not) {
    chai.fail(ensureMessage(message));
  }
}

assert.deepEqual = (actual, expected, message) => {
  chai.deepStrictEqual(actual, expected, ensureMessage(message));
};
assert.doesNotMatch = (value, regExp, message) => {
  chai.notMatch(value, regExp, ensureMessage(message));
};
assert.doesNotReject = async (block, message) => {
  return rejectsFn(block, message, true);
};
assert.doesNotThrow = (block, message) => {
  chai.doesNotThrow(block, null, null, ensureMessage(message));
};
assert.equal = (actual, expected, message) => {
  chai.strictEqual(actual, expected, ensureMessage(message));
};
assert.fail = (message) => {
  chai.fail(message as string);
};
assert.ifError = (value) => {
  chai.ifError(value);
};
assert.match = (value, regExp, message) => {
  chai.match(value, regExp, ensureMessage(message));
};
assert.notDeepEqual = (actual, expected, message) => {
  chai.notDeepEqual(actual, expected, ensureMessage(message));
};
assert.notEqual = (actual, expected, message) => {
  chai.notStrictEqual(actual, expected, ensureMessage(message));
};
assert.ok = (value, message) => {
  chai.ok(value, ensureMessage(message));
};
assert.rejects = async (block, message) => {
  return rejectsFn(block, message, false);
};
assert.throws = (block, message) => {
  chai.throws(block, undefined, undefined, ensureMessage(message));
};

export { AssertionError } from 'chai';
export const {
  deepEqual,
  doesNotMatch,
  doesNotReject,
  doesNotThrow,
  equal,
  fail,
  ifError,
  match,
  notDeepEqual,
  notEqual,
  ok,
  rejects,
  throws,
} = assert;
export default assert;
