import type { ReactNode } from 'react';

type AsyncableFlattenReactNode =
  | Exclude<ReactNode, Iterable<any>>
  | string;

export type FlattenReactNode = NonNullable<
  Exclude<AsyncableFlattenReactNode, Promise<any>>
>;

export type FlattenReactNodeArray = [FlattenReactNode, ...FlattenReactNode[]];

/** @throws {TypeError} provided argument contains a promise */
export function flatReactNode(
  node: ReactNode,
): FlattenReactNodeArray | null {
  if (node == null) {
    return null;
  }
  return finalizeFlattenNodes(flatSync(node));
}

export async function flatReactNodeAsync(
  node: ReactNode,
): Promise<FlattenReactNodeArray | null> {
  if (node == null) {
    return null;
  }
  return finalizeFlattenNodes(await flatAsync(node));
}

function isIterable(value: unknown): value is Iterable<unknown> {
  return value != null
    && typeof (value as Iterable<unknown>)[Symbol.iterator] === 'function';
}

function isPromise(value: unknown): value is Promise<unknown> {
  return value != null
    && typeof (value as Promise<any>).then === 'function';
}

function flatSync(node: NonNullable<ReactNode>): FlattenReactNode[] {
  if (isPromise(node)) {
    throw new TypeError('unable to handle a promise');
  }
  if (typeof node !== 'string' && isIterable(node)) {
    const result: FlattenReactNode[] = [];

    for (const item of node) {
      if (item == null) {
        continue;
      }
      result.push(...flatSync(item));
    }
    return result;
  }
  return [node];
}

async function flatAsync(
  node: NonNullable<ReactNode>,
): Promise<FlattenReactNode[]> {
  if (isPromise(node)) {
    const resolved = await node;

    if (resolved == null) {
      return [];
    }
    return flatAsync(resolved);
  }
  if (isIterable(node) && typeof node !== 'string') {
    const flattenNested: Promise<FlattenReactNode[]>[] = [];

    for (const item of Array.from(node)) {
      if (item == null) {
        continue;
      }
      flattenNested.push(flatAsync(item));
    }
    const resolved = await Promise.all(flattenNested);
    return resolved.flat();
  }
  return [node];
}

function finalizeFlattenNodes(
  nodes: FlattenReactNode[],
): FlattenReactNodeArray | null {
  if (nodes.length === 0) {
    return null;
  }
  return nodes as FlattenReactNodeArray;
}
