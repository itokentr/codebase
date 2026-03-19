// oxlint-disable @eslint-react/dom-no-flush-sync @eslint-react/web-api-no-leaked-event-listener
'use client';
import { useEffect } from 'react';
import { flushSync } from 'react-dom';
import {
  createSharingKey,
  resetSharedValue,
  setSharedValue,
  useSharableValue,
} from './sharable-value.tsx';

const sharingKey = createSharingKey<Error | null>(null);

function ensureError(value: unknown): Error {
  return value instanceof Error ? value : Error(String(value));
}

/**
 * @example
 * ```tsx
 * function Root({ children }) {
 *   return <ErrorBoundary>{children}</ErrorBoundary>;
 * }
 *
 * function Main() {
 *   // throws uncaught error if available.
 *   // the error will be caught by ErrorBoundary.
 *   useUncaughtError();
 * }
 * ```
 */
export function useUncaughtError(): void | never {
  useEffect(() => {
    function onError(event: ErrorEvent): void {
      flushSync(() => {
        setSharedValue(sharingKey, ensureError(event.error));
      });
      resetSharedValue(sharingKey);
    }
    function onUnhandledRejection(event: PromiseRejectionEvent): void {
      flushSync(() => {
        setSharedValue(sharingKey, ensureError(event.reason));
      });
      resetSharedValue(sharingKey);
    }
    addEventListener('error', onError);
    addEventListener('unhandledrejection', onUnhandledRejection);
    return () => {
      removeEventListener('error', onError);
      removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, []);
  const [err] = useSharableValue(sharingKey);
  if (err) {
    throw err;
  }
}
