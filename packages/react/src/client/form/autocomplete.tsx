'use client';
import pDebounce from 'p-debounce';
import { useEffect, useSyncExternalStore } from 'react';
import { useValueRef } from '../state/value-ref.tsx';
import type { Option } from './element-types.ts';
import { optionId, optionsEqual } from './element-types.ts';

export interface Autocomplete {
  readonly onInputChange: OnInputChange;
  readonly options: Options;
  readonly selectedOptions: Options;
}

export interface GetOptionsParams {
  readonly input: string;
  readonly options: Options;
  readonly signal: AbortSignal;
}

export type GetOptions = (params: GetOptionsParams) => Promise<void>;

export interface OnInputChangeOptions {
  readonly callback?: () => void;
  readonly value: string;
}
export type OnInputChange = (options: OnInputChangeOptions) => void;

export interface Options extends ReadonlyArray<Option> {
  maxLength: number;
  clear(): void;
  delete(...options: readonly Option[]): number;
  has(optionOrId: Option | string, start?: number): boolean;
  push(...options: readonly Option[]): number;
  set(...options: readonly Option[]): number;
}

export interface UseAutocompleteParams {
  /** @default 200 */
  readonly debounceTime?: number;
  readonly defaultOptions?: readonly Option[];
  readonly defaultSelectedOptions?: readonly Option[];
  readonly getOptions: GetOptions;
  readonly maxOptions?: number;
  readonly maxSelectedOptions?: number;
}

export function useAutocomplete({
  debounceTime = 200,
  defaultOptions,
  defaultSelectedOptions,
  getOptions,
  maxOptions,
  maxSelectedOptions: maxSelected,
}: UseAutocompleteParams): Autocomplete {
  const options = useOptions(defaultOptions, maxOptions);
  const selectedOptions = useOptions(defaultSelectedOptions, maxSelected);
  const abortRef = useValueRef<AbortController | null>(null);
  const doGetOptions = async ({
    callback,
    value: input,
  }: OnInputChangeOptions): Promise<void> => {
    abortRef.value?.abort();
    const abort = new AbortController();
    abortRef.set(abort);
    try {
      await getOptions({ input, options, signal: abort.signal });
      // do not use optional chain `?.` due to react compiler limitation.
      if (callback) {
        callback();
      }
    } catch (e) {
      if (
        !(
          e instanceof DOMException
          // oxlint-disable-next-line typescript/no-deprecated
          && (e.name === 'AbortError' || e.code === DOMException.ABORT_ERR)
        )
      ) {
        throw e;
      }
    }
  };
  const getOptionsDebounced = pDebounce(doGetOptions, debounceTime);
  const onInputChange: OnInputChange = (input) =>
    void getOptionsDebounced(input);

  useEffect(() => () => abortRef.value?.abort());
  return { onInputChange, options, selectedOptions };
}

class OptionsImpl extends Array<Option> implements Options {
  readonly #callbacks = new Set<() => void>();
  #onNotifyChange: (() => void) | undefined;
  #maxLength = Number.MAX_SAFE_INTEGER;

  private constructor(length?: number);
  private constructor(
    items: readonly Option[] | undefined,
    maxLength: number | undefined,
  );
  private constructor(
    lengthOrItems?: number | readonly Option[],
    maxLength?: number,
  ) {
    if (typeof lengthOrItems === 'number') {
      super(lengthOrItems);
    } else {
      super();
    }
    if (maxLength != null) {
      this.setMaxLength(maxLength, false);
    }
    if (Array.isArray(lengthOrItems)) {
      this.#push(lengthOrItems, false);
    }
  }

  static create(
    defaultValue: readonly Option[] | undefined,
    maxLength: number | undefined,
  ): [
    subscribe: Parameters<typeof useSyncExternalStore<OptionsImpl>>[0],
    getSnapshot: Parameters<typeof useSyncExternalStore<OptionsImpl>>[1],
  ] {
    let snapshot = new OptionsImpl(defaultValue, maxLength);
    return [
      function subscribe(callback) {
        snapshot.#onNotifyChange = function() {
          // change the reference refered by the snapshot.
          // as such react will consider the snapshot is changed.
          snapshot = new OptionsImpl(this, this.maxLength);
          snapshot.#onNotifyChange = this.#onNotifyChange;
        };
        snapshot.#callbacks.add(callback);
        return () => {
          snapshot.#callbacks.delete(callback);
        };
      },
      function getSnapshot() {
        return snapshot;
      },
    ];
  }

  get maxLength(): number {
    return this.#maxLength;
  }

  set maxLength(value: number | null) {
    this.setMaxLength(value, true);
  }

  clear(): void {
    const m = this.length;
    this.length = 0;
    if (m > 0) {
      this.#notifyChange();
    }
  }

  has(optionOrId: Option | string, start?: number): boolean {
    start ??= 0;
    start = Math.min(Math.max(0, start), this.length);
    const n = this.length;
    if (typeof optionOrId === 'string') {
      for (let i = start; i < n; i++) {
        if (optionId(this[i] as Option) === optionOrId) {
          return true;
        }
      }
    } else {
      for (let i = start; i < n; i++) {
        if (optionsEqual(this[i] as Option, optionOrId)) {
          return true;
        }
      }
    }
    return false;
  }

  override push(...options: readonly Option[]): number {
    return this.#push(options, true);
  }

  delete(...options: readonly Option[]): number {
    let removed = false;
    for (const a of options) {
      for (let i = 0; i < this.length; i++) {
        const b = this[i] as Option;
        if (optionsEqual(a, b)) {
          this.splice(i, 1);
          removed = true;
          break;
        }
      }
    }
    if (removed) {
      this.#notifyChange();
    }
    return this.length;
  }

  set(...options: readonly Option[]): number {
    const hasOptions = this.length > 0;
    this.length = 0;
    if (options.length > 0) {
      return this.#push(options, true);
    }
    if (hasOptions) {
      this.#notifyChange();
    }
    return 0;
  }

  setMaxLength(value: number | null, notifyChanges: boolean): void {
    value ??= Number.MAX_SAFE_INTEGER;
    if (value < 0 || isNaN(value)) {
      throw RangeError(`provided maxLength "${value}" is out of range`);
    }
    this.#maxLength = value;
    if (this.length > value) {
      this.length = value;
      if (notifyChanges) {
        this.#notifyChange();
      }
    }
  }

  #notifyChange(): void {
    this.#onNotifyChange?.();
    for (const callback of this.#callbacks) {
      callback();
    }
  }

  #push(options: readonly Option[], notifyChanges: boolean): number {
    if (options.length === 0) {
      return 0;
    }
    if (this.length + options.length > this.maxLength) {
      options = options.slice(
        0,
        options.length - Math.max(
          options.length,
          this.length + options.length - this.maxLength,
        ),
      );
    }
    let pushed = false;
    LOOP: for (const a of options) {
      for (const b of this) {
        if (optionsEqual(a, b)) {
          continue LOOP;
        }
      }
      super.push(a);
      pushed = true;
    }
    if (notifyChanges && pushed) {
      this.#notifyChange();
    }
    return this.length;
  }
}

function useOptions(
  defaultValue: readonly Option[] | undefined,
  maxLength: number | undefined,
): Options {
  const [subscribe, getSnapshot] = OptionsImpl.create(defaultValue, maxLength);
  const options = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  useEffect(
    // updating `maxLength` might trigger a render
    // so do calling `setMaxLength` as an effect.
    // (do after current rendering is finished)
    () => options.setMaxLength(maxLength ?? null, true),
    [maxLength, options],
  );
  return options;
}
