import type { ReadableStream } from './stream.ts';

export interface Blob {
  readonly size: number;
  readonly type: string;
  arrayBuffer(): Promise<ArrayBuffer>;
  bytes(): Promise<Uint8Array>;
  slice(start?: number, end?: number, contentType?: string): Blob;
  stream(): ReadableStream<Uint8Array>;
  text(): Promise<string>;
}

declare global {
  var Blob: {
    prototype: Blob;
    new(blobParts?: BlobPart[], options?: BlobPropertyBag): Blob;
  };
}

export type BlobPart = ArrayBufferView | ArrayBuffer | Blob | string;

export interface BlobPropertyBag {
  endings?: 'native' | 'transparent';
  type?: string;
}

export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
  readonly webkitRelativePath: string;
}

declare global {
  var File: {
    prototype: File;
    new(
      fileBits: BlobPart[],
      fileName: string,
      options?: FilePropertyBag,
    ): File;
  };
}

export interface FilePropertyBag extends BlobPropertyBag {
  lastModified?: number;
}

export interface FileList {
  readonly length: number;
  item(index: number): File | null;
  [index: number]: File;
}

declare global {
  var FileList: {
    prototype: FileList;
    new(): FileList;
  };
}
