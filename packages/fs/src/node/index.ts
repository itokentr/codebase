/// <reference types="node" />
import * as nodeFsSync from 'node:fs';
import * as nodeFs from 'node:fs/promises';
import type { Fs, FsSync } from './types.ts';

export const fs: Fs = nodeFs as unknown as Fs;
export const fsSync: FsSync = nodeFsSync as unknown as FsSync;
export type * from './types.ts';
