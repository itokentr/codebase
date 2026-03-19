import type { EmittableAssetFile } from '@lib/fs/asset-file';
import type { Dependencies } from './pick-deps.ts';

export interface BuildResult {
  readonly deps: Dependencies;
  readonly files: readonly EmittableAssetFile[];
}
