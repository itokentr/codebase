import type {
  AbsolutePath,
  ParsedAbsolutePath,
  ParsedRelativePath,
  RelativePath,
} from '@lib/path';
import path from '@lib/path';
import type {
  Encodings,
  ReadableStream,
  UnderlyingByteSource,
  UnderlyingSink,
  WritableStream,
} from '@lib/types/web';

export class AssetFile {
  readonly absName: AbsolutePath;
  readonly absNamePaths: Readonly<ParsedAbsolutePath>;
  readonly name: RelativePath;
  readonly namePaths: Readonly<ParsedRelativePath>;
  readonly root: AbsolutePath;

  constructor(name: RelativePath, root: AbsolutePath) {
    const absName = path.resolve(root, name);
    if (path.relative(root, absName).startsWith('..')) {
      throw TypeError(`file name "${name}" should not start with ".."'`);
    }
    this.absName = absName;
    this.absNamePaths = path.parse(absName);
    this.name = name;
    this.namePaths = path.parse(name);
    this.root = root;
  }
}

export abstract class ReadableAssetFile extends AssetFile {
  async *bytes(): AsyncGenerator<Uint8Array> {
    const reader = (await this.createReadableStream()).getReader();

    for (let continuable = true; continuable;) {
      const { done, value } = await reader.read();

      if (value) {
        yield value;
      }
      continuable = !done;
    }
  }

  async createReadableStream(
    highWaterMark?: number,
  ): Promise<ReadableStream<Uint8Array>> {
    return new ReadableStream(
      await this.createByteSource(),
      { highWaterMark },
    ) as ReadableStream;
  }

  async *text(encoding: Encodings = 'utf8'): AsyncGenerator<string> {
    const decoder = new TextDecoder(encoding);

    for await (const chunk of this.bytes()) {
      yield decoder.decode(chunk, { stream: true });
    }
  }

  protected abstract createByteSource():
    | UnderlyingByteSource
    | Promise<UnderlyingByteSource>;
}

export abstract class WritableAssetFile extends AssetFile {
  async createWritableStream(
    highWaterMark?: number,
  ): Promise<WritableStream<Uint8Array | string>> {
    return new WritableStream(await this.createSink(), { highWaterMark });
  }

  async write(data: Uint8Array | string): Promise<void> {
    const writer = (await this.createWritableStream()).getWriter();
    await writer.ready;
    await writer.write(data);
    await writer.close();
  }

  protected abstract createSink():
    | UnderlyingSink<Uint8Array | string>
    | Promise<UnderlyingSink<Uint8Array | string>>;
}

export abstract class EmittableAssetFile extends WritableAssetFile {
  async emit(): Promise<void> {
    const writer = (await this.createWritableStream()).getWriter();
    for await (const chunk of this.generateChunks()) {
      await writer.ready;
      await writer.write(chunk);
    }
    await writer.close();
  }

  protected abstract generateChunks():
    | Generator<Uint8Array>
    | Generator<string>
    | AsyncGenerator<Uint8Array>
    | AsyncGenerator<string>;
}
