'use server';
import type { ToTypedFormDataMap, TypedFormData } from '@lib/types/app/form';
import { FormValidationError } from '@lib/types/app/form';
import type { SignInCurrentUserErrors } from '../_states/current-user.ts';
import { signInCurrentUser } from '../_states/current-user.ts';
import type { CurrentUser } from '../_types/current-user.ts';
import type { ActionState, ReducerAction } from './types.ts';

export type SignInFormControls = ToTypedFormDataMap<{
  email: string;
  keepSession: string;
  password: string;
}>;

type SignInFormData = TypedFormData<SignInFormControls>;
type ValidationError = SignInCurrentUserErrors;

export type State = ActionState<CurrentUser, ValidationError>;

export const signIn: ReducerAction<State | undefined, FormData> = async (
  _,
  formData,
) => {
  const form = formData as SignInFormData;
  const email = form.get('email');
  const keepSession = form.get('keepSession') === 'on';
  const password = form.get('password');
  try {
    const data = await signInCurrentUser({ email, keepSession, password });
    return { data, success: true };
  } catch (e) {
    if (e instanceof FormValidationError) {
      return { errors: e.errors, success: false };
    }
    throw e;
  }
};
