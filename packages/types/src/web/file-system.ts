import type { Blob, File } from './blob.ts';
import type { WritableStream } from './stream.ts';

export interface ErrorCallback {
  (err: Error): void;
}

export interface FileCallback {
  (file: File): void;
}

export interface FileSystemCreateWritableOptions {
  readonly keepExistingData?: boolean;
}

export interface FileSystemEntriesCallback {
  (entries: FileSystemEntry[]): void;
}

export interface FileSystemEntryCallback {
  (entry: FileSystemEntry): void;
}

export interface FileSystemFlags {
  readonly create?: boolean;
  readonly exclusive?: boolean;
}

export interface FileSystemGetDirectoryOptions {
  readonly create?: boolean;
}

export interface FileSystemGetFileOptions {
  readonly create?: boolean;
}

export interface FileSystemRemoveOptions {
  readonly recursive?: boolean;
}

export interface WriteParams {
  readonly data?:
    | ArrayBufferView<ArrayBuffer>
    | ArrayBuffer
    | Blob
    | string
    | null;
  readonly position?: number | null;
  readonly size?: number | null;
  readonly type: 'seek' | 'truncate' | 'write';
}

export interface FileSystem {
  readonly name: string;
  readonly root: FileSystemDirectoryEntry;
}

declare global {
  var FileSystem: {
    prototype: FileSystem;
    new(): FileSystem;
  };
}

export interface FileSystemDirectoryEntry extends FileSystemEntry {
  createReader(): FileSystemDirectoryReader;
  getDirectory(
    path?: string | null,
    options?: FileSystemFlags,
    successCallback?: FileSystemEntryCallback,
    errorCallback?: ErrorCallback,
  ): void;
  getFile(
    path?: string | null,
    options?: FileSystemFlags,
    successCallback?: FileSystemEntryCallback,
    errorCallback?: ErrorCallback,
  ): void;
}

declare global {
  var FileSystemDirectoryEntry: {
    prototype: FileSystemDirectoryEntry;
    new(): FileSystemDirectoryEntry;
  };
}

export interface FileSystemDirectoryHandle extends FileSystemHandle {
  readonly kind: 'directory';
  getDirectoryHandle(
    name: string,
    options?: FileSystemGetDirectoryOptions,
  ): Promise<FileSystemDirectoryHandle>;
  getFileHandle(
    name: string,
    options?: FileSystemGetFileOptions,
  ): Promise<FileSystemFileHandle>;
  removeEntry(name: string, options?: FileSystemRemoveOptions): Promise<void>;
  resolve(possibleDescendant: FileSystemHandle): Promise<string[] | null>;
}

declare global {
  var FileSystemDirectoryHandle: {
    prototype: FileSystemDirectoryHandle;
    new(): FileSystemDirectoryHandle;
  };
}

export interface FileSystemDirectoryReader {
  readEntries(
    successCallback: FileSystemEntriesCallback,
    errorCallback?: ErrorCallback,
  ): void;
}

declare global {
  var FileSystemDirectoryReader: {
    prototype: FileSystemDirectoryReader;
    new(): FileSystemDirectoryReader;
  };
}

export interface FileSystemEntry {
  readonly filesystem: FileSystem;
  readonly fullPath: string;
  readonly isDirectory: boolean;
  readonly isFile: boolean;
  readonly name: string;
  getParent(
    successCallback?: FileSystemEntryCallback,
    errorCallback?: ErrorCallback,
  ): void;
}

declare global {
  var FileSystemEntry: {
    prototype: FileSystemEntry;
    new(): FileSystemEntry;
  };
}

export interface FileSystemFileEntry extends FileSystemEntry {
  file(successCallback: FileCallback, errorCallback?: ErrorCallback): void;
}

declare global {
  var FileSystemFileEntry: {
    prototype: FileSystemFileEntry;
    new(): FileSystemFileEntry;
  };
}

export interface FileSystemFileHandle extends FileSystemHandle {
  readonly kind: 'file';
  createWritable(
    options?: FileSystemCreateWritableOptions,
  ): Promise<FileSystemWritableFileStream>;
  getFile(): Promise<File>;
}

declare global {
  var FileSystemFileHandle: {
    prototype: FileSystemFileHandle;
    new(): FileSystemFileHandle;
  };
}

export interface FileSystemHandle {
  readonly kind: 'directory' | 'file';
  readonly name: string;
  isSameEntry(other: FileSystemHandle): Promise<boolean>;
}

declare global {
  var FileSystemHandle: {
    prototype: FileSystemHandle;
    new(): FileSystemHandle;
  };
}

export interface FileSystemWritableFileStream extends WritableStream {
  seek(position: number): Promise<void>;
  truncate(size: number): Promise<void>;
  write(
    data:
      | ArrayBufferView<ArrayBuffer>
      | ArrayBuffer
      | Blob
      | string
      | WriteParams,
  ): Promise<void>;
}

declare global {
  var FileSystemWritableFileStream: {
    prototype: FileSystemWritableFileStream;
    new(): FileSystemWritableFileStream;
  };
}
