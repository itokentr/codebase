'use client';
import type { ActionDispatch } from 'react';
import { useReducer } from 'react';

export function useRender(): ActionDispatch<[]> {
  return useReducer(Math.random, 0)[1];
}
