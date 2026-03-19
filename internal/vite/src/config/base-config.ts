import type { UserConfig } from 'vite';

export type BaseOptions = {
  readonly build?: Pick<
    NonNullable<UserConfig['build']>,
    'emptyOutDir' | 'lib' | 'minify' | 'outDir'
  >;
} & Pick<UserConfig, 'plugins'>;

export type NonTypedOptions = { readonly config?: never } & BaseOptions;

export type TypedOptions<T extends string, Options extends object> = {
  readonly config: T;
} & BaseOptions &
  Options;
