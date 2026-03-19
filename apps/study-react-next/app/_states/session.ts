'use server';
import { cookies } from 'next/headers';
import { cache } from 'react';

const COOKIE_NAME = 'session';
const sessions = new Map<string, string>();

export async function createSession(
  userId: string,
  keepSession: boolean,
): Promise<void> {
  const expires = keepSession
    ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    : undefined;
  const sessionId = Math.random().toString(36).substring(2);
  const store = await cookies();
  store.set(COOKIE_NAME, sessionId, {
    expires,
    httpOnly: true,
    path: '/',
    secure: false,
  });
  sessions.set(sessionId, userId);
}

export async function deleteSession(): Promise<void> {
  const sessionId = await getSession();
  if (sessionId) {
    const store = await cookies();
    store.delete(COOKIE_NAME);
    sessions.delete(sessionId);
  }
}

export const getSession = cache(async (): Promise<string | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const store = await cookies();
  const sessionId = store.get(COOKIE_NAME)?.value;
  return sessionId ? (sessions.get(sessionId) ?? null) : null;
});
