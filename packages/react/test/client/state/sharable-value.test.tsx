import type { SharingKey } from '@lib/react/client/state';
import {
  createSharingKey,
  setSharedValue,
  useSharableValue,
} from '@lib/react/client/state';
import { cleanup, render, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { afterEach, assert, test } from '../../import.ts';

const sharingKey = createSharingKey('Parent');

function Parent({ shky }: { shky: SharingKey<string> }): ReactNode {
  return (
    <>
      <ComponentA shky={shky} />
      <ComponentB shky={shky} />
    </>
  );
}

function ComponentA({ shky }: { shky: SharingKey<string> }): ReactNode {
  const [value, setValue] = useSharableValue(shky);
  function onClick(): void {
    setValue('ComponentA');
  }
  return (
    <>
      <p>{value}</p>
      <button onClick={onClick} type="button">
        change by a
      </button>
    </>
  );
}

function ComponentB({ shky }: { shky: SharingKey<string> }): ReactNode {
  const [value, setValue] = useSharableValue(shky);
  function onClick(): void {
    setValue('ComponentB');
  }
  return (
    <>
      <p>{value}</p>
      <button onClick={onClick} type="button">
        change by b
      </button>
    </>
  );
}

afterEach(() => {
  cleanup();
});

test('passing initial value to children', () => {
  const { getAllByText } = render(<Parent shky={sharingKey} />);
  assert.equal(getAllByText('Parent').length, 2);
});

test('change by child a', async () => {
  const { getAllByText, getByText } = render(<Parent shky={sharingKey} />);
  await userEvent.click(getByText('change by a'));
  assert.equal(getAllByText('ComponentA').length, 2);
});

test('change by child b', async () => {
  const { getAllByText, getByText } = render(<Parent shky={sharingKey} />);
  await userEvent.click(getByText('change by b'));
  assert.equal(getAllByText('ComponentB').length, 2);
});

test('change by non react code', async () => {
  const { findAllByText } = render(<Parent shky={sharingKey} />);
  setSharedValue(sharingKey, 'Non React Code');
  assert.equal(
    await waitFor(() =>
      findAllByText('Non React Code').then(({ length }) => length),
    ),
    2,
  );
});
