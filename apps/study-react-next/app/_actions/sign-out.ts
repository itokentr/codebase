'use server';
import { redirect } from 'next/navigation';
import { signOutCurrentUser } from '../_states/current-user.ts';
import type { ReducerNeverAction } from './types.ts';

export const signOut: ReducerNeverAction = async () => {
  await signOutCurrentUser();
  redirect('/', 'push');
};
