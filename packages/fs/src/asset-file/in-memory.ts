import { getDefaultFs } from '../node/in-memory.ts';
import type { Fs } from '../node/types.ts';
import {
  FsEmittableAssetFile,
  FsReadableAssetFile,
  FsWritableAssetFile,
} from './fs.ts';

export class InMemoryFsReadableAssetFile extends FsReadableAssetFile {
  protected override readonly fs: Fs = getDefaultFs();
}

export class InMemoryFsWritableAssetFile extends FsWritableAssetFile {
  protected override readonly fs: Fs = getDefaultFs();
}

export abstract class InMemoryFsEmittableAssetFile extends FsEmittableAssetFile {
  protected override readonly fs: Fs = getDefaultFs();
}
