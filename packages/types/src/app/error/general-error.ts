export class GeneralError extends Error {
  constructor(error?: unknown, name?: string) {
    super(
      error instanceof Error
        ? error.message
        : typeof error === 'string'
        ? error
        : JSON.stringify(error),
    );
    this.name = name ?? (error instanceof Error ? error.name : undefined)
      ?? 'Error';

    Object.defineProperty(this, 'message', {
      configurable: true,
      enumerable: true,
      value: this.message,
      writable: true,
    });
    if (typeof error === 'object' && error !== null) {
      for (const k of Object.keys(error)) {
        try {
          if (!(k in this)) {
            (this as Error)[k as keyof Error] = error[k as keyof typeof error];
          }
        } catch {
          //
        }
      }
    }
  }

  override valueOf(): object {
    return {
      message: this.message,
      name: this.name,
    };
  }
}
