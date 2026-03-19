'use client';
import { useFetchers, useNavigation } from 'react-router';
import { usePendingState } from '../../../client/state/pending.tsx';

export function useLoadingState(): boolean {
  const fetching = useFetchers().some(({ state }) => state !== 'idle');
  const navigating = useNavigation().state !== 'idle';
  const pending = usePendingState();
  return fetching || navigating || pending;
}
