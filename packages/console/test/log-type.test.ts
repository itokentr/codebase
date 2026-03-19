import { ConsoleLogger, logTypes } from '@lib/console';
import * as assert from 'node:assert/strict';
import { test } from 'node:test';

await test('log-type debug', () => {
  const logger = new ConsoleLogger();
  const noTypeLogger = new ConsoleLogger();
  const msg = 'hello';
  let received: unknown;
  let noTypeReceived: unknown;

  logger.addEventListener(
    'debug',
    ({ detail: { message } }) => (received = message),
  );
  noTypeLogger.addEventListener(
    'debug',
    ({ detail: { message } }) => (noTypeReceived = message),
  );
  noTypeLogger.disableLogType(logTypes.debug);
  logger.debug(msg);
  noTypeLogger.debug(msg);
  assert.equal(received, msg);
  assert.notEqual(noTypeReceived, msg);
  noTypeLogger.enableLogType(logTypes.debug);
  noTypeLogger.debug(msg);
  assert.equal(noTypeReceived, msg);
});

await test('log-type error', () => {
  const logger = new ConsoleLogger();
  const noTypeLogger = new ConsoleLogger();
  const msg = 'hello';
  let received: unknown;
  let noTypeReceived: unknown;

  logger.addEventListener(
    'error',
    ({ detail: { message } }) => (received = message),
  );
  noTypeLogger.addEventListener(
    'error',
    ({ detail: { message } }) => (noTypeReceived = message),
  );
  noTypeLogger.disableLogType(logTypes.error);
  logger.error(msg);
  noTypeLogger.error(msg);
  assert.equal(received, msg);
  assert.notEqual(noTypeReceived, msg);
  noTypeLogger.enableLogType(logTypes.error);
  noTypeLogger.error(msg);
  assert.equal(noTypeReceived, msg);
});

await test('log-type log', () => {
  const logger = new ConsoleLogger();
  const noTypeLogger = new ConsoleLogger();
  const msg = 'hello';
  let received: unknown;
  let noTypeReceived: unknown;

  logger.addEventListener(
    'log',
    ({ detail: { message } }) => (received = message),
  );
  noTypeLogger.addEventListener(
    'log',
    ({ detail: { message } }) => (noTypeReceived = message),
  );
  noTypeLogger.disableLogType(logTypes.log);
  logger.log(msg);
  noTypeLogger.log(msg);
  assert.equal(received, msg);
  assert.notEqual(noTypeReceived, msg);
  noTypeLogger.enableLogType(logTypes.log);
  noTypeLogger.log(msg);
  assert.equal(noTypeReceived, msg);
});

await test('log-type trace', () => {
  const logger = new ConsoleLogger();
  const noTypeLogger = new ConsoleLogger();
  const msg = 'hello';
  let received: unknown;
  let noTypeReceived: unknown;

  logger.addEventListener(
    'trace',
    ({ detail: { message } }) => (received = message),
  );
  noTypeLogger.addEventListener(
    'trace',
    ({ detail: { message } }) => (noTypeReceived = message),
  );
  noTypeLogger.disableLogType(logTypes.trace);
  logger.trace(msg);
  noTypeLogger.trace(msg);
  assert.ok(typeof received === 'string');
  assert.ok(received.startsWith(msg));
  assert.notEqual(noTypeReceived, msg);
  noTypeLogger.enableLogType(logTypes.trace);
  noTypeLogger.trace(msg);
  assert.ok(typeof noTypeReceived === 'string');
  assert.ok(noTypeReceived.startsWith(msg));
});

await test('log-type warn', () => {
  const logger = new ConsoleLogger();
  const noTypeLogger = new ConsoleLogger();
  const msg = 'hello';
  let received: unknown;
  let noTypeReceived: unknown;

  logger.addEventListener(
    'warn',
    ({ detail: { message } }) => (received = message),
  );
  noTypeLogger.addEventListener(
    'warn',
    ({ detail: { message } }) => (noTypeReceived = message),
  );
  noTypeLogger.disableLogType(logTypes.warn);
  logger.warn(msg);
  noTypeLogger.warn(msg);
  assert.equal(received, msg);
  assert.notEqual(noTypeReceived, msg);
  noTypeLogger.enableLogType(logTypes.warn);
  noTypeLogger.warn(msg);
  assert.equal(noTypeReceived, msg);
});
