import {
  ConsoleLogger,
  clearNamespaces,
  logTypes,
  useNamespaces,
} from '@lib/console';
import * as assert from 'node:assert/strict';
import { test } from 'node:test';

await test('extend namespace', (t) => {
  t.after(() => {
    clearNamespaces();
  });
  useNamespaces('test,test:foo');
  const base = new ConsoleLogger({ namespace: 'test' });
  const extended = base.extend({ namespace: 'foo' });
  const unavail = base.extend({ namespace: 'bar' });
  const msg = 'hello';
  let baseMsg: unknown;
  let extendedMsg: unknown;
  let unavailMsg: unknown;

  base.addEventListener(
    'log',
    ({ detail: { message } }) => (baseMsg = message),
  );
  extended.addEventListener(
    'log',
    ({ detail: { message } }) => (extendedMsg = message),
  );
  unavail.addEventListener(
    'log',
    ({ detail: { message } }) => (unavailMsg = message),
  );

  base.log(msg);
  assert.equal(baseMsg, msg);

  extended.log(msg);
  assert.equal(extendedMsg, msg);

  unavail.log(msg);
  assert.notEqual(unavailMsg, msg);
});

await test('extend no namespace', (t) => {
  t.after(() => {
    clearNamespaces();
  });
  useNamespaces('test');
  const base = new ConsoleLogger();
  const extended = base.extend();
  const msg = 'hello';
  let baseMsg: unknown;
  let extendedMsg: unknown;

  base.addEventListener(
    'log',
    ({ detail: { message } }) => (baseMsg = message),
  );
  base.log(msg);
  assert.equal(baseMsg, msg);

  extended.addEventListener(
    'log',
    ({ detail: { message } }) => (extendedMsg = message),
  );
  extended.log(msg);
  assert.equal(extendedMsg, msg);
});

await test('extend messages', () => {
  const base = new ConsoleLogger();
  const extended = base.extend();
  const extended2 = extended.extend();
  let baseMsg: unknown;
  let extendedMsg: unknown;
  let extended2Msg: unknown;

  base.addEventListener(
    'log',
    ({ detail: { message } }) => (baseMsg = message),
  );
  extended.addEventListener(
    'log',
    ({ detail: { message } }) => (extendedMsg = message),
  );
  extended2.addEventListener(
    'log',
    ({ detail: { message } }) => (extended2Msg = message),
  );

  base.log('base');
  assert.equal(baseMsg, 'base');
  assert.equal(extendedMsg, undefined);
  assert.equal(extended2Msg, undefined);

  extended.log('extended');
  assert.equal(baseMsg, 'extended');
  assert.equal(extendedMsg, 'extended');
  assert.equal(extended2Msg, undefined);

  extended2.log('extended2');
  assert.equal(baseMsg, 'extended2');
  assert.equal(extendedMsg, 'extended2');
  assert.equal(extended2Msg, 'extended2');

  base.log('base');
  assert.equal(baseMsg, 'base');
  assert.equal(extendedMsg, 'extended2');
  assert.equal(extended2Msg, 'extended2');
});

await test('derive enabled status', () => {
  const base = new ConsoleLogger();
  const extended = base.extend();
  const descendant = extended.extend();
  const msg = 'hello';
  let baseMsg: unknown;
  let extendedMsg: unknown;
  let descendantMsg: unknown;

  base.addEventListener(
    'log',
    ({ detail: { message } }) => (baseMsg = message),
  );
  extended.addEventListener(
    'log',
    ({ detail: { message } }) => (extendedMsg = message),
  );
  descendant.addEventListener(
    'log',
    ({ detail: { message } }) => (descendantMsg = message),
  );

  base.enabled = false;
  base.log(msg);
  assert.notEqual(baseMsg, msg);

  extended.log(msg);
  assert.notEqual(extendedMsg, msg);

  descendant.log(msg);
  assert.notEqual(descendantMsg, msg);

  base.enabled = true;
  baseMsg = undefined;
  base.log(msg);
  assert.equal(baseMsg, msg);

  extendedMsg = undefined;
  extended.log(msg);
  assert.equal(extendedMsg, msg);

  descendantMsg = undefined;
  descendant.log(msg);
  assert.equal(descendantMsg, msg);

  extended.enabled = false;
  baseMsg = undefined;
  base.log(msg);
  assert.equal(baseMsg, msg);

  extendedMsg = undefined;
  extended.log(msg);
  assert.notEqual(extendedMsg, msg);

  descendantMsg = undefined;
  descendant.log(msg);
  assert.notEqual(descendantMsg, msg);
});

await test('derive log-type status', () => {
  const base = new ConsoleLogger();
  const extended = base.extend();
  const descendant = extended.extend();
  const msg = 'hello';
  let baseMsg: unknown;
  let extendedMsg: unknown;
  let descendantMsg: unknown;

  base.addEventListener(
    'log',
    ({ detail: { message } }) => (baseMsg = message),
  );
  extended.addEventListener(
    'log',
    ({ detail: { message } }) => (extendedMsg = message),
  );
  descendant.addEventListener(
    'log',
    ({ detail: { message } }) => (descendantMsg = message),
  );

  base.disableLogType(logTypes.log);
  base.log(msg);
  assert.notEqual(baseMsg, msg);

  extended.log(msg);
  assert.notEqual(extendedMsg, msg);

  descendant.log(msg);
  assert.notEqual(descendantMsg, msg);

  base.enableLogType(logTypes.log);
  baseMsg = undefined;
  base.log(msg);
  assert.equal(baseMsg, msg);

  extendedMsg = undefined;
  extended.log(msg);
  assert.equal(extendedMsg, msg);

  descendantMsg = undefined;
  descendant.log(msg);
  assert.equal(descendantMsg, msg);

  extended.disableLogType(logTypes.log);
  baseMsg = undefined;
  base.log(msg);
  assert.equal(baseMsg, msg);

  extendedMsg = undefined;
  extended.log(msg);
  assert.notEqual(extendedMsg, msg);

  descendantMsg = undefined;
  descendant.log(msg);
  assert.notEqual(descendantMsg, msg);
});
