'use client';
import { Autocomplete as Base } from '@lib/react/base-ui/form/autocomplete';
import { classNames } from '@lib/react/client/dom';
import type { GetOptions, Option } from '@lib/react/client/form';
import type { PaginationRequest, PaginationResponse } from '@lib/types';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import type { JSX, ReactElement } from 'react';
import { useRef, useState, useTransition } from 'react';
import { ScrollPane } from '../scroll-pane.tsx';
import styles from './autocomplete.module.css';

export type SearchOptions = (
  keyword: string,
  request: PaginationRequest,
) => Promise<PaginationResponse<Option>>;

export interface AutocompleteProps extends
  Omit<
    Base.Props,
    'autocomplete' | 'classNames'
  > {
  readonly searchOptions: SearchOptions;
}

export function Autocomplete({
  className,
  searchOptions,
  ...props
}: AutocompleteProps): ReactElement {
  const [hasNext, setHasNext] = useState(false);
  const [pending, startTransition] = useTransition();
  const optionsIndexRef = useRef<number>(-1);
  const prevInputRef = useRef<string>(null);
  const getOptions: GetOptions = function getOptions({ input, options }) {
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    const { promise, reject, resolve } = Promise.withResolvers<void>();
    startTransition(async () => {
      try {
        const changed = input !== prevInputRef.current;
        prevInputRef.current = input;
        if (changed) {
          optionsIndexRef.current = 0;
        } else {
          optionsIndexRef.current += 1;
        }
        const { hasNext, items } = await searchOptions(input, {
          index: optionsIndexRef.current,
          itemsPerPage: 10,
        });
        if (changed) {
          options.set(...items);
        } else {
          options.push(...items);
        }
        setHasNext(hasNext);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
    return promise;
  };
  const autocompleteOptions: Base.Props['autocomplete'] = { getOptions };
  return (
    <Base
      {...props}
      autocomplete={autocompleteOptions}
      className={classNames(className, styles.Root)}
    >
      <Base.SelectedOptions
        keyNavigation={Base.KeyNavigation.NextRight}
        renderItem={renderSelectedOption}
        render={renderSelectedOptions}
      />
      <Base.ClearButton aria-label='消去する' className={styles.Clear}>
        <ClearIcon />
      </Base.ClearButton>
      <hr className={styles.Separator} />
      <Base.OpenButton aria-label='検索する' className={styles.Submit}>
        <SearchIcon />
      </Base.OpenButton>
      <Base.Popup className={styles.Popup}>
        <ScrollPane className={styles.PopupContent}>
          <Base.Options
            aria-busy={pending}
            keyNavigation={Base.KeyNavigation.PrevUp}
            className={styles.Options}
            renderItem={renderOption}
          />
          {!hasNext ? undefined : (
            <div className={styles.Loading}>
              <CircularProgress size={16} thickness={4.6} />
            </div>
          )}
        </ScrollPane>
      </Base.Popup>
    </Base>
  );
}

const renderOption: Base.RenderOptionItem = function({ label, ...props }) {
  return (
    <button
      {...(props as JSX.IntrinsicElements['button'])}
      className={styles.Option}
      type='button'
    >
      {label}
    </button>
  );
};

const renderSelectedOption: Base.RenderOptionItem = function({
  label,
  ...props
}) {
  return (
    <button
      {...(props as JSX.IntrinsicElements['button'])}
      className={styles.Option}
      type='button'
    >
      <span className={styles.Label}>{label}</span>
      <span className={styles.Remove}>
        <ClearIcon />
      </span>
    </button>
  );
};

function renderSelectedOptions({
  children,
  ...props
}: Parameters<
  Extract<Base.SelectedOptions.Props['render'], (...args: never) => unknown>
>[0]): ReactElement {
  return (
    <div {...props} className={styles.SelectedOptions}>
      {children}
      <div className={styles.Input}>
        <Base.Input
          className={styles.Ctrl}
          keyNavigation={Base.KeyNavigation.flags(
            Base.KeyNavigation.NextDown,
            Base.KeyNavigation.PrevLeft,
          )}
        />
      </div>
    </div>
  );
}
