'use server';
import type { FormValidationErrors } from '@lib/types/app/form';
import { FormValidationError } from '@lib/types/app/form';
import { unauthorized } from 'next/navigation';
import assert from 'node:assert/strict';
import { cache } from 'react';
import type { CurrentUser } from '../_types/current-user.ts';
import { createSession, deleteSession, getSession } from './session.ts';

const users = new Map<string, CurrentUser>();

async function _getCurrentUser(redirect?: true): Promise<CurrentUser>;
async function _getCurrentUser(redirect: false): Promise<CurrentUser | null>;
async function _getCurrentUser(r = true): Promise<CurrentUser | null> {
  const userId = await getSession();
  if (!userId) {
    if (r) {
      unauthorized();
    }
    return null;
  }
  const user = users.get(userId);
  assert.ok(user, 'unexpected undefined current-user');
  return user;
}

export const getCurrentUser = cache(_getCurrentUser);

export interface SignInCurrentUserOptions {
  readonly email: string | null | undefined;
  readonly keepSession: boolean;
  readonly password: string | null | undefined;
}
export type SignInCurrentUserErrors = FormValidationErrors<
  SignInCurrentUserOptions
>;

export async function signInCurrentUser({
  email,
  keepSession,
}: SignInCurrentUserOptions): Promise<CurrentUser> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (!email || email.includes('error')) {
    throw new FormValidationError<SignInCurrentUserOptions>({
      email: ['invalid email'],
    });
  }
  const user: CurrentUser = {
    email,
    id: '123',
    name: 'John Doe',
  };
  await createSession(user.id, keepSession);
  users.set(user.id, user);
  return user;
}

export async function signOutCurrentUser(): Promise<void> {
  const user = await getCurrentUser(false);

  if (!user) {
    return;
  }
  users.delete(user.id);
  await deleteSession();
}
