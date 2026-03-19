'use client';
import type {
  KeyboardEvent,
  KeyboardEventHandler,
  PropsWithChildren,
  ReactElement,
  RefObject,
} from 'react';
import { useRef, useState } from 'react';
import { createValueProvider } from '../../../client/state/value-provider.tsx';

export function KeyboardEventHandlerProvider({
  children,
}: PropsWithChildren): ReactElement {
  const [componentSequence] = useState(() => new Map<string, FocusableRefs>());
  // eslint-disable-next-line react-naming-convention/ref-name
  const keyEventHandledBy = useRef<HTMLElement | null>(null);
  return (
    <DefaultContextProvider value={{ componentSequence, keyEventHandledBy }}>
      {children}
    </DefaultContextProvider>
  );
}

export class KeyNavigation extends Number {
  static readonly NextLeft = new this(1 << 0);
  static readonly NextRight = new this(1 << 1);
  static readonly NextUp = new this(1 << 2);
  static readonly NextDown = new this(1 << 3);
  static readonly PrevLeft = new this(1 << 4);
  static readonly PrevRight = new this(1 << 5);
  static readonly PrevUp = new this(1 << 6);
  static readonly PrevDown = new this(1 << 7);

  private constructor(value: number) {
    super(value);
  }

  static flags(
    value: KeyNavigation,
    ...values: readonly KeyNavigation[]
  ): KeyNavigation {
    return new KeyNavigation(
      (values as number[]).reduce((prev, curr) => prev | curr, value as number),
    );
  }

  static flagged(flags: KeyNavigation, flag: KeyNavigation): boolean {
    return 0 !== ((flags as number) & (flag as number));
  }
}

export interface KeyboardEventHandlerOptions {
  readonly componentName: string;
  readonly keyNavigation: KeyNavigation | null;
  readonly targetRef: RefObject<HTMLElement | null>;
}

export function useKeyboardEventHandler(
  options: KeyboardEventHandlerOptions,
): KeyboardEventHandler {
  return useKeyboardEventHandlerInternal(options);
}

export interface ToolbarKeyboardEventHandlerOptions
  extends KeyboardEventHandlerOptions {
  readonly firstItemRef: RefObject<HTMLElement | null>;
  readonly lastItemRef: RefObject<HTMLElement | null>;
}

export function useToolbarKeyboardEventHandler(
  options: ToolbarKeyboardEventHandlerOptions,
): KeyboardEventHandler {
  return useKeyboardEventHandlerInternal(options);
}

interface Context {
  readonly componentSequence: Map<string, FocusableRefs>;
  readonly keyEventHandledBy: RefObject<HTMLElement | null>;
}
interface FocusableRefs {
  readonly firstItemRef: RefObject<HTMLElement | null> | null;
  readonly lastItemRef: RefObject<HTMLElement | null> | null;
  readonly targetRef: RefObject<HTMLElement | null>;
}
type Key = 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'ArrowUp';

const [DefaultContextProvider, useMyContext] = createValueProvider<Context>();

function getKeyboardKey(
  keyNavigation: KeyNavigation,
  target: HTMLElement,
): [Key | undefined, Key | undefined] {
  let keyToPrev: Key | undefined;
  let keyToNext: Key | undefined;
  let next = 0;
  let prev = 0;
  const input =
    target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
      ? target
      : null;
  if (KeyNavigation.flagged(keyNavigation, KeyNavigation.NextDown)) {
    keyToNext = 'ArrowDown';
    next++;
  }
  if (KeyNavigation.flagged(keyNavigation, KeyNavigation.NextUp)) {
    keyToNext = 'ArrowUp';
    next++;
  }
  if (KeyNavigation.flagged(keyNavigation, KeyNavigation.NextLeft)) {
    if (input?.selectionStart == null || input.selectionStart === 0) {
      keyToNext = 'ArrowLeft';
    }
    next++;
  }
  if (KeyNavigation.flagged(keyNavigation, KeyNavigation.NextRight)) {
    if (
      input?.selectionEnd == null
      || input.selectionEnd === input.value.length - 1
    ) {
      keyToNext = 'ArrowRight';
    }
    next++;
  }
  if (KeyNavigation.flagged(keyNavigation, KeyNavigation.PrevDown)) {
    keyToPrev = 'ArrowDown';
    prev++;
  }
  if (KeyNavigation.flagged(keyNavigation, KeyNavigation.PrevUp)) {
    keyToPrev = 'ArrowUp';
    prev++;
  }
  if (KeyNavigation.flagged(keyNavigation, KeyNavigation.PrevLeft)) {
    if (input?.selectionStart == null || input.selectionStart === 0) {
      keyToPrev = 'ArrowLeft';
    }
    prev++;
  }
  if (KeyNavigation.flagged(keyNavigation, KeyNavigation.PrevRight)) {
    if (
      input?.selectionEnd == null
      || input.selectionEnd === input.value.length - 1
    ) {
      keyToPrev = 'ArrowRight';
    }
    prev++;
  }
  if (next > 1 || prev > 1) {
    throw TypeError('cannot combine two or more keys for same navigation');
  }
  return [keyToPrev, keyToNext];
}

function getNextComponentRef<T extends FocusableRefs>(
  componentName: string,
  sequence: ReadonlyMap<string, T>,
): T | null {
  let found = false;
  for (const [name, refs] of sequence) {
    if (found) {
      return refs;
    }
    if (name === componentName) {
      found = true;
    }
  }
  return null;
}

function getPrevComponentRef<T extends FocusableRefs>(
  componentName: string,
  sequence: ReadonlyMap<string, T>,
): T | null {
  let prev: T | null = null;
  for (const [name, refs] of sequence) {
    if (name === componentName) {
      return prev;
    }
    prev = refs;
  }
  return null;
}

function hasToolbarOptions(
  options: KeyboardEventHandlerOptions | ToolbarKeyboardEventHandlerOptions,
): options is ToolbarKeyboardEventHandlerOptions {
  return !!(options as Partial<ToolbarKeyboardEventHandlerOptions>)
    .firstItemRef;
}

function useKeyboardEventContext(
  options: KeyboardEventHandlerOptions | ToolbarKeyboardEventHandlerOptions,
): Context {
  const { componentName } = options;
  const { componentSequence, keyEventHandledBy } = useMyContext();
  componentSequence.delete(componentName);
  componentSequence.set(
    componentName,
    hasToolbarOptions(options)
      ? { ...options }
      : { firstItemRef: null, lastItemRef: null, ...options },
  );
  return { componentSequence, keyEventHandledBy };
}

function useKeyboardEventHandlerInternal(
  options: KeyboardEventHandlerOptions | ToolbarKeyboardEventHandlerOptions,
): KeyboardEventHandler {
  const { componentSequence } = useKeyboardEventContext(options);
  const handleToolbarKeyboardEvent = function handleToolbarKeyboardEvent(
    event: KeyboardEvent,
  ): void {
    const { componentName, keyNavigation, targetRef } = options;
    const target = event.target as HTMLElement;
    const focused = target.ownerDocument.activeElement;
    if (
      keyNavigation === null
      || !focused
      || !(focused === targetRef.current
        || targetRef.current?.contains(focused))
    ) {
      return;
    }
    for (const [name, refs] of componentSequence.entries()) {
      const exclude = refs.targetRef.current;
      if (!exclude || name === componentName) {
        continue;
      }
      if (target === exclude || target.contains(exclude)) {
        return;
      }
    }
    const [keyToPrev, keyToNext] = getKeyboardKey(keyNavigation, target);
    let focusTo: RefObject<HTMLElement | null> | undefined;
    let toNext = false;
    switch (event.key) {
      case keyToNext: {
        let nextRefs: FocusableRefs | null | undefined;
        if (hasToolbarOptions(options)) {
          const { lastItemRef } = options;
          if (
            lastItemRef.current === focused
            || lastItemRef.current?.contains(focused)
          ) {
            nextRefs = getNextComponentRef(componentName, componentSequence);
          }
        } else {
          nextRefs = getNextComponentRef(componentName, componentSequence);
        }
        focusTo = nextRefs?.firstItemRef ?? nextRefs?.targetRef;
        toNext = true;
        break;
      }
      case keyToPrev: {
        let prevRefs: FocusableRefs | null | undefined;
        if (hasToolbarOptions(options)) {
          const { firstItemRef } = options;
          if (
            firstItemRef.current === focused
            || firstItemRef.current?.contains(focused)
          ) {
            prevRefs = getPrevComponentRef(componentName, componentSequence);
          }
        } else {
          prevRefs = getPrevComponentRef(componentName, componentSequence);
        }
        focusTo = prevRefs?.lastItemRef ?? prevRefs?.targetRef;
        break;
      }
    }
    if (focusTo?.current) {
      const element = focusTo.current;
      event.preventDefault();
      event.stopPropagation();
      element.focus();
      if (element instanceof HTMLInputElement) {
        if (toNext) {
          element.setSelectionRange(0, 0);
        } else {
          element.setSelectionRange(element.value.length, element.value.length);
        }
      }
    }
  };
  return handleToolbarKeyboardEvent;
}
