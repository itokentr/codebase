import { createFsFromVolume, Volume } from 'memfs';
import type { Fs, FsSync } from './types.ts';

export interface FsContext extends Volume {}

let defaultContext: FsContext | undefined;
let defaultFs: Fs | undefined;
let defaultFsSync: FsSync | undefined;

export function createInMemoryFsContext(): FsContext {
  return new Volume();
}

export function getDefaultFsContext(): FsContext {
  defaultContext ??= createInMemoryFsContext();
  return defaultContext;
}

export function createInMemoryFs(ctx?: FsContext): Fs {
  return createFsFromVolume(ctx ?? getDefaultFsContext()).promises;
}

export function createInMemoryFsSync(ctx?: FsContext): FsSync {
  return createFsFromVolume(ctx ?? getDefaultFsContext());
}

export function getDefaultFs(): Fs {
  defaultFs ??= createInMemoryFs();
  return defaultFs;
}

export function getDefaultFsSync(): FsSync {
  defaultFsSync ??= createInMemoryFsSync();
  return defaultFsSync;
}
