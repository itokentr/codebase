/* eslint-disable sort-keys */
import type {
  PluginOptions,
  SourceLocation,
} from 'babel-plugin-react-compiler';
import { CompilerErrorDetail } from 'babel-plugin-react-compiler';
import chalk from 'chalk';
import * as path from 'node:path';
import type { ConfigEnv, Plugin } from 'vite';
import babel from 'vite-plugin-babel';

export interface ReactCompilerOptions {
  readonly command: ConfigEnv['command'] | 'check';
  readonly exclude?: string | RegExp | readonly (string | RegExp)[];
  readonly root: string;
  readonly sourceMapRoot?: string;
  /** @default true */
  readonly sourceMaps?: boolean;
}

export function reactCompiler({
  command,
  exclude,
  root,
  sourceMapRoot,
  sourceMaps = true,
}: ReactCompilerOptions): Plugin {
  type RollupPluginContext = ThisParameterType<
    Extract<NonNullable<Plugin['buildStart']>, (...args: never) => unknown>
  >;
  let pluginContext: RollupPluginContext | undefined;
  if (exclude) {
    if (!Array.isArray(exclude)) {
      exclude = [exclude as string | RegExp];
    }
    exclude = (exclude as readonly (string | RegExp)[]).map((value) =>
      typeof value === 'string' ? new RegExp(RegExp.escape(value)) : value
    );
  }
  const errors: string[] = [];
  const excluded = !exclude
    ? undefined
    : (fullName: string): boolean => {
      for (const regex of exclude as readonly RegExp[]) {
        if (regex.test(fullName)) {
          return true;
        }
      }
      return false;
    };
  function warn(message: string): void {
    if (command !== 'serve') {
      errors.push(message);
    }
    pluginContext?.warn(chalk.red(message));
  }
  const babelReactCompiler = babel({
    babelConfig: {
      presets: ['@babel/preset-typescript'],
      plugins: [
        [
          'babel-plugin-react-compiler',
          {
            noEmit: command === 'check',
            logger: {
              logEvent(fullname, event) {
                if (
                  (command === 'serve' && event.kind !== 'CompileError')
                  || (fullname && excluded?.(fullname))
                ) {
                  return;
                }
                type L = Exclude<SourceLocation, symbol> | null;
                const relname = fullname ? path.relative(root, fullname) : '';
                switch (event.kind) {
                  case 'CompileError': {
                    const loc = event.detail.primaryLocation() as L;
                    if (event.detail instanceof CompilerErrorDetail) {
                      const start = loc?.start;
                      const at = start
                        ? ` (${start.line}:${start.column + 1})`
                        : '';
                      const prefix = relname ? `${relname}${at}: ` : '';
                      let desc = event.detail.description ?? '';
                      if (desc) {
                        desc += '. ';
                      }
                      const message = `${prefix}${desc}${event.detail.reason}`;
                      warn(message);
                    } else {
                      const start = loc?.start;
                      const at = start
                        ? ` (${start.line}:${start.column + 1})`
                        : '';
                      const prefix = relname ? `${relname}${at}: ` : '';
                      pluginContext?.warn(
                        `${prefix}${chalk.gray(event.detail.description)}`,
                      );
                    }
                    break;
                  }
                  case 'CompileSkip': {
                    const start = (event.fnLoc as L)?.start;
                    const at = start
                      ? ` (${start.line}:${start.column + 1})`
                      : '';
                    const prefix = relname ? `${relname}${at}: ` : '';
                    pluginContext?.info(chalk.gray(`${prefix}${event.reason}`));
                    break;
                  }
                  case 'CompileSuccess': {
                    pluginContext?.debug(
                      chalk.gray(
                        `${relname} `
                          + (event.fnName ? event.fnName + '() ' : '')
                          + `blocks:${event.memoBlocks} `
                          + `slots:${event.memoSlots} `
                          + `values:${event.memoValues}`,
                      ),
                    );
                    break;
                  }
                }
              },
            },
          } as PluginOptions,
        ],
      ],
      sourceMaps,
    },
    include: /\.[jt]sx$/,
  });
  return {
    ...babelReactCompiler,
    name: 'react-compiler',
    buildEnd(error) {
      if (error) {
        this.error(error);
      }
      if (errors.length > 0) {
        this.error('React Compiler reported errors above');
      }
      type F = Extract<
        typeof babelReactCompiler.buildEnd,
        (...args: never) => unknown
      >;
      const fn = babelReactCompiler.buildEnd as F | undefined;
      return fn?.call(this, error);
    },
    buildStart(options) {
      // eslint-disable-next-line typescript/no-this-alias
      pluginContext = this;

      type F = Extract<
        typeof babelReactCompiler.buildStart,
        (...args: never) => unknown
      >;
      const fn = babelReactCompiler.buildStart as F | undefined;
      return fn?.call(this, options);
    },
    async config(config, env) {
      type F = Extract<
        typeof babelReactCompiler.config,
        (...args: never) => unknown
      >;
      type R = Awaited<ReturnType<F>>;
      const result: R = await (
        babelReactCompiler.config as F | undefined
      )?.call(this, config, env);

      // oxlint-disable typescript/no-deprecated
      if (
        result?.optimizeDeps?.esbuildOptions
        && !result.optimizeDeps.rolldownOptions
      ) {
        result.optimizeDeps.rolldownOptions = {
          ...result.optimizeDeps.esbuildOptions,
        };
        delete result.optimizeDeps.esbuildOptions;
      }
      // oxlint-enable typescript/no-deprecated
      return result;
    },
    async transform(code, id, options) {
      type F = Extract<
        typeof babelReactCompiler.transform,
        (...args: never) => unknown
      >;
      type R = Awaited<ReturnType<F>>;
      const fn = babelReactCompiler.transform as F | undefined;
      const result: R = await fn?.call(this, code, id, options);

      if (!result || typeof result === 'string') {
        return result;
      }
      const { map } = result;

      if (map && typeof map !== 'string') {
        map.file = id;
        map.sourceRoot = sourceMapRoot;
      }
      return result;
    },
  };
}
