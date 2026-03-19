import type { Config } from '@sveltejs/kit';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import browserslist from 'browserslist-to-esbuild';
import path from 'node:path';
import type {
  BuildEnvironmentOptions,
  LibraryOptions,
  UserConfig,
  UserConfigFn,
} from 'vite';
import * as vite from 'vite';
import { generateCustomElementsDts } from './generate-dts.ts';
import { runSvelteKitSync } from './util/run-svelte-kit-sync.ts';

export type CustomElementsDtsConfig =
  & {
    readonly build?:
      & Omit<Partial<BuildEnvironmentOptions>, 'lib'>
      & { readonly lib?: Omit<Partial<LibraryOptions>, 'formats' | 'name'> };
  }
  & Omit<UserConfig, 'build' | 'lib'>
  & {
    readonly customElements?: {
      /** @default 'custom-elements.d.ts' */
      readonly outDtsName?: string;
      readonly svelteConfig?: Config;
    };
  };

export function defineConfig(config?: CustomElementsDtsConfig): UserConfigFn {
  return vite.defineConfig(({ command }) => {
    const inSvelteKitSync = process.argv[2] === 'sync'
      && !!process.argv[1]?.match(
        new RegExp(RegExp.escape(`${path.sep}svelte-kit`) + '(?:\\.js)?$'),
      );
    // for svelte-kit sync command or svelte language server
    if (inSvelteKitSync || command === 'serve') {
      return {
        plugins: [
          sveltekit({
            ...config?.customElements?.svelteConfig,
            compilerOptions: {
              ...config?.customElements?.svelteConfig?.compilerOptions,
              customElement: true,
            },
          }),
          ...(config?.plugins ?? []),
        ],
      };
    }
    // for vite build
    return defineCustomElementsConfig(config ?? {});
  });
}

async function defineCustomElementsConfig(
  {
    build,
    customElements,
    plugins,
    root = process.cwd(),
    ...config
  }: CustomElementsDtsConfig,
): Promise<UserConfig> {
  const { outDtsName = 'custom-elements.d.ts', svelteConfig } = customElements
    ?? {};
  const { lib, outDir = 'dist' } = build ?? {};
  let srcDir: string | undefined;
  await runSvelteKitSync(root);

  return vite.defineConfig({
    build: {
      emptyOutDir: false,
      target: browserslist(
        ['chrome', 'firefox', 'ios', 'safari']
          .map((name) => `last 2 ${name} major versions`)
          .join(','),
      ),
      ...build,
      lib: {
        entry: './src/index.ts',
        fileName: (_, name) => `${name}.js`,
        ...lib,
        formats: ['iife'],
        name: `c${Math.random().toString(36).substring(2)}`,
      },
      outDir,
      rolldownOptions: {
        output: {
          codeSplitting: true,
        },
      },
    },
    plugins: [
      {
        enforce: 'pre',
        name: 'custom-elements:run-svelte-kit-sync',
        async watchChange() {
          await runSvelteKitSync(root);
        },
      },
      {
        buildStart({ input }) {
          const entries = Array.isArray(input) ? input : Object.values(input);
          let level = Number.MAX_SAFE_INTEGER;

          for (const item of entries) {
            const rel = path.relative(root, item);

            if (rel.startsWith('..')) {
              throw Error(`unexpected non descendant path: ${item}`);
            }
            const thisLevel = rel.split(path.sep).length;
            if (thisLevel < level) {
              level = thisLevel;
              srcDir = path.dirname(rel);
            }
          }
        },
        enforce: 'pre',
        name: 'custom-elements:entries',
      },
      svelte({
        configFile: false,
        ...svelteConfig,
        compilerOptions: {
          ...svelteConfig?.compilerOptions,
          customElement: true,
        },
      }),
      {
        enforce: 'post',
        async generateBundle() {
          const dts = await generateCustomElementsDts({
            root,
            srcDir: srcDir ?? root,
          });
          this.emitFile({
            fileName: outDtsName,
            source: dts,
            type: 'asset',
          });
        },
        name: 'custom-elements:generate-dts',
      },
      ...(plugins ?? []),
    ],
    root,
    ...config,
  });
}
