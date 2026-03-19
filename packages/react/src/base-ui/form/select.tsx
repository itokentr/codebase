'use client';
import { Select as Base } from '@base-ui/react/select';
import type { StringLike } from '@lib/types';
import type { CSSProperties, FunctionComponent, ReactElement } from 'react';
import type { Option } from '../../client/form/element-types.ts';
import { optionId } from '../../client/form/element-types.ts';
import { createClassNameSet } from '../dom/class-name.ts';
import type { BaseUiComponentProps } from '../dom/component-type.ts';
import { exports } from '../util/exports.ts';
import type { FieldControlProps } from './control-type.ts';
import { Field } from './field.tsx';
import { Form } from './form.tsx';

// #region namespace

export declare namespace Select {
  type Props<Multiple extends boolean = false> = RootProps<Multiple>;

  namespace Option {
    type Component = OptionComponent;
    type Props = OptionProps;
  }
}

const [classNames, useClassName, useClassNameOf, useClassNames] =
  createClassNameSet<Base.Trigger.State, RootChildrenState>();

export const Select = exports(Root, {
  classNames,
  useClassName,
  useClassNameOf,
  useClassNames,
});

// #endregion
// #region components

type OptionProps = BaseUiComponentProps<
  Base.Item.Props,
  Base.Item.State,
  Extract<keyof Option, keyof Base.Item.Props>
>;
type OptionComponent = FunctionComponent<OptionProps>;

type RootChildrenState = {
  backdrop: Base.Backdrop.State;
  list: Base.List.State;
  item: Base.Item.State;
  popup: Base.Popup.State;
  root: Base.Trigger.State;
  value: Base.Value.State;
};

type RootProps<Multiple extends boolean = false> =
  & FieldControlProps<
    Base.Root.Props<StringLike, Multiple>,
    Base.Trigger.State,
    | 'children'
    | 'inputRef'
    | 'isItemEqualToValue'
    | 'itemToStringLabel'
    | 'itemToStringValue'
    | 'items',
    RootChildrenState,
    'input'
  >
  & Pick<Base.Value.Props, 'placeholder'>
  & {
    readonly items: readonly Option[];
    readonly optionComponent?: Select.Option.Component;
    readonly popupContainer?: Base.Portal.Props['container'];
    readonly positioner?: Omit<Base.Positioner.Props, 'positionMethod'> & {
      readonly positionMethod?: Pick<CSSProperties, 'position'>;
    };
    readonly value?: Multiple extends true ? readonly StringLike[] : StringLike;
  };

function Root<Multiple extends boolean>({
  defaultValue: defaultValueProp,
  disabled: disabledProp,
  items,
  multiple = false as Multiple,
  name: nameProp,
  onValueChange,
  optionComponent: Option,
  placeholder,
  popupContainer,
  positioner,
  value: controlledValue,
  ...props
}: Select.Props<Multiple>): ReactElement {
  const { disabled: disabledValue } = Form.useFormContext(true) ?? {};
  const fieldDefaultValue = Field.useDefaultValue();
  const defaultValue = defaultValueProp ?? fieldDefaultValue;

  if (Array.isArray(defaultValue)) {
    if (!multiple) {
      throw TypeError('expected type for defaultValue is a string');
    }
  } else {
    if (multiple) {
      throw TypeError('expected type for defaultValue is an array');
    }
  }
  if (controlledValue != null && onValueChange == null) {
    throw TypeError(
      'onValueChange should be provided when need to use controlled value',
    );
  }
  const nameByField = Field.useName();
  const name = nameProp ?? nameByField;
  const disabled = disabledValue ?? disabledProp;
  const onChange = Form.useOnChange(name, onValueChange);
  const classNames = useClassNames(props.classNames, props.className);
  type P = Base.Root.Props<StringLike, Multiple>;
  return (
    <Base.Root
      {...props}
      defaultValue={controlledValue == null
        ? (defaultValue as P['defaultValue'])
        : undefined}
      disabled={disabled}
      isItemEqualToValue={isItemEqualToValue}
      multiple={multiple}
      name={name}
      onValueChange={onChange}
      value={controlledValue as P['value']}
    >
      <Base.Trigger className={classNames?.root}>
        <Base.Value className={classNames?.value} placeholder={placeholder} />
      </Base.Trigger>
      <Base.Portal container={popupContainer}>
        <Base.Backdrop className={classNames?.backdrop} />
        <Base.Positioner
          align='start'
          arrowPadding={0}
          collisionPadding={0}
          {...(positioner as Base.Positioner.Props)}
        >
          <Base.Popup className={classNames?.popup}>
            <Base.List className={classNames?.list}>
              {Option
                ? items.map((option) => {
                  return (
                    <Base.Item
                      className={classNames?.item}
                      disabled={option.disabled ?? disabled}
                      key={optionId(option)}
                      value={option.value}
                      render={(props) => <Option {...props} {...option} />}
                    />
                  );
                })
                : items.map((option) => {
                  return (
                    <Base.Item
                      className={classNames?.item}
                      disabled={option.disabled ?? disabled}
                      key={optionId(option)}
                      value={option.value}
                    >
                      {option.labelNode ?? option.label}
                    </Base.Item>
                  );
                })}
            </Base.List>
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  );
}

function isItemEqualToValue(a: StringLike, b: StringLike): boolean {
  return a == b;
}

// #endregion
