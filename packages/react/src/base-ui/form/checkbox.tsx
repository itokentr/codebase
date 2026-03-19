'use client';
import { Checkbox as Base } from '@base-ui/react/checkbox';
import { CheckboxGroup as BaseGroup } from '@base-ui/react/checkbox-group';
import type { StringLike } from '@lib/types';
import type { PropsWithChildren, ReactElement, ReactNode } from 'react';
import { createContext, use, useState } from 'react';
import { createClassNameSet } from '../dom/class-name.ts';
import type { ExtractBaseUiComponentStates } from '../dom/component-type.ts';
import { exports } from '../util/exports.ts';
import type { FieldControlProps } from './control-type.ts';
import { Field } from './field.tsx';
import { Form } from './form.tsx';

// #region namespace

export declare namespace Checkbox {
  type Props = RootProps;

  namespace Group {
    type Props = GroupProps;
  }
}

const [classNames, useClassName, useClassNameOf, useClassNames] =
  createClassNameSet<
    Base.Root.State,
    RootChildrenState,
    {
      group: ExtractBaseUiComponentStates<Checkbox.Group.Props>;
    }
  >();

export const Checkbox = exports(Root, {
  Group,
  classNames,
  useClassName,
  useClassNameOf,
  useClassNames,
});

// #endregion
// #region components

type RootChildrenState = {
  indicator: Base.Indicator.State;
  label: never;
};

type RootProps =
  & FieldControlProps<
    Base.Root.Props,
    Base.Root.State,
    'inputRef',
    RootChildrenState,
    'input'
  >
  & Pick<Base.Indicator.Props, 'keepMounted'>
  & {
    readonly indicator?: Base.Indicator.Props['render'];
    readonly label?: ReactNode;
    /** a value for the unchecked checkbox. the default is empty string */
    readonly valueOff?: StringLike;
    /** a value for the checked checkbox. the default is `"on"` */
    readonly valueOn?: StringLike;
  };

function Root({
  checked: controlledChecked,
  children,
  defaultChecked: defaultCheckedProp,
  disabled: disabledProp,
  indicator,
  keepMounted,
  label,
  name: nameProp,
  onCheckedChange,
  ref,
  valueOff = '',
  valueOn = 'on',
  ...props
}: Checkbox.Props): ReactElement {
  const groupNextValue = useGroupNextDefaultValue();
  const fieldDefaultValue = Field.useDefaultValue();
  const defaultValue = groupNextValue
    ?? (typeof fieldDefaultValue === 'string' ? fieldDefaultValue : undefined);
  let actualChecked: boolean;
  let defaultChecked: boolean | undefined;

  if (controlledChecked != null) {
    if (onCheckedChange == null) {
      throw TypeError(
        'onCheckedChange should be provided when use controlled checked value',
      );
    }
    actualChecked = controlledChecked;
  } else {
    defaultChecked = defaultCheckedProp ?? defaultValue == valueOn;
    actualChecked = defaultChecked;
  }
  const { disabled } = Form.useFormContext(true) ?? {};
  const [trackedChecked, setTrackedChecked] = useState(actualChecked);
  const nameByField = Field.useName();
  const name = nameProp ?? nameByField;
  const onChange = Form.useOnChange(name, onCheckedChange, (checked) => {
    setTrackedChecked(checked);
  });
  const classNames = useClassNames(
    props.classNames,
    props.className,
  );
  type P = Parameters<typeof Base.Root>[0];
  const checkbox = (
    <Base.Root
      {...props}
      checked={controlledChecked}
      className={classNames?.root}
      defaultChecked={defaultChecked}
      disabled={disabledProp ?? disabled}
      inputRef={ref}
      name={name}
      nativeButton={false}
      onCheckedChange={onChange}
      value={valueOn as P['value']}
    >
      <Base.Indicator
        className={classNames?.indicator}
        keepMounted={keepMounted}
        render={indicator}
      />
      <input
        type='hidden'
        disabled={trackedChecked}
        name={name}
        value={valueOff as string}
      />
    </Base.Root>
  );
  if (label != null) {
    return (
      <>
        <label className={classNames?.label?.()}>
          {checkbox}
          {label}
        </label>
        {children}
      </>
    );
  }
  return (
    <>
      {checkbox}
      {children}
    </>
  );
}

type GroupProps =
  & FieldControlProps<
    BaseGroup.Props,
    BaseGroup.State,
    'children' | 'defaultValue',
    null,
    '*'
  >
  & PropsWithChildren;

function Group({
  children,
  ref,
  ...props
}: Checkbox.Group.Props): ReactElement {
  const defaultValue = Field.useDefaultValueArray();
  const defaultValueStore = new CheckboxDefaultValueStore(defaultValue ?? []);
  const className = useClassNameOf('group', props.className);
  return (
    <BaseGroup
      {...props}
      className={className}
      ref={ref as Parameters<typeof BaseGroup>[0]['ref']}
    >
      <DefaultValueContext value={defaultValueStore}>
        {children}
      </DefaultValueContext>
    </BaseGroup>
  );
}

// #endregion
// #region context

class CheckboxDefaultValueStore {
  #index = -1;
  readonly #values: readonly string[];

  constructor(values: readonly string[]) {
    this.#values = values;
  }

  getNextValue(): string {
    const i = this.#index + 1;
    if (this.#values.length === 0 || i >= this.#values.length) {
      throw RangeError('no next default value for the checkbox');
    }
    this.#index = i;
    return this.#values[i] as string;
  }
}

const DefaultValueContext = createContext<CheckboxDefaultValueStore | null>(
  null,
);
function useGroupNextDefaultValue(): string | undefined {
  return use(DefaultValueContext)?.getNextValue();
}

// #endregion
