'use client';
import { Radio as Base } from '@base-ui/react/radio';
import { RadioGroup as BaseGroup } from '@base-ui/react/radio-group';
import type { StringLike } from '@lib/types';
import type { ReactElement, ReactNode } from 'react';
import { createContext, use } from 'react';
import { createClassNameSet } from '../dom/class-name.ts';
import type { ExtractBaseUiComponentStates } from '../dom/component-type.ts';
import { exports } from '../util/exports.ts';
import type { FieldControlProps } from './control-type.ts';
import { Field } from './field.tsx';
import { Form } from './form.tsx';

// #region namespace

export declare namespace Radio {
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
      group: ExtractBaseUiComponentStates<Radio.Group.Props>;
    }
  >();

export const Radio = exports(Root, {
  Group,
  classNames,
  useClassName,
  useClassNameOf,
  useClassNames,
});

// #endregion
// #region components

const GroupContext = createContext<boolean>(false);

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
    'input',
    StringLike
  >
  & Pick<Base.Indicator.Props, 'keepMounted'>
  & {
    readonly indicator?: Base.Indicator.Props['render'];
    readonly label?: ReactNode;
  };

function Root({
  children,
  disabled: disabledProp,
  indicator,
  keepMounted,
  label,
  ref,
  value,
  ...props
}: Radio.Props): ReactElement {
  const inRadioGroup = use(GroupContext);
  const context = Form.useFormContext(true);

  if (!inRadioGroup) {
    throw TypeError('a radio-button should be within a radio-button-group');
  }
  const classNames = useClassNames(
    props.classNames,
    props.className,
  );
  const radioButton = (
    <Base.Root
      {...props}
      className={classNames?.root}
      disabled={disabledProp ?? context?.disabled}
      inputRef={ref as NonNullable<typeof ref>}
      nativeButton
      value={value}
    >
      <Base.Indicator
        className={classNames?.indicator}
        keepMounted={keepMounted}
        render={indicator}
      />
    </Base.Root>
  );
  return label != null
    ? (
      <>
        <label className={classNames?.label?.()}>
          {radioButton}
          {label}
        </label>
        <GroupContext value={false}>{children}</GroupContext>
      </>
    )
    : (
      <>
        {radioButton}
        <GroupContext value={false}>{children}</GroupContext>
      </>
    );
}

type GroupProps = FieldControlProps<
  BaseGroup.Props<StringLike>,
  BaseGroup.State,
  never,
  never,
  '*',
  StringLike
>;

function Group({
  children,
  defaultValue: defaultValueProp,
  disabled: disabledProp,
  name: nameProp,
  onValueChange,
  ref,
  value: controlledValue,
  ...props
}: Radio.Group.Props): ReactElement {
  if (controlledValue != null) {
    if (onValueChange == null) {
      throw TypeError(
        'onValueChange should be provided when use controlled value',
      );
    }
  }
  const { disabled } = Form.useFormContext(true) ?? {};
  const defaultValue = Field.useDefaultValueString();
  const nameByField = Field.useName();
  const name = nameProp ?? nameByField;
  const onChange = Form.useOnChange(name, onValueChange);
  const className = useClassNameOf('group', props.className);
  type P = Parameters<typeof BaseGroup>[0];
  return (
    <BaseGroup
      {...props}
      className={className}
      defaultValue={controlledValue == null
        ? (defaultValueProp ?? defaultValue)
        : undefined}
      disabled={disabledProp ?? disabled}
      name={name}
      onValueChange={onChange}
      ref={ref as P['ref']}
      value={controlledValue}
    >
      <GroupContext value={true}>{children}</GroupContext>
    </BaseGroup>
  );
}

// #endregion
