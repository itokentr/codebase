import { ConsoleLogger, clearNamespaces, useNamespaces } from '@lib/console';
import * as assert from 'node:assert/strict';
import { test } from 'node:test';

await test('no namespace', (t) => {
  t.after(() => {
    clearNamespaces();
  });
  useNamespaces('test');
  const logger = new ConsoleLogger();
  const msg = 'hello';
  let received: unknown;

  logger.addEventListener(
    'log',
    ({ detail: { message } }) => (received = message),
  );
  logger.log(msg);
  assert.ok(typeof received === 'string');
  assert.ok(received.endsWith(msg));
});
