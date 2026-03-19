'use client';
import { Field as Base } from '@base-ui/react/field';
import type {
  FormControlStringValue,
  ReadonlyTypedFormData,
  TypedFormDataMap,
} from '@lib/types/app/form';
import type { ReactElement } from 'react';
import { createContext, use, useRef } from 'react';
import { useMergedRef } from '../../client/state/merged-ref.ts';
import { createClassNameSet } from '../dom/class-name.ts';
import type {
  BaseUiComponentProps,
  ExtractBaseUiComponentStates,
} from '../dom/component-type.ts';
import { exports } from '../util/exports.ts';
import { Form } from './form.tsx';

// #region namespace

export declare namespace Field {
  type Props<T extends TypedFormDataMap, K extends keyof T> = RootProps<T, K>;

  namespace Error {
    type Props = ErrorProps;
  }
  namespace Label {
    type Props = LabelProps;
  }
}

const [classNames, useClassName, useClassNameOf, useClassNames] =
  createClassNameSet<
    Base.Root.State,
    {
      error: ExtractBaseUiComponentStates<Field.Error.Props>;
      label: ExtractBaseUiComponentStates<Field.Label.Props>;
    }
  >();

export const Field = exports(Root, {
  Error: ErrorComponent,
  Label,
  classNames,
  useClassName,
  useClassNameOf,
  useClassNames,
  useDefaultValue,
  useDefaultValueArray,
  useDefaultValueString,
  useName,
});

// #endregion
// #region components

type RootProps<
  T extends TypedFormDataMap,
  K extends keyof T,
> =
  & BaseUiComponentProps<
    Base.Root.Props,
    Base.Root.State,
    'name' | 'validate'
  >
  & {
    readonly name: K;
    readonly validate?: ValidationFn<T, K>;
  };

function Root<T extends TypedFormDataMap, K extends keyof T>({
  children,
  disabled,
  name,
  validate: validateFn,
  ...props
}: Field.Props<T, K>): ReactElement {
  const fieldRef = useRef<HTMLElement>(null);
  const ref = useMergedRef(props, fieldRef);
  const { defaultValues, disabled: formDisabled } = Form.useFormContext<T>();
  const disabledValue = disabled ?? formDisabled;
  const defaultValue = defaultValues.get(name);
  const validate = useValidate(name, validateFn);
  const context: FieldContext = {
    defaultValue,
    disabled: disabledValue,
    name: name as FieldContext['name'],
  };
  const className = useClassName(props.className);
  return (
    <Base.Root
      {...props}
      className={className}
      disabled={disabledValue}
      name={name as string}
      ref={ref}
      validate={validate}
    >
      <FieldContext value={context}>{children}</FieldContext>
    </Base.Root>
  );
}

type ErrorProps = BaseUiComponentProps<Base.Error.Props, Base.Error.State>;

function ErrorComponent(
  { ref, ...props }: Field.Error.Props,
): ReactElement {
  const className = useClassNameOf('error', props.className);
  type P = Parameters<typeof Base.Error>[0];
  return <Base.Error {...props} className={className} ref={ref as P['ref']} />;
}

type LabelProps = BaseUiComponentProps<Base.Label.Props, Base.Label.State>;

function Label({ children, ...props }: Field.Label.Props): ReactElement {
  const className = useClassNameOf('label', props.className);
  return (
    <Base.Label {...props} className={className}>
      {children}
    </Base.Label>
  );
}

// #endregion
// #region field context

interface FieldContext {
  readonly defaultValue: FormControlStringValue;
  readonly disabled: boolean;
  readonly name: string;
}

const FieldContext = createContext<FieldContext | null>(null);

function useFieldContext(nullable: true): FieldContext | null;
function useFieldContext(nullable?: false): FieldContext;
function useFieldContext(nullable = false): FieldContext | null {
  const context = use(FieldContext);
  if (context == null && !nullable) {
    throw TypeError('should be used within FieldContext');
  }
  return context;
}

// #endregion
// #region field name and value

function useName(nullable?: true): string | undefined;
function useName(nullable: false): string;
function useName(nullable = true): string | undefined {
  return useFieldContext(nullable as true)?.name;
}

/** get the value provided via {@link FormContext} or {@link DefaultValueProvider} */
function useDefaultValue(): FormControlStringValue | null {
  const context = useFieldContext(true);
  return context?.defaultValue ?? null;
}

/** an error will be thrown if the value is not an array */
function useDefaultValueArray(): readonly string[] | undefined {
  const value = useDefaultValue();
  if (value == null) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    throw TypeError('expecting an array but got non array type');
  }
  return value as readonly string[];
}

/** an error will be thrown if the value is not a string */
function useDefaultValueString(): string | undefined {
  const value = useDefaultValue();
  if (value == null) {
    return undefined;
  }
  if (Array.isArray(value)) {
    throw TypeError('expecting a string but got an array type');
  }
  return value as string;
}

// #endregion
// #region validation

type BaseUiValidateFn = NonNullable<Base.Root.Props['validate']>;

type ValidationFn<T extends TypedFormDataMap, K extends keyof T> = (
  value: T[K],
  name: K,
  formData: ReadonlyTypedFormData<T>,
) =>
  | string
  | readonly string[]
  | null
  | Promise<string | readonly string[] | null>;

function createValidationFn<T extends TypedFormDataMap, K extends keyof T>(
  name: K,
  validate: ValidationFn<T, K>,
  context: Form.Context<T>,
): BaseUiValidateFn {
  return () =>
    validate(
      context.getControlValue(name),
      name,
      context.formData,
    ) as ReturnType<BaseUiValidateFn>;
}

/** @internal */
function useValidate<T extends TypedFormDataMap, K extends keyof T>(
  name: K,
  validate: ValidationFn<T, K> | undefined,
): BaseUiValidateFn | undefined {
  const context = Form.useFormContext<T>();
  return validate ? createValidationFn(name, validate, context) : undefined;
}

// #endregion
