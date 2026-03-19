import { ConsoleLogger, clearNamespaces, useNamespaces } from '@lib/console';
import * as assert from 'node:assert/strict';
import { test } from 'node:test';

await test('basic stacktrace', (t) => {
  t.after(() => {
    clearNamespaces();
  });
  useNamespaces('test');
  const logger = new ConsoleLogger({ namespace: 'test' });
  const msg = 'hello';
  let received: readonly string[] | null | undefined;

  logger.addEventListener(
    'trace',
    ({ detail: { stack } }) => (received = stack),
  );
  logger.trace(msg); // line 18
  assert.ok(received?.[0]);
  assert.ok(
    received[0].includes(':18:'),
    `no line number included "${received[0]}"`,
  );
});
