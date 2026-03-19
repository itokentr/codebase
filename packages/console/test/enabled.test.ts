import {
  ConsoleLogger,
  clearNamespaces,
  enabled,
  useNamespaces,
} from '@lib/console';
import * as assert from 'node:assert/strict';
import { test } from 'node:test';

await test('disabled namespace', (t) => {
  t.after(() => {
    clearNamespaces();
  });
  useNamespaces('test');
  const logger = new ConsoleLogger({ namespace: 'test' });
  const msg = 'hello';
  let received: unknown;

  logger.addEventListener('log', ({ detail: message }) => (received = message));
  logger.enabled = false;
  logger.log(msg);
  assert.notEqual(received, msg);
});

await test('disabled global namespace', (t) => {
  t.after(() => {
    clearNamespaces();
    enabled(true);
  });
  useNamespaces('test');
  const logger = new ConsoleLogger({ namespace: 'test' });
  const msg = 'hello';
  let received: unknown;

  logger.addEventListener(
    'log',
    ({ detail: { message } }) => (received = message),
  );
  enabled(false);
  logger.log(msg);
  assert.notEqual(received, msg);
  assert.equal(enabled(), false);
});

await test('extending', (t) => {
  t.after(() => {
    clearNamespaces();
    enabled(true);
  });
  useNamespaces('test:*');
  const base = new ConsoleLogger({ namespace: 'test' });
  const extended = base.extend('foo');
  const msg = 'hello';
  let baseMsg: unknown;
  let extendedMsg: unknown;

  base.addEventListener(
    'log',
    ({ detail: { message } }) => (baseMsg = message),
  );
  extended.addEventListener(
    'log',
    ({ detail: { message } }) => (extendedMsg = message),
  );
  base.log(msg);
  assert.notEqual(baseMsg, msg);
  extended.log(msg);
  assert.equal(extendedMsg, msg);
});
