'use client';
import { Field as Base } from '@base-ui/react/field';
import type { StringLike } from '@lib/types';
import type { ReactElement } from 'react';
import { createClassNameSet } from '../dom/class-name.ts';
import { exports } from '../util/exports.ts';
import type { FieldControlProps } from './control-type.ts';
import { Field } from './field.tsx';
import { Form } from './form.tsx';

// #region namespace

export declare namespace Input {
  type Props = RootProps;
}

const [classNames, useClassName, useClassNameOf, useClassNames] =
  createClassNameSet<Base.Root.State>();

export const Input = exports(Root, {
  classNames,
  useClassName,
  useClassNameOf,
  useClassNames,
});

// #endregion
// #region components

type RootProps = FieldControlProps<
  Base.Control.Props,
  Base.Control.State,
  'children' | 'onChange' | 'render',
  never,
  'input',
  StringLike | number
>;

function Root({
  defaultValue: defaultValueProp,
  disabled: disabledProp,
  name: nameProp,
  onValueChange,
  value: controlledValue,
  ...props
}: Input.Props): ReactElement {
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
  const className = useClassName(props.className);
  type P = Parameters<typeof Base.Control>[0];
  return (
    <Base.Control
      {...props}
      className={className}
      defaultValue={controlledValue == null
        ? (defaultValueProp ?? defaultValue)
        : undefined}
      disabled={disabledProp ?? disabled}
      name={name}
      onValueChange={onChange}
      value={controlledValue as P['value']}
    />
  );
}

// #endregion
