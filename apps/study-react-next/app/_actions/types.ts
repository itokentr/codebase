import type { FormValidationErrors } from '@lib/types/app/form';
import type { useActionState } from 'react';

export type SucceededState<T> = {
  errors?: never;
  data: T;
  message?: string;
  success: true;
};

export type FailedState<E extends FormValidationErrors<any>> = {
  errors: E;
  data?: never;
  message?: string;
  success: false;
};

export type ActionState<T, E extends FormValidationErrors<any>> =
  | SucceededState<T>
  | FailedState<E>;

export type ReducerAction<State, Payload> = Parameters<
  typeof useActionState<State, Payload>
>[0];

export type ReducerNeverAction = { (...args: any): never | Promise<never> };
