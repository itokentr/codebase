import type { AbortSignal } from './abort-controller.ts';

export interface StreamPipeOptions {
  preventAbort?: boolean;
  preventCancel?: boolean;
  preventClose?: boolean;
  signal?: AbortSignal;
}

export interface QueuingStrategy<T = any> {
  highWaterMark?: number;
  size?: QueuingStrategySize<T>;
}

export type QueuingStrategySize<T = any> = (chunk: T) => number;

// #region readable

export interface ReadableStreamIteratorOptions {
  preventCancel?: boolean;
}

export interface ReadableByteStreamController {
  readonly byobRequest: ReadableStreamBYOBRequest | null;
  readonly desiredSize: number | null;
  close(): void;
  enqueue(chunk: ArrayBufferView): void;
  error(e?: any): void;
}

export interface ReadableStream<R = any> extends
  AsyncIterable<
    R,
    BuiltinIteratorReturn
  > {
  readonly locked: boolean;
  [Symbol.asyncIterator](
    options?: ReadableStreamIteratorOptions,
  ): AsyncIteratorObject<R, BuiltinIteratorReturn>;
  cancel(reason?: any): Promise<void>;
  getReader(options: { mode: 'byob' }): ReadableStreamBYOBReader;
  getReader(): ReadableStreamDefaultReader<R>;
  getReader(options?: ReadableStreamGetReaderOptions): ReadableStreamReader<R>;
  pipeThrough<T>(
    transform: ReadableWritablePair<T, R>,
    options?: StreamPipeOptions,
  ): ReadableStream<T>;
  pipeTo(
    destination: WritableStream<R>,
    options?: StreamPipeOptions,
  ): Promise<void>;
  tee(): [ReadableStream<R>, ReadableStream<R>];
  values(
    options?: ReadableStreamIteratorOptions,
  ): AsyncIteratorObject<R, BuiltinIteratorReturn>;
}

declare global {
  var ReadableStream: {
    prototype: ReadableStream;
    new(
      underlyingSource: UnderlyingByteSource,
      strategy?: { highWaterMark?: number },
    ): ReadableStream<Uint8Array<ArrayBuffer>>;
    new<R = any>(
      underlyingSource: UnderlyingDefaultSource<R>,
      strategy?: QueuingStrategy<R>,
    ): ReadableStream<R>;
    new<R = any>(
      underlyingSource?: UnderlyingSource<R>,
      strategy?: QueuingStrategy<R>,
    ): ReadableStream<R>;
  };
}

export interface ReadableStreamBYOBReader {
  readonly closed: Promise<void>;
  cancel(reason?: any): Promise<void>;
  read<T extends ArrayBufferView>(
    view: T,
  ): Promise<ReadableStreamReadResult<T>>;
  releaseLock(): void;
}

export interface ReadableStreamBYOBRequest {
  readonly view: ArrayBufferView | null;
  respond(bytesWritten: number): void;
  respondWithNewView(view: ArrayBufferView): void;
}

export interface ReadableStreamDefaultController<R = any> {
  readonly desiredSize: number | null;
  close(): void;
  enqueue(chunk?: R): void;
  error(e?: any): void;
}

export interface ReadableStreamDefaultReader<R = any> {
  readonly closed: Promise<void>;
  cancel(reason?: any): Promise<void>;
  read(): Promise<ReadableStreamReadResult<R>>;
  releaseLock(): void;
}

export interface ReadableStreamGetReaderOptions {
  mode?: 'byob';
}

export type ReadableStreamReader<T> =
  | ReadableStreamDefaultReader<T>
  | ReadableStreamBYOBReader;

export interface ReadableStreamReadDoneResult<T> {
  done: true;
  value?: T;
}

export interface ReadableStreamReadValueResult<T> {
  done: false;
  value: T;
}

export type ReadableStreamReadResult<T> =
  | ReadableStreamReadDoneResult<T>
  | ReadableStreamReadValueResult<T>;

export interface ReadableWritablePair<R = any, W = any> {
  readable: ReadableStream<R>;
  writable: WritableStream<W>;
}

export interface UnderlyingByteSource {
  autoAllocateChunkSize?: number;
  cancel?: UnderlyingSourceCancelCallback;
  pull?: (controller: ReadableByteStreamController) => void | PromiseLike<void>;
  start?: (controller: ReadableByteStreamController) => any;
  type: 'bytes';
}

export interface UnderlyingDefaultSource<R = any> {
  cancel?: UnderlyingSourceCancelCallback;
  pull?: (
    controller: ReadableStreamDefaultController<R>,
  ) => void | PromiseLike<void>;
  start?: (controller: ReadableStreamDefaultController<R>) => any;
  type?: undefined;
}

export interface UnderlyingSource<R = any> {
  autoAllocateChunkSize?: number;
  cancel?: UnderlyingSourceCancelCallback;
  pull?: UnderlyingSourcePullCallback<R>;
  start?: UnderlyingSourceStartCallback<R>;
  type?: 'bytes';
}

export type UnderlyingSourceCancelCallback = (
  reason?: any,
) => void | PromiseLike<void>;

export type UnderlyingSourcePullCallback<R> = (
  controller: ReadableStreamDefaultController<R> | ReadableByteStreamController,
) => void | PromiseLike<void>;

export type UnderlyingSourceStartCallback<R> = (
  controller: ReadableStreamDefaultController<R> | ReadableByteStreamController,
) => any;

// #endregion
// #region writable

export interface WritableStream<W = any> {
  readonly locked: boolean;
  abort(reason?: any): Promise<void>;
  close(): Promise<void>;
  getWriter(): WritableStreamDefaultWriter<W>;
}

declare global {
  var WritableStream: {
    prototype: WritableStream;
    new<W = any>(
      underlyingSink?: UnderlyingSink<W>,
      strategy?: QueuingStrategy<W>,
    ): WritableStream<W>;
  };
}

export interface WritableStreamDefaultController {
  readonly signal: AbortSignal;
  error(e?: any): void;
}

export interface WritableStreamDefaultWriter<W = any> {
  readonly closed: Promise<void>;
  readonly desiredSize: number | null;
  readonly ready: Promise<void>;
  abort(reason?: any): Promise<void>;
  close(): Promise<void>;
  releaseLock(): void;
  write(chunk?: W): Promise<void>;
}

export interface UnderlyingSink<W = any> {
  abort?: UnderlyingSinkAbortCallback;
  close?: UnderlyingSinkCloseCallback;
  start?: UnderlyingSinkStartCallback;
  type?: undefined;
  write?: UnderlyingSinkWriteCallback<W>;
}

export type UnderlyingSinkAbortCallback = (
  reason?: any,
) => void | PromiseLike<void>;

export type UnderlyingSinkCloseCallback = () => void | PromiseLike<void>;

export type UnderlyingSinkStartCallback = (
  controller: WritableStreamDefaultController,
) => any;

export type UnderlyingSinkWriteCallback<W> = (
  chunk: W,
  controller: WritableStreamDefaultController,
) => void | PromiseLike<void>;

// #endregion
// #region transform

export interface TransformStreamDefaultController<O = any> {
  readonly desiredSize: number | null;
  enqueue(chunk?: O): void;
  error(reason?: any): void;
  terminate(): void;
}

export type TransformerFlushCallback<O> = (
  controller: TransformStreamDefaultController<O>,
) => void | PromiseLike<void>;

export type TransformerStartCallback<O> = (
  controller: TransformStreamDefaultController<O>,
) => any;

export type TransformerTransformCallback<I, O> = (
  chunk: I,
  controller: TransformStreamDefaultController<O>,
) => void | PromiseLike<void>;

export interface Transformer<I = any, O = any> {
  flush?: TransformerFlushCallback<O>;
  readableType?: undefined;
  start?: TransformerStartCallback<O>;
  transform?: TransformerTransformCallback<I, O>;
  writableType?: undefined;
}

export interface TransformStream<I = any, O = any> {
  readonly readable: ReadableStream<O>;
  readonly writable: WritableStream<I>;
}

// #endregion
