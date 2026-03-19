import type { AbsolutePath, RelativePath } from '@lib/path';
import path from '@lib/path';
import { findUp } from 'find-up';
import { readFile } from 'node:fs/promises';
import json from '../../package.json' with { type: 'json' };

const packageDir = findUp('package.json', { cwd: import.meta.dirname }).then(
  (name) => path.dirname(name as AbsolutePath),
);

export type DepName = keyof (typeof json)['devDependencies'];
export type DepType = '' | 'dev' | 'optional' | 'peer' | 'peer-optional';

export interface Options<K extends DepName> {
  readonly deps: readonly K[];
  readonly meta?:
    | {
        readonly [T in K]?: { readonly type: DepType } | undefined;
      }
    | undefined;
  readonly type?: DepType | undefined;
}

export type Dependencies = {
  readonly [K in DepName]: {
    readonly type: DepType;
    readonly version: string;
  };
};

export function pickDependencies<K extends DepName>({
  deps,
  meta,
  type,
}: Options<K>): Dependencies {
  const ret = {} as Dependencies;

  for (const name of deps) {
    (ret[name] as Dependencies[K]) = {
      type: meta?.[name]?.type ?? type ?? '',
      version: json.devDependencies[name],
    };
  }
  return ret;
}

export async function readPackageFile(name: RelativePath): Promise<string> {
  return readFile(path.resolve(await packageDir, name), { encoding: 'utf8' });
}
