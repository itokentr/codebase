import { fs } from '../node/index.ts';
import type { Fs } from '../node/types.ts';
/// <reference types="node" />
import {
  FsEmittableAssetFile,
  FsReadableAssetFile,
  FsWritableAssetFile,
} from './fs.ts';

export class NodeFsReadableAssetFile extends FsReadableAssetFile {
  protected override readonly fs: Fs = fs;
}

export class NodeFsWritableAssetFile extends FsWritableAssetFile {
  protected override readonly fs: Fs = fs;
}

export abstract class NodeFsEmittableAssetFile extends FsEmittableAssetFile {
  protected override readonly fs: Fs = fs;
}
