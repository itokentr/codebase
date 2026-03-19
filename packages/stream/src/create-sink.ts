import type { UnderlyingSink } from '@lib/types/web';

export interface WritableHandle<T> {
  readonly close?: (() => Promise<void> | void) | undefined;
  readonly write: (buffer: T) => Promise<void> | void;
}

export type WritableHandleFactory<T> = () =>
  | WritableHandle<T>
  | Promise<WritableHandle<T>>;

export interface CreateUnderlyingSinkOptions<T> {
  readonly handle: WritableHandleFactory<T>;
}

export function createSink<T>({
  handle,
}: CreateUnderlyingSinkOptions<T>): UnderlyingSink<T> {
  let h: WritableHandle<T> | undefined;
  return {
    async abort() {
      await h?.close?.();
    },
    async close() {
      await h?.close?.();
    },
    async start() {
      h = await handle();
    },
    async write(chunk, controller) {
      if (!h) {
        controller.error(Error('unexpected no file handle'));
        return;
      }
      await h.write(chunk);
    },
  };
}

/**
 * @example
 * ```
 * const view = new Uint8Array(
 *   new ArrayBuffer(1024, {maxByteLength: 8192}),
 * );
 * const stream = new WritableStream(
 *   createInMemoryByteSink(view),
 * );
 * ```
 */
export function createInMemoryByteSink(
  view: Uint8Array,
): UnderlyingSink<Uint8Array> {
  let written = 0;
  return {
    write(chunk, controller) {
      if (view.buffer.byteLength < written + chunk.byteLength) {
        try {
          (view.buffer as ArrayBuffer).resize(written + chunk.byteLength);
        } catch (e) {
          controller.error(e);
          return;
        }
      }
      view.set(chunk, written);
      written += chunk.byteLength;
    },
  };
}
