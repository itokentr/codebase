import type { ChokidarOptions, FSWatcher } from 'chokidar';
import { watch } from 'chokidar';
import type { ExecaMethod } from 'execa';
import { execa } from 'execa';
import type { Plugin, UserConfigFn } from 'vite';
import { defineConfig } from 'vite';
import type { TypedOptions } from './base-config.ts';

interface GoOptions {
  /** reserved. */
  readonly goArch?: never;
  /** reserved. */
  readonly goOs?: never;
  readonly goOut?: string | undefined;
  readonly goPackages?: string | undefined;
  readonly goSrcRoot: string;
}

interface GoOptionsInternal extends GoOptions {
  readonly runGo: ExecaMethod;
}

async function buildWasm({
  goSrcRoot: src,
  goOut: out,
  goPackages: pkg,
  runGo,
}: GoOptionsInternal): Promise<[stdout: string | null, stderr: string | null]> {
  if (out) {
    out = `-o ${out}`;
  }
  out ??= '';
  pkg ??= '';
  const { stderr, stdout } = await runGo`go build -C ${src} ${out} ${pkg}`;

  function stringify(value: typeof stdout): string | null {
    return (
      (ArrayBuffer.isView(value)
        ? Buffer.from(value).toString('utf8')
        : Array.isArray(value)
          ? value.join('')
          : value) ?? null
    );
  }
  return [stringify(stdout), stringify(stderr)];
}

function createWatchWasmPlugin(options: GoOptionsInternal): Plugin {
  let watcher: FSWatcher | undefined;
  return {
    async closeWatcher() {
      await watcher?.close();
    },
    configResolved(config) {
      watcher = watch(
        options.goSrcRoot,
        config.build.watch?.watcher as ChokidarOptions | undefined,
      );
      watcher.once('ready', () => {
        watcher?.on('all', (event) => {
          switch (event) {
            case 'add':
            case 'change':
            case 'unlink':
            case 'unlinkDir': {
              break;
            }
            default: {
              this.info(event);
              return;
            }
          }
          buildWasm(options)
            .then(([stdout, stderr]) => {
              if (stderr) {
                this.warn(stderr);
              }
              this.info(stdout ?? `wasm compiled: ${options.goSrcRoot}`);
            })
            .catch((err: unknown) => {
              this.warn(String(err));
            });
        });
      });
    },
    name: 'watch-wasm',
  };
}

export type WasmGolangConfigOptions = TypedOptions<'wasm-golang', GoOptions>;

export function createWasmGolangConfig(
  options: WasmGolangConfigOptions,
): UserConfigFn {
  return defineConfig((env) => {
    const { build, plugins } = options;
    const runGo = execa({
      env: {
        GOARCH: (options.goArch as string | undefined) ?? 'wasm',
        GOOS: (options.goOs as string | undefined) ?? 'js',
      },
    });
    const goOptions: GoOptionsInternal = { ...options, runGo };
    const production = env.mode === 'production';
    return {
      build: {
        ...build,
        lib: build?.lib
          ? {
              formats: ['es'],
              ...build.lib,
            }
          : false,
        minify: production ? (build?.minify ?? true) : false,
        watch: production ? null : {},
      },
      plugins: [
        {
          async configResolved() {
            await buildWasm(goOptions);
          },
          name: 'build-wasm',
        },
        ...(production ? [] : [createWatchWasmPlugin(goOptions)]),
        ...(plugins ?? []),
      ],
    };
  });
}
