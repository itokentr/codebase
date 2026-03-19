import {
  ConsoleLogger,
  clearNamespaces,
  deleteNamespaces,
  useNamespaces,
} from '@lib/console';
import * as assert from 'node:assert/strict';
import { test } from 'node:test';

await test('basic namespace', (t) => {
  t.after(() => {
    clearNamespaces();
  });
  useNamespaces('test');
  const avail = new ConsoleLogger({ namespace: 'test' });
  const unavail = new ConsoleLogger({ namespace: 'test2' });
  const msg = 'hello';
  let availMsg: unknown;
  let unavailMsg: unknown;

  avail.addEventListener(
    'log',
    ({ detail: { message } }) => (availMsg = message),
  );
  unavail.addEventListener(
    'log',
    ({ detail: { message } }) => (unavailMsg = message),
  );
  avail.log(msg);
  assert.ok(typeof availMsg === 'string');
  assert.ok(availMsg.endsWith(msg));
  unavail.log(msg);
  assert.ok(typeof unavailMsg === 'undefined');
});

await test('delete namespace', (t) => {
  t.after(() => {
    clearNamespaces();
  });
  useNamespaces('test');
  const avail = new ConsoleLogger({ namespace: 'test' });
  const msg = 'hello';
  let availMsg: unknown;

  avail.addEventListener(
    'log',
    ({ detail: { message } }) => (availMsg = message),
  );
  deleteNamespaces('test');
  avail.log(msg);
  assert.equal(availMsg, msg);
});
