import type { AbsolutePath } from '@lib/path';
import { createByteSource, createSink } from '@lib/stream';
import type { UnderlyingByteSource, UnderlyingSink } from '@lib/types/web';
import {
  EmittableAssetFile,
  ReadableAssetFile,
  WritableAssetFile,
} from '../asset-file.ts';
import type { Fs } from '../node/types.ts';

function createFsByteSource(
  fs: Fs,
  fileName: AbsolutePath,
): UnderlyingByteSource {
  return createByteSource({
    handle: () => {
      let fh: Awaited<ReturnType<Fs['open']>> | undefined;
      return {
        close: async () => fh?.close(),
        read: async (buf, offset, len, pos) =>
          // eslint-disable-next-line typescript/no-non-null-assertion
          fh!.read(buf, offset, len, pos).then(({ bytesRead }) => bytesRead),
        async start() {
          await fh?.close();
          fh = await fs.open(fileName);
        },
      };
    },
  });
}

function createFsSink(
  fs: Fs,
  fileName: AbsolutePath,
): UnderlyingSink<Uint8Array | string> {
  return createSink({
    handle: () => {
      let fh: Awaited<ReturnType<Fs['open']>> | undefined;
      let position = 0;
      return {
        close: async () => fh?.close(),
        async start() {
          await fh?.close();
          fh = await fs.open(fileName, 'w');
          position = 0;
        },
        write: async (chunk) => {
          let written: number;
          if (typeof chunk === 'string') {
            // eslint-disable-next-line typescript/no-non-null-assertion
            const { bytesWritten } = await fh!.write(
              // @ts-expect-error available overload
              // https://github.com/streamich/memfs/blob/22aa85de4615f88ed12f78584dc7ebd32726ea15/packages/fs-node/src/FileHandle.ts#L230
              // https://github.com/streamich/memfs/blob/22aa85de4615f88ed12f78584dc7ebd32726ea15/packages/fs-node/src/volume.ts#L493
              chunk,
              position,
            );
            written = bytesWritten;
          } else {
            // eslint-disable-next-line typescript/no-non-null-assertion
            const { bytesWritten } = await fh!.write(
              chunk,
              0,
              chunk.length,
              position,
            );
            written = bytesWritten;
          }
          position += written;
        },
      };
    },
  });
}

export abstract class FsReadableAssetFile extends ReadableAssetFile {
  protected abstract readonly fs: Fs;

  protected override createByteSource():
    | UnderlyingByteSource
    | Promise<UnderlyingByteSource> {
    return createFsByteSource(this.fs, this.absName);
  }
}

export abstract class FsWritableAssetFile extends WritableAssetFile {
  protected abstract readonly fs: Fs;

  protected get outputName(): AbsolutePath {
    return this.absName;
  }

  protected createSink():
    | UnderlyingSink<Uint8Array | string>
    | Promise<UnderlyingSink<Uint8Array | string>> {
    return createFsSink(this.fs, this.outputName);
  }
}

export abstract class FsEmittableAssetFile extends EmittableAssetFile {
  protected abstract readonly fs: Fs;

  protected get outputName(): AbsolutePath {
    return this.absName;
  }

  protected createSink():
    | UnderlyingSink<Uint8Array | string>
    | Promise<UnderlyingSink<Uint8Array | string>> {
    return createFsSink(this.fs, this.outputName);
  }
}
