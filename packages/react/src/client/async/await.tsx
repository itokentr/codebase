'use client';
import type { FunctionComponent, PropsWithChildren, ReactNode } from 'react';
import { Suspense, use } from 'react';
import type { SWRHook } from 'swr';

export type RenderAwaitedComponent<T> = FunctionComponent<
  PropsWithChildren<{ data: T }>
>;
export type RenderErrorComponent = FunctionComponent<{ error: unknown }>;
export type RenderLoadingComponent = FunctionComponent;

interface OptionsBase<T> {
  readonly children?: ReactNode;
  readonly complete?: RenderAwaitedComponent<T>;
  readonly error?: RenderErrorComponent;
  readonly loading?: RenderLoadingComponent | ReactNode;
  readonly promise: Promise<T>;
}

export interface AwaitProps<T> extends OptionsBase<T> {
  readonly cacheKey?: never;
  /** if specified, result of the promise will be cached by swr */
  readonly useSWR?: never;
}

export interface AwaitSwrProps<T> extends OptionsBase<T> {
  readonly cacheKey: string;
  /** if specified, result of the promise will be cached by swr */
  readonly useSWR: SWRHook;
}

export function Await<T>({
  cacheKey,
  children,
  complete,
  error,
  loading: Fallback,
  promise,
  useSWR,
}: AwaitProps<T> | AwaitSwrProps<T>): ReactNode {
  const promiseFallback = promise.catch(
    (e: unknown) => new PromiseRejectionReason(e),
  );
  return (
    <Suspense
      fallback={typeof Fallback === 'function' ? <Fallback /> : Fallback}
    >
      {useSWR ? (
        <SwrRenderer
          cacheKey={cacheKey}
          childNodes={children}
          complete={complete}
          error={error}
          fallback={Fallback}
          promise={promiseFallback}
          useSWR={useSWR}
        />
      ) : (
        <Renderer
          childNodes={children}
          complete={complete}
          error={error}
          promise={promiseFallback}
        />
      )}
    </Suspense>
  );
}

const fallbackData: unique symbol = Symbol();
class PromiseRejectionReason {
  readonly reason: unknown;

  constructor(reason: unknown) {
    this.reason = reason;
  }
}
type PromiseFallback<T> = Promise<T | PromiseRejectionReason>;

function renderCompleteContent<T>(
  data: T,
  children: ReactNode | undefined,
  Render: RenderAwaitedComponent<T> | undefined,
): ReactNode {
  if (Render != null) {
    return <Render data={data}>{children}</Render>;
  }
  if (data == null) {
    return undefined;
  }
  if (typeof data === 'object') {
    try {
      return JSON.stringify(data);
    } catch {
      //
    }
  }
  return String(data);
}

function renderErrorContent(
  error: unknown,
  Render: RenderErrorComponent | undefined,
): ReactNode {
  if (Render != null) {
    return <Render error={error} />;
  }
  throw error;
}

function renderContent<T>(
  value: T | PromiseRejectionReason,
  children: ReactNode,
  render: RenderAwaitedComponent<T> | undefined,
  renderError: RenderErrorComponent | undefined,
): ReactNode;
function renderContent<T>(
  value: T | PromiseRejectionReason | typeof fallbackData | undefined,
  children: ReactNode,
  render: RenderAwaitedComponent<T> | undefined,
  renderError: RenderErrorComponent | undefined,
  fallback: FunctionComponent | ReactNode | undefined,
): ReactNode;
function renderContent<T>(
  value: T | PromiseRejectionReason | typeof fallbackData | undefined,
  children: ReactNode,
  render: RenderAwaitedComponent<T> | undefined,
  renderError: RenderErrorComponent | undefined,
  Fallback?: FunctionComponent | ReactNode,
): ReactNode {
  if (value === fallbackData || value == null) {
    return typeof Fallback === 'function' ? <Fallback /> : Fallback;
  } else if (value instanceof PromiseRejectionReason) {
    return renderErrorContent(value.reason, renderError);
  } else {
    return renderCompleteContent(value, children, render);
  }
}

interface RendererProps<T> {
  readonly childNodes: ReactNode;
  readonly complete: RenderAwaitedComponent<T> | undefined;
  readonly error: RenderErrorComponent | undefined;
  readonly promise: PromiseFallback<T>;
}

function Renderer<T>({
  childNodes,
  complete,
  error,
  promise,
}: RendererProps<T>): ReactNode {
  const data = use(promise);
  return renderContent(data, childNodes, complete, error);
}

interface SwrRendererProps<T> {
  readonly cacheKey: string | undefined;
  readonly childNodes: ReactNode;
  readonly complete: RenderAwaitedComponent<T> | undefined;
  readonly error: RenderErrorComponent | undefined;
  readonly fallback: FunctionComponent | ReactNode | undefined;
  readonly promise: PromiseFallback<T>;
  readonly useSWR: SWRHook;
}

function SwrRenderer<T>({
  cacheKey,
  childNodes,
  complete,
  error,
  fallback,
  promise,
  useSWR: swrHook,
}: SwrRendererProps<T>): ReactNode {
  'use no memo';
  const { data } = swrHook(
    cacheKey,
    () => promise as Promise<T | PromiseRejectionReason | typeof fallbackData>,
    {
      fallbackData,
      suspense: true,
    },
  );
  return renderContent(data, childNodes, complete, error, fallback);
}
