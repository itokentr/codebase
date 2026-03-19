import * as nodeAssert from 'node:assert/strict';

export const AssertionError = nodeAssert.AssertionError;
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
} = nodeAssert;
export default nodeAssert;
