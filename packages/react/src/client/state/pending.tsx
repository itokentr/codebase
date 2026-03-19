'use client';
import { useEffect } from 'react';
import { createSharableValue } from './sharable-value.tsx';

export function useInitialPendingState(): boolean {
  const [state] = usePendingState$();
  return state.initial && state.running > 0;
}

export function usePending<T>(value: Promise<T>): Promise<T> {
  const [state, setState] = usePendingState$();
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  const { promise, resolve } = Promise.withResolvers<void>();
  const wrapped = value.finally(() => {
    void promise.finally(() => setState(endPending(state)));
  });
  useEffect(() => {
    setState(startPending(state));
    resolve();
  }, [resolve, setState, state, value]);
  return wrapped;
}

export function usePendingState(): boolean {
  const [state] = usePendingState$();
  return state.running > 0;
}

export function withPending<T>(
  value: Promise<T> | (() => Promise<T>),
): Promise<T> {
  const state = getPendingState();
  setPendingState(startPending(state));
  if (typeof value === 'function') {
    try {
      value = value();
    } catch (e) {
      // oxlint-disable-next-line typescript/prefer-promise-reject-errors
      return Promise.reject(e);
    }
  }
  return value.finally(() => setPendingState(endPending(state)));
}

interface PendingState {
  readonly initial: boolean;
  readonly running: number;
}

const [usePendingState$, getPendingState, setPendingState] =
  createSharableValue<PendingState>({ initial: true, running: 0 });

function endPending(state: PendingState): PendingState {
  return { initial: false, running: state.running > 0 ? state.running - 1 : 0 };
}

function startPending(state: PendingState): PendingState {
  return { initial: state.initial, running: state.running + 1 };
}
