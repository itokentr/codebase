// oxlint-disable typescript/no-explicit-any typescript/no-unsafe-argument typescript/no-unsafe-assignment typescript/no-unsafe-return

export function mergeCallbacks<T extends (...args: any[]) => any>(
  cb: T | null | undefined,
  ...cbs: readonly (T | null | undefined)[]
): T | undefined {
  const callbacks = [cb, ...cbs];
  for (const cb of callbacks) {
    if (cb) {
      return ((...args) => {
        let ret: any;
        for (const cb of callbacks) {
          if (cb) {
            ret = cb(...args);
          }
        }
        return ret;
      }) as T;
    }
  }
  return undefined;
}
