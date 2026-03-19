import type { UserConfig, UserConfigFn } from 'vite';
import type { NonTypedOptions } from './config/base-config.ts';
import type { WasmGolangConfigOptions } from './config/wasm-golang.ts';
import { createWasmGolangConfig } from './config/wasm-golang.ts';

export type CreateViteConifgOptions = NonTypedOptions | WasmGolangConfigOptions;

export function createViteConfig(
  options: CreateViteConifgOptions,
): UserConfig | UserConfigFn {
  switch (options.config) {
    case 'wasm-golang': {
      return createWasmGolangConfig(options);
    }
    default: {
      throw Error('not supported');
    }
  }
}
