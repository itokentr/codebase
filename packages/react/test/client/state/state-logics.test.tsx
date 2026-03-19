// oxlint-disable react-x/component-hook-factories
import type { ReducerFunctions, StateLogics } from '@lib/react/client/state';
import { createStateLogics } from '@lib/react/client/state';
import { cleanup, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { startTransition } from 'react';
import { afterEach, describe, expect, it } from '../../import.ts';

describe(`sync usage`, () => {
  const handlers = {
    double(state) {
      return state * 2;
    },
    half(state) {
      return state / 2;
    },
    set(_state, newValue: number) {
      return newValue;
    },
  } satisfies ReducerFunctions<number>;
  type A = StateLogics<number, typeof handlers>;
  const useStateActions = createStateLogics(1, handlers);
  function Parent(): ReactNode {
    const [state, actions] = useStateActions();
    return <Child actions={actions} state={state} />;
  }
  function Child({ actions, state }: { actions: A; state: number }): ReactNode {
    function double(): void {
      actions.double();
    }
    function half(): void {
      actions.half();
    }
    function set(): void {
      actions.set(100);
    }
    return (
      <>
        <p title="text">{state}</p>
        <button onClick={double} type="button">
          double
        </button>
        <button onClick={half} type="button">
          half
        </button>
        <button onClick={set} type="button">
          set
        </button>
      </>
    );
  }
  afterEach(() => {
    cleanup();
  });
  it(`passing initial value to child`, () => {
    const { getByTitle } = render(<Parent />);
    expect(getByTitle('text')).toHaveTextContent('1');
  });
  it(`double the initial value`, async () => {
    const { getByText, getByTitle } = render(<Parent />);
    await userEvent.click(getByText(`double`));
    expect(getByTitle('text')).toHaveTextContent('2');
  });
  it(`again, double the previous value`, async () => {
    const { getByText, getByTitle } = render(<Parent />);
    await userEvent.click(getByText(`double`));
    expect(getByTitle('text')).toHaveTextContent('4');
  });
  it(`half the previous value`, async () => {
    const { getByText, getByTitle } = render(<Parent />);
    await userEvent.click(getByText(`half`));
    expect(getByTitle('text')).toHaveTextContent('2');
  });
  it(`set`, async () => {
    const { getByText, getByTitle } = render(<Parent />);
    await userEvent.click(getByText(`set`));
    expect(getByTitle('text')).toHaveTextContent('100');
  });
});

describe(`async usage`, () => {
  function sleep(msec: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, msec));
  }
  const handlers = {
    async double(state) {
      await sleep(100);
      return state * 2;
    },
    async half(state) {
      await sleep(100);
      return state / 2;
    },
    async set(_state, newValue: number, delay: number) {
      await sleep(delay);
      return newValue;
    },
  } satisfies ReducerFunctions<number>;
  type A = StateLogics<number, typeof handlers>;
  const useStateActions = createStateLogics(1, handlers);
  function Parent(): ReactNode {
    const [state, actions] = useStateActions();
    return <Child actions={actions} state={state} />;
  }
  function Child({ actions, state }: { actions: A; state: number }): ReactNode {
    function double(): void {
      startTransition(() => actions.double());
    }
    function half(): void {
      startTransition(() => actions.half());
    }
    function set100Slow(): void {
      startTransition(() => actions.set(100, 100));
    }
    function set200Fast(): void {
      startTransition(() => actions.set(200, 50));
    }
    return (
      <>
        <p title="text">{state}</p>
        <button onClick={double} type="button">
          double
        </button>
        <button onClick={half} type="button">
          half
        </button>
        <button onClick={set100Slow} type="button">
          set to 100 slow
        </button>
        <button onClick={set200Fast} type="button">
          set to 200 fast
        </button>
      </>
    );
  }
  afterEach(() => {
    cleanup();
  });
  it(`double the initial value`, async () => {
    const { findByText, getByText } = render(<Parent />);
    await userEvent.click(getByText(`double`));
    await expect(findByText(`2`)).resolves.not.toThrow();
  });
  it(`again, double the previous value`, async () => {
    const { findByText, getByText } = render(<Parent />);
    await userEvent.click(getByText(`double`));
    await expect(findByText(`4`)).resolves.not.toThrow();
  });
  it(`half the value`, async () => {
    const { findByText, getByText } = render(<Parent />);
    await userEvent.click(getByText(`half`));
    await expect(findByText(`2`)).resolves.not.toThrow();
  });
  it(`wait while the previous reducer is pending`, async () => {
    const { findByText, getByText } = render(<Parent />);
    await userEvent.click(getByText(`set to 100 slow`));
    await userEvent.click(getByText(`set to 200 fast`));
    await expect(findByText(`100`)).resolves.not.toThrow();
  });
});
