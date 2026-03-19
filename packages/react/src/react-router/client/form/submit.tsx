'use client';
import type { RefObject, SubmitEvent } from 'react';
import type { HTMLFormMethod } from 'react-router';
import { useFetcher } from 'react-router';

export type FetcherStates<T> = Pick<
  ReturnType<typeof useFetcher<T>>,
  | 'data'
  | 'formAction'
  | 'formData'
  | 'formEncType'
  | 'formMethod'
  | 'json'
  | 'state'
  | 'text'
>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormAction = (...args: any) => any;
export type OnSubmit = (event: SubmitEvent) => Promise<void>;

/** @template T type of `clientAction` */
export function useOnSubmit<T extends FormAction>(
  formRef: RefObject<HTMLFormElement | null>,
  method: HTMLFormMethod = 'POST',
): [OnSubmit, FetcherStates<Exclude<Awaited<ReturnType<T>>, Response>>] {
  const fetcher = useFetcher<Exclude<Awaited<ReturnType<T>>, Response>>();
  const onSubmit: OnSubmit = async (event) => {
    event.preventDefault();
    await fetcher.submit(formRef.current, { method });
  };
  return [onSubmit, fetcher];
}
