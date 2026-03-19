// oxlint-disable react-x/component-hook-factories typescript/no-deprecated
import { useCollectionChanges } from '@lib/react/client/state';
import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FunctionComponent, ReactNode } from 'react';
import { beforeEach, describe, expect, it } from '../../import.ts';

describe('map', () => {
  const collection = new Map<string, string>();
  type Result = ReturnType<typeof useCollectionChanges<typeof collection>>;
  let Button: FunctionComponent<{ result: Result }> | undefined;
  let Content: FunctionComponent<{ result: Result }> | undefined;

  function useCollection(): ReturnType<
    typeof useCollectionChanges<typeof collection>
  > {
    return useCollectionChanges(collection);
  }
  function Root(): ReactNode {
    const result = useCollection();
    if (!Button || !Content) {
      throw Error('Button and Content should be defined');
    }
    return (
      <>
        <Button result={result} />
        <Content result={result} />
      </>
    );
  }
  beforeEach(() => {
    Button = undefined;
    Content = undefined;
    collection.clear();
    cleanup();
  });
  it('set() should success', async () => {
    const buttonLabel = 'click';
    const key = Math.random().toString();
    let set = 0;

    Button = function Button({ result: [col] }) {
      function onClick(): void {
        col.set(key, String(++set));
      }
      return (
        <button type="button" onClick={onClick}>
          {buttonLabel}
        </button>
      );
    };
    Content = function Content({ result: [col] }) {
      return (
        <>
          <div title="size">{col.size}</div>
          <div title="value">{col.get(key)}</div>
        </>
      );
    };
    const { getByText, getByTitle } = render(<Root />);
    expect(getByTitle('size')).toHaveTextContent('0');
    expect(getByTitle('value')).toHaveTextContent('');
    expect(collection.size).toBe(0);
    expect(collection.get(key)).toBeUndefined();
    await userEvent.click(getByText(buttonLabel));
    expect(getByTitle('size')).toHaveTextContent('1');
    expect(getByTitle('value')).toHaveTextContent('1');
    expect(collection.size).toBe(1);
    expect(collection.get(key)).toBe('1');
    await userEvent.click(getByText(buttonLabel));
    expect(getByTitle('size')).toHaveTextContent('1');
    expect(getByTitle('value')).toHaveTextContent('2');
    expect(collection.size).toBe(1);
    expect(collection.get(key)).toBe('2');
  });
});
