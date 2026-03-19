import type { BuildOptions } from 'esbuild';
import { build as esbuild } from 'esbuild';

export async function build<const T extends BuildOptions>({
  banner,
  ...options
}: T): Promise<ReturnType<typeof esbuild<T>>> {
  const createRequireName = `r${Math.random().toString(36).substring(2, 7)}`;
  const result = await esbuild<BuildOptions>({
    banner: {
      ...banner,
      js:
        (banner?.['js'] ?? '') +
        `import{createRequire as ${createRequireName}}from'node:module';` +
        `const require=${createRequireName}(import.meta.url);` +
        'const __filename=import.meta.filename;' +
        'const __dirname=import.meta.dirname;',
    },
    bundle: true,
    format: 'esm',
    legalComments: 'external',
    minify: true,
    platform: 'node',
    target: ['node24'],
    ...options,
  });
  return result;
}
