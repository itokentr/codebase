'use client';
import { Form as Base } from '@base-ui/react/form';
import type {
  FormControlStringValue,
  FormControlValue,
  ToStringValue,
  TypedFormData,
  TypedFormDataMap,
} from '@lib/types/app/form';
import type { ReactElement, Ref, RefObject } from 'react';
import { createContext, use, useEffect, useRef } from 'react';
import {
  ExternalStore,
  useExternalStore,
} from '../../client/state/external-store.tsx';
import { useKey } from '../../client/state/key.tsx';
import { useMergedRef } from '../../client/state/merged-ref.ts';
import { mergeCallbacks } from '../../client/util/merge-callbacks.ts';
import { createClassNameSet } from '../dom/class-name.ts';
import type { BaseUiComponentProps } from '../dom/component-type.ts';
import { exports } from '../util/exports.ts';

// #region namespace

export declare namespace Form {
  type Context<T extends TypedFormDataMap> = FormContext<T>;
  type Props<T extends TypedFormDataMap> = RootProps<T>;
  type ValueMap<T extends TypedFormDataMap> = FormValueMap<T>;
}

const [classNames, useClassName, useClassNameOf, useClassNames] =
  createClassNameSet<Base.State>();

export const Form = exports(Root, {
  classNames,
  useChanges,
  useClassName,
  useClassNameOf,
  useClassNames,
  useFormContext,
  useOnChange,
});

// #endregion
// #region components

type RootProps<T extends TypedFormDataMap> =
  & BaseUiComponentProps<
    Base.Props,
    Base.State,
    'action' | 'errors',
    null,
    'form'
  >
  & {
    readonly action?:
      | string
      | ((formData: TypedFormData<T>) => void | Promise<void>);
    readonly defaultValues: T;
    readonly disabled?: boolean;
    readonly errors?: Readonly<Record<string, string | readonly string[]>>;
  };

function Root<T extends TypedFormDataMap>({
  action: actionProp,
  children,
  defaultValues,
  disabled = false,
  errors,
  key: keyProp,
  onReset: onResetProp,
  ref: refProp,
  ...props
}: Form.Props<T>): ReactElement {
  const [key, changeKey] = useKey(keyProp);
  const formRef = useRef<HTMLFormElement>(null);
  const ref = useMergedRef(formRef, refProp);
  const context = new FormContextImpl<T>({
    defaultValues,
    disabled,
    formRef,
  });
  const onReset: NonNullable<typeof onResetProp> = (...args) => {
    changeKey();
    return onResetProp?.(...args);
  };
  const className = useClassName(props.className);

  useEffect(() => {
    if (!refProp) {
      return;
    }
    changeStores.set(refProp, new FormChangeStore());
    return () => {
      changeStores.delete(refProp);
    };
  }, [refProp]);
  type P = Parameters<typeof Base>[0];
  return (
    <Base
      action={actionProp as P['action']}
      key={key}
      className={className}
      errors={errors as P['errors']}
      onReset={onReset}
      ref={ref}
      {...props}
    >
      <FormContext value={context}>{children}</FormContext>
    </Base>
  );
}

// #endregion
// #region context

interface FormContext<T extends TypedFormDataMap> {
  readonly defaultValues: FormValueMap<T>;
  readonly disabled: boolean;
  readonly formData: TypedFormData<T>;
  getControlStringValue<K extends keyof T>(name: K): ToStringValue<T[K]>;
  getControlValue<K extends keyof T>(name: K): T[K];
}

interface FormContextOptions<T extends TypedFormDataMap> {
  readonly defaultValues: T;
  readonly disabled: boolean;
  readonly formRef: RefObject<HTMLFormElement | null>;
}

class FormContextImpl<T extends TypedFormDataMap> implements FormContext<T> {
  readonly defaultValues: FormValueMap<T>;
  readonly disabled: boolean;
  readonly formRef: RefObject<HTMLFormElement | null>;
  #formData: TypedFormData<T> | undefined;

  constructor({ defaultValues, disabled, formRef }: FormContextOptions<T>) {
    this.defaultValues = new FormValueMapImpl(defaultValues);
    this.disabled = disabled;
    this.formRef = formRef;
  }

  get formData(): TypedFormData<T> {
    if (!this.formRef.current) {
      throw TypeError('unable to get formData while rendering');
    }
    this.#formData ??= new FormData(this.formRef.current) as TypedFormData<T>;
    return this.#formData;
  }

  getControlStringValue<K extends keyof T>(name: K): ToStringValue<T[K]> {
    return toStringValue(this.getControlValue(name)) as ToStringValue<T[K]>;
  }

  getControlValue<K extends keyof T>(name: K): T[K] {
    return (
      Array.isArray(this.defaultValues.get(name))
        ? this.formData.getAll(name)
        : this.formData.get(name)
    ) as T[K];
  }
}

const FormContext = createContext<FormContextImpl<any> | null>(null);

function useFormContext<T extends TypedFormDataMap>(): FormContext<T>;
function useFormContext<T extends TypedFormDataMap>(
  nullable: true,
): FormContext<T> | null;
function useFormContext<T extends TypedFormDataMap>(
  nullable = false,
): FormContext<T> | null {
  const context = use<FormContextImpl<T> | null>(FormContext);

  if (!context) {
    if (nullable) {
      return null;
    }
    throw TypeError('there is no form context');
  }
  return context;
}

// #endregion
// #region notify control changes

const changeStores = new WeakMap<
  NonNullable<Ref<HTMLFormElement>>,
  FormChangeStore<any>
>();

class FormChangeStore<T extends TypedFormDataMap> extends ExternalStore<
  [keyof T, T[keyof T]] | [null, null]
> {
  #value: [keyof T, T[keyof T]] | [null, null] = [null, null];

  readonly onValueChange = <K extends keyof T>(name: K, value: T[K]): void => {
    this.#value = [name, value];
    this.notifyChange();
  };

  protected override getSnapshotValue(): [keyof T, T[keyof T]] | [null, null] {
    return this.#value;
  }
}

/**
 * @example
 * ```tsx
 * function Component() {
 *   const formRef = useRef<HTMLFormElement>(null);
 *   const [name, value] = useChanges(formRef);
 *   let changed: ReactElement | undefined;
 *
 *   if (name) {
 *     changed = <p>value changed: {name} = {value}</p>;
 *   }
 *   return (
 *     <Form ref={formRef}>
 *       {changed}
 *       ...
 *     </Form>
 *   );
 * }
 * ```
 */
function useChanges<T extends TypedFormDataMap, K extends keyof T>(
  formRef: NonNullable<Ref<HTMLFormElement>>,
): [K, T[K]] | [null, null] {
  // oxlint-disable-next-line @eslint-react/refs
  const store = changeStores.get(formRef);
  const ret = useExternalStore(store);
  return ret ? (ret as [K, T[K]]) : [null, null];
}

/**
 * @example
 * ```tsx
 * function ControlComponent({ onChange: onChangeProp }) {
 *   const controlName = useFieldName();
 *   const onChange = useOnChange(controlName, onChangeProp);
 *   return <Field.Control onChange={onChange} />;
 * }
 * ```
 */
function useOnChange<T extends (...args: any[]) => void>(
  name: string | undefined,
  // cannot use rest parameters due to react compiler limitation
  onChange1: T | undefined,
  onChange2?: T,
  onChange3?: T,
): T | undefined {
  const context = useFormContext(true);
  const onChange = mergeCallbacks(onChange1, onChange2, onChange3);

  if (!context || name == undefined) {
    return onChange;
  }
  if (!(context instanceof FormContextImpl)) {
    throw Error('unexpected instanceof form-context');
  }
  if (!context.defaultValues.has(name)) {
    throw TypeError(`specified control name "${name}" is not available`);
  }
  const store = changeStores.get(context.formRef);
  if (!store) {
    return onChange;
  }
  return ((...args: unknown[]): void => {
    store.onValueChange(name, context.getControlValue(name));
    onChange?.(...args);
  }) as T;
}

// #endregion
// #region value map

function toStringValue(value: FormControlValue): FormControlStringValue {
  let ret: string | string[];
  if (Array.isArray(value)) {
    ret = [] as string[];
    for (const v of value) {
      ret.push(typeof v !== 'string' ? ((v as Partial<File>).name ?? '') : v);
    }
  } else if (typeof value !== 'string') {
    ret = (value as Partial<File>).name ?? '';
  } else {
    ret = value;
  }
  return ret;
}

interface FormValueMap<T extends TypedFormDataMap> extends
  ReadonlyMap<
    keyof T,
    FormControlStringValue
  > {
  get<K extends keyof T>(name: K): ToStringValue<T[K]>;
  get(name: string): never;
}

class FormValueMapImpl<T extends TypedFormDataMap>
  extends Map<keyof T, FormControlStringValue>
  implements FormValueMap<T> {
  constructor(values: T) {
    type K = keyof T;
    const iter: (readonly [K, FormControlStringValue])[] = [];
    for (const name of Object.getOwnPropertyNames(values) as K[]) {
      iter.push([name, toStringValue(values[name] as FormControlValue)]);
    }
    super(iter);
  }

  override get<K extends keyof T>(name: K): ToStringValue<T[K]>;
  override get(name: string): never;
  override get(name: string): FormControlStringValue {
    const ret = super.get(name);
    if (ret == undefined) {
      throw TypeError(`form control "${name}" is not found`);
    }
    return ret;
  }
}

// #endregion
