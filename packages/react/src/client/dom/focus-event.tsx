'use client';
import type {
  FocusEvent,
  FocusEventHandler,
  PropsWithChildren,
  ReactElement,
  RefObject,
} from 'react';
import { useEffect, useState } from 'react';
import { createValueProvider } from '../state/value-provider.tsx';

export function FocusEventHandlerProvider({
  children,
}: PropsWithChildren): ReactElement {
  const [emitter] = useState(() => new EventTarget());
  return <Provider value={emitter}>{children}</Provider>;
}

export function useFocusInEvent(handler: EventListener): void {
  const emitter = useEmitter();
  useEffect(() => {
    const listener = (({
      detail: { nativeEvent },
    }: CustomEvent<FocusEvent>): void => handler(nativeEvent)) as EventListener;
    emitter.addEventListener(FOCUS_IN, listener);
    return () => emitter.removeEventListener(FOCUS_IN, listener);
  }, [emitter, handler]);
}

export function useFocusInHandler(
  ref: RefObject<HTMLElement | null>,
): FocusEventHandler {
  const emitter = useEmitter();
  const onFocusIn = function onFocusIn(event: FocusEvent): void {
    const { current: target } = ref;
    if (
      !!target &&
      (target === event.target || target.contains(event.target as HTMLElement))
    ) {
      emitter.dispatchEvent(new InternalEvent(FOCUS_IN, event));
    }
  };
  return onFocusIn;
}

export function useFocusOutEvent(handler: EventListener): void {
  const emitter = useEmitter();
  useEffect(() => {
    const listener = (({
      detail: { nativeEvent },
    }: CustomEvent<FocusEvent>): void => handler(nativeEvent)) as EventListener;
    emitter.addEventListener(FOCUS_OUT, listener);
    return () => emitter.removeEventListener(FOCUS_OUT, listener);
  }, [emitter, handler]);
}

export function useFocusOutHandler(
  ref: RefObject<HTMLElement | null>,
): FocusEventHandler {
  const emitter = useEmitter();
  const onFocusOut = function onFocusOut(event: FocusEvent): void {
    const { current: target } = ref;
    if (
      !!target &&
      target !== event.relatedTarget &&
      !target.contains(event.relatedTarget as HTMLElement)
    ) {
      emitter.dispatchEvent(new InternalEvent(FOCUS_OUT, event));
    }
  };
  return onFocusOut;
}

const [Provider, useEmitter] = createValueProvider<EventTarget>();

type InternalEventType = 'focusin' | 'focusout';
const FOCUS_IN: InternalEventType = 'focusin';
const FOCUS_OUT: InternalEventType = 'focusout';

class InternalEvent extends CustomEvent<FocusEvent> {
  constructor(type: InternalEventType, event: FocusEvent) {
    super(type, { detail: event });
  }
}
