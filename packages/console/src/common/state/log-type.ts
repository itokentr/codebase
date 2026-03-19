import type { OutputFormat } from '../types.ts';
import { logTypes } from '../types.ts';

let usedStore: LogTypeStore = new Set<OutputFormat>(logTypes);

export interface LogTypeStore {
  add(value: OutputFormat): any;
  delete(value: OutputFormat): any;
  has(value: OutputFormat): boolean;
}

export function disableLogType(...logType: readonly OutputFormat[]): void {
  for (const value of logType) {
    usedStore.delete(value);
  }
}

export function enableLogType(...logType: readonly OutputFormat[]): void {
  for (const value of logType) {
    usedStore.add(value);
  }
}

export function logTypeEnabled(logType: OutputFormat): boolean {
  return usedStore.has(logType);
}

export function setLogTypeStore(store: LogTypeStore): void {
  usedStore = store;
}
