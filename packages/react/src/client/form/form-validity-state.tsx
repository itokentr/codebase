'use client';
import type { RefObject } from 'react';
import { useReducer } from 'react';
import { useLayoutEffect2 } from '../state/effect.tsx';
import { createValidityStateEntries } from './validity-state-entries.ts';

export type ElementWithValidity =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

export function useFormValidityState(
  { current: element }: RefObject<ElementWithValidity | null>,
  propName: 'className' | `data-${string}` = 'className',
  ...events: (keyof HTMLElementEventMap)[]
): void {
  if (events.length === 0) {
    events.push('change', 'blur');
  }
  interface State {
    readonly element: HTMLElement | null;
    readonly events: readonly (keyof HTMLElementEventMap)[];
    readonly handler: EventListener;
  }
  const [, setState] = useReducer<State | null, [State]>((prev, next) => {
    if (prev) {
      const { element, events, handler } = prev;
      for (const e of events) {
        element?.removeEventListener(e, handler);
      }
    }
    const { element, events, handler } = next;
    for (const e of events) {
      element?.addEventListener(e, handler);
    }
    return next;
  }, null);
  const handler: EventListener = (event): void => onChange(event, propName);
  // oxlint-disable-next-line typescript/no-deprecated
  useLayoutEffect2(() => {
    setState({ element, events, handler });
    return () => {
      for (const e of events) {
        element?.removeEventListener(e, handler);
      }
    };
  }, [element, ...events, handler]);
}

function onChange(
  event: Event,
  propName: `data-${string}` | 'className',
): void {
  const element = event.target as ElementWithValidity;
  const validity = createValidityStateEntries(element.validity);
  if (propName === 'className') {
    for (const [name, invalid] of validity) {
      element.classList.remove(name);
      if (invalid) {
        element.classList.add(name);
      }
    }
  } else {
    let value = '';
    for (const [name, invalid] of validity) {
      element.classList.remove(name);
      if (invalid) {
        value += `${value} ${name}`;
      }
      if (value) {
        element.setAttribute(propName, value.trim());
      } else {
        element.removeAttribute(propName);
      }
    }
  }
}
