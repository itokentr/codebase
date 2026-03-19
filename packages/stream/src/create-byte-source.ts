import type { UnderlyingByteSource } from '@lib/types/web';

export interface ReadableHandle {
  readonly close?: (() => Promise<void> | void) | undefined;
  readonly read: (
    buffer: Uint8Array,
    offset: number,
    length: number,
    position: number,
  ) => number | Promise<number>;
}

export type ReadableHandleFactory = () =>
  | ReadableHandle
  | Promise<ReadableHandle>;

export interface CreateUnderlyingByteSourceOptions {
  readonly autoAllocateChunkSize?: number | undefined;
  readonly handle: ReadableHandleFactory;
}

export function createByteSource({
  autoAllocateChunkSize,
  handle,
}: CreateUnderlyingByteSourceOptions): UnderlyingByteSource {
  let fh: ReadableHandle | undefined;
  let position = 0;
  return {
    autoAllocateChunkSize,
    async cancel() {
      await fh?.close?.();
    },
    async pull(controller) {
      if (!fh) {
        controller.error(Error('unexpected no file handle'));
        return;
      }
      const byobRequest = controller.byobRequest;
      let finish = false;

      if (byobRequest) {
        // null if the BYOB (bring your own buffer) request has already been responded to.
        // see https://streams.spec.whatwg.org/#rs-byob-request-prototype
        if (!byobRequest.view) {
          controller.error(Error('unexpected no BYOB request'));
          return;
        }
        const { buffer, byteLength, byteOffset } = byobRequest.view;
        const bytesBuffer = new Uint8Array(buffer);
        const bytesRead = await fh.read(
          bytesBuffer,
          byteOffset,
          byteLength,
          position,
        );
        if (bytesRead > 0) {
          byobRequest.respond(bytesRead);
          position += bytesRead;
        } else {
          finish = true;
        }
      } else {
        // can be negative, if the queue is over-full.
        // see https://streams.spec.whatwg.org/#rs-default-controller-prototype
        const length = controller.desiredSize;

        if (length === 0 || length === null) {
          finish = true;
        } else if (length > 0) {
          const buffer = new Uint8Array(length);
          const bytesRead = await fh.read(buffer, 0, length, position);

          if (bytesRead > 0) {
            controller.enqueue(buffer.subarray(0, bytesRead));
            position += bytesRead;
          } else {
            finish = true;
          }
        }
      }
      if (finish) {
        controller.close();
        await fh.close?.();
      }
    },
    async start() {
      fh = await handle();
      position = 0;
    },
    type: 'bytes',
  };
}

/**
 * @example
 * ```
 * const data = new Uint8Array(...);
 * const stream = new ReadableStream(
 *   createByteSourceFromBytes(data),
 * );
 * ```
 */
export function createByteSourceFromBytes(
  bytes: Uint8Array,
): UnderlyingByteSource {
  return createByteSource({
    handle() {
      return {
        read(buffer, offset, length, position) {
          const chunk = bytes.subarray(position, position + length);

          if (chunk.byteLength > 0) {
            buffer.set(chunk, offset);
          }
          return chunk.byteLength;
        },
      };
    },
  });
}
