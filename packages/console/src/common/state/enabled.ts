const DISABLED = 0;
const ENABLED = 1;
let enabledStore: EnabledStore = new Set<number>([1]);

export interface EnabledStore {
  add(value: number): any;
  has(value: number): boolean;
  delete(value: number): any;
}

export function enabled(): boolean;
export function enabled(value: boolean): void;
export function enabled(value?: boolean): boolean | void {
  if (typeof value === 'undefined') {
    return enabledStore.has(ENABLED);
  }
  if (value) {
    enabledStore.add(ENABLED);
    enabledStore.delete(DISABLED);
  } else {
    enabledStore.add(DISABLED);
    enabledStore.delete(ENABLED);
  }
}

export function setEnabledStore(store: EnabledStore): void {
  enabledStore = store;
}
