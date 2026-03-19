import { useUncaughtError } from '@lib/react/client/state';
import { cleanup, render, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { ReactNode } from 'react';
import type { FallbackProps } from 'react-error-boundary';
import { ErrorBoundary } from 'react-error-boundary';
import { afterEach, assert, test } from '../../import.ts';

function fallbackRender({ error }: FallbackProps): ReactNode {
  return <p>{String(error)}</p>;
}

function Root(): ReactNode {
  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <Parent />
    </ErrorBoundary>
  );
}

function Parent(): ReactNode {
  useUncaughtError();
  return (
    <>
      <Child1 />
      <Child2 />
    </>
  );
}

function Child1(): ReactNode {
  function onClick(): void {
    throw Error(`child 1 throws an error in sync code`);
  }
  return (
    <>
      <button onClick={onClick} type="button">
        by child 1
      </button>
    </>
  );
}

function Child2(): ReactNode {
  function onClick(): void {
    throw Error(`child 2 throws an error in async code`);
  }
  return (
    <>
      <button onClick={onClick} type="button">
        by child 2
      </button>
    </>
  );
}

afterEach(() => {
  cleanup();
});

test(`parent`, async () => {
  const { getByText, findAllByText } = render(<Root />);
  await userEvent.click(getByText(`by child 1`));
  assert.equal(
    await waitFor(() =>
      findAllByText(`Error: child 1 throws an error in sync code`).then(
        ({ length }) => length,
      ),
    ),
    1,
  );
});

test(`child`, async () => {
  const { getByText, findAllByText } = render(<Root />);
  await userEvent.click(getByText(`by child 2`));
  assert.equal(
    await waitFor(() =>
      findAllByText(`Error: child 2 throws an error in async code`).then(
        ({ length }) => length,
      ),
    ),
    1,
  );
});
