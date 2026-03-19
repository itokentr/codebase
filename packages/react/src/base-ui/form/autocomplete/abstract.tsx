'use client';
import { Input as BaseInput } from '@base-ui/react/input';
import { Popover } from '@base-ui/react/popover';
import { Toolbar } from '@base-ui/react/toolbar';
import { useRender } from '@base-ui/react/use-render';
import type {
  CSSProperties,
  ComponentProps,
  Dispatch,
  HTMLAttributes,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  RefAttributes,
  RefObject,
  SetStateAction,
} from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import {
  FocusEventHandlerProvider,
  useFocusInHandler,
  useFocusOutHandler,
} from '../../../client/dom/focus-event.tsx';
import * as Base from '../../../client/form/autocomplete.tsx';
import type { Option } from '../../../client/form/element-types.ts';
import { optionId, optionsEqual } from '../../../client/form/element-types.ts';
import {
  createMergedRef,
  useMergedRef,
} from '../../../client/state/merged-ref.ts';
import { createValueProvider } from '../../../client/state/value-provider.tsx';
import { mergeCallbacks } from '../../../client/util/merge-callbacks.ts';
import { createClassNameSet } from '../../dom/class-name.ts';
import type { BaseUiComponentProps } from '../../dom/component-type.ts';
import { Field } from '../field.tsx';
import type { KeyboardEventHandlerOptions } from './keyboard-event-handler.tsx';
import {
  KeyNavigation,
  KeyboardEventHandlerProvider,
  useKeyboardEventHandler,
  useToolbarKeyboardEventHandler,
} from './keyboard-event-handler.tsx';

export type { Option };

// #region root

export const [classNames, useClassName, useClassNameOf, useClassNames] =
  createClassNameSet<
    never,
    RelevantComponentStates
  >();

type RelevantComponentStates = {
  input: BaseInput.State;
  options: Toolbar.Root.State;
  option: Toolbar.Button.State;
  popup: Popover.Popup.State;
  popupBackdrop: Popover.Backdrop.State;
  selectedOptions: Toolbar.Root.State;
  selectedOption: Toolbar.Button.State;
};

export type RootProps = PropsWithChildren<
  & {
    readonly autocomplete: Base.UseAutocompleteParams;
    readonly defaultInput?: string;
    readonly inputId?: string;
    readonly name?: string;
    readonly placeholder?: string;
    readonly render?: Parameters<
      typeof useRender<never, HTMLElement>
    >[0]['render'];
  }
  & HTMLAttributes<HTMLElement>
  & RefAttributes<HTMLElement>
>;

export function Root(props: RootProps): ReactElement {
  const refs = useElementReferencesFactory();
  return (
    <ElementReferencesProvider value={refs}>
      <RootInner {...props} />
    </ElementReferencesProvider>
  );
}

function RootInner({
  autocomplete: { defaultSelectedOptions, ...autocomplete },
  children,
  defaultInput,
  inputId,
  name: nameProp,
  placeholder,
  ref: refProp,
  render,
  ...props
}: RootProps): ReactElement {
  const rootRef = useRefOf('root');
  const ref = useMergedRef(refProp, rootRef);
  const defaultValues = Field.useDefaultValueArray();
  const nameByField = Field.useName();
  const name = nameProp ?? nameByField;
  const className = useClassName(props.className);

  if (defaultValues && !defaultSelectedOptions) {
    defaultSelectedOptions = defaultValues.map((label) => ({
      label,
      value: label,
    }));
  }
  return useRender({
    defaultTagName: 'div',
    props: {
      ...props,
      children: (
        <FocusEventHandlerProvider>
          <KeyboardEventHandlerProvider>
            <AutocompleteProvider
              {...{ autocomplete: { defaultSelectedOptions, ...autocomplete } }}
            >
              <InputContextProvider {...{ defaultInput, inputId, placeholder }}>
                {children}
                <SelectedOptionValues {...{ name }} />
              </InputContextProvider>
            </AutocompleteProvider>
          </KeyboardEventHandlerProvider>
        </FocusEventHandlerProvider>
      ),
      className,
      ref,
    },
    render,
  });
}

const [AutocompleteProviderInner, useAutocomplete] = createValueProvider<
  Base.Autocomplete
>();

function AutocompleteProvider({
  autocomplete: autocompleteProps,
  children,
}: PropsWithChildren<Pick<RootProps, 'autocomplete'>>): ReactElement {
  const autocomplete = Base.useAutocomplete(autocompleteProps);
  return (
    <AutocompleteProviderInner value={autocomplete}>
      {children}
    </AutocompleteProviderInner>
  );
}

export { useAutocomplete };

// #endregion
// #region input

function onInputRefAssigned(input: HTMLElement | null): void {
  input?.removeAttribute('name');
}

export type InputProps =
  & BaseUiComponentProps<
    BaseInput.Props,
    BaseInput.State,
    'children' | 'defaultValue' | 'name' | 'type' | 'value'
  >
  & Partial<Pick<KeyboardEventHandlerOptions, 'keyNavigation'>>;

export function Input({ keyNavigation, ...props }: InputProps): ReactElement {
  const { onInputChange } = useAutocomplete();
  const { input, inputId, placeholder, setInput } = useInputContext();
  const { input: inputRef } = useElementReferences();
  const ref = useMergedRef(inputRef, props, onInputRefAssigned);
  const onFocusIn = useFocusInHandler(inputRef);
  const onFocusOut = useFocusOutHandler(inputRef);
  const onBlur = mergeCallbacks(onFocusOut, props.onBlur);
  const onFocus = mergeCallbacks(onFocusIn, props.onFocus);
  const onInput = mergeCallbacks(props.onInput, (event) => {
    const target = event.nativeEvent.target as HTMLElement;
    let value: string;
    if (target.isContentEditable) {
      value = target.innerText;
    } else {
      value = (target as Partial<HTMLInputElement>).value ?? target.innerText;
    }
    setInput(value);
    onInputChange({ value });
  });
  const handleKeyDown = useKeyboardEventHandler({
    componentName: 'input',
    keyNavigation: keyNavigation !== undefined
      ? keyNavigation
      : KeyNavigation.flags(KeyNavigation.NextDown, KeyNavigation.PrevUp),
    targetRef: inputRef,
  });
  const onKeyDown = mergeCallbacks(props.onKeyDown, handleKeyDown);
  const className = useClassNameOf('input', props.className);
  return (
    <BaseInput
      id={inputId}
      placeholder={placeholder}
      type='text'
      {...props}
      className={className}
      onBlur={onBlur}
      onFocus={onFocus}
      onInput={onInput}
      onKeyDown={onKeyDown}
      ref={ref}
      value={input}
    />
  );
}

export interface InputContext {
  readonly input: string;
  readonly inputId: string | undefined;
  readonly placeholder: string | undefined;
  readonly setInput: Dispatch<SetStateAction<string>>;
}

const [InputContextProviderInner, useInputContext] = createValueProvider<
  InputContext
>();

export { useInputContext };

function InputContextProvider({
  children,
  defaultInput,
  inputId,
  placeholder,
}: PropsWithChildren<
  Pick<RootProps, 'defaultInput' | 'inputId' | 'placeholder'>
>): ReactElement {
  const [input, setInput] = useState(defaultInput ?? '');
  const context: InputContext = { input, inputId, placeholder, setInput };
  return (
    <InputContextProviderInner value={context}>
      {children}
    </InputContextProviderInner>
  );
}

// #endregion
// #region options

export type OptionsProps =
  & Omit<ComponentProps<typeof Toolbar.Root>, 'children' | 'loop'>
  & Partial<Pick<KeyboardEventHandlerOptions, 'keyNavigation'>>
  & {
    readonly nativeButtonItem?: boolean;
    readonly renderItem?: RenderOptionItem;
    readonly renderSelectedItems?: boolean;
  };

export function Options({
  keyNavigation,
  nativeButtonItem = true,
  orientation = 'vertical',
  renderItem,
  renderSelectedItems = false,
  ...props
}: OptionsProps): ReactElement {
  const { options, selectedOptions } = useAutocomplete();
  const refs = useElementReferences();
  const ref = createMergedRef(refs.options, props);
  const onFocusIn = useFocusInHandler(refs.options);
  const onFocusOut = useFocusOutHandler(refs.options);
  const onBlur = mergeCallbacks(onFocusOut, props.onBlur);
  const onFocus = mergeCallbacks(onFocusIn, props.onFocus);
  const handleKeyDown = useToolbarKeyboardEventHandler({
    componentName: 'options',
    firstItemRef: refs.firstOption,
    keyNavigation: keyNavigation !== undefined
      ? keyNavigation
      : KeyNavigation.flags(KeyNavigation.NextDown, KeyNavigation.NextUp),
    lastItemRef: refs.lastOption,
    targetRef: refs.options,
  });
  const onKeyDown = mergeCallbacks(props.onKeyDown, handleKeyDown);
  const rootClassName = useClassNameOf('options', props.className);
  const itemClassName = useClassNameOf('option');
  const toolbarItems: ReactElement[] = [];
  const n = options.length - 1;
  let i = -1;
  LOOP: for (const option of options) {
    let selected = false;
    for (const selectedOption of selectedOptions) {
      if (optionsEqual(option, selectedOption)) {
        if (!renderSelectedItems) {
          continue LOOP;
        }
        selected = true;
        break;
      }
    }
    i++;
    const ref = i === 0 && i === n
      ? createMergedRef(refs.firstOption, refs.lastOption)
      : i === 0
      ? refs.firstOption
      : i === n
      ? refs.lastOption
      : undefined;
    toolbarItems.push(
      <Option
        className={itemClassName}
        key={optionId(option)}
        nativeButton={nativeButtonItem}
        ref={ref}
        renderItem={renderItem}
        selected={selected}
        {...option}
      />,
    );
  }
  return (
    <Toolbar.Root
      {...props}
      className={rootClassName}
      loopFocus={false}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      orientation={orientation}
      ref={ref}
    >
      {toolbarItems}
    </Toolbar.Root>
  );
}

export type OptionProps =
  & Omit<ComponentProps<typeof Toolbar.Button>, 'children' | 'render' | 'value'>
  & Option
  & {
    readonly selected: boolean;
  };

export type RenderOptionItem = (
  props: OptionProps,
) => ReactElement<OptionProps>;

type OptionPropsInternal = OptionProps & {
  readonly renderItem: RenderOptionItem | undefined;
};

function Option({
  disabled,
  id,
  label,
  labelNode,
  nativeButton,
  onClick: onClickProp,
  renderItem,
  selected,
  value,
  ...props
}: OptionPropsInternal): ReactElement {
  const { selectedOptions } = useAutocomplete();
  const { input: inputRef } = useElementReferences();
  const option = { disabled, id, label, labelNode, value } satisfies Option;
  const onClick: NonNullable<typeof onClickProp> = (...args): void => {
    // oxlint-disable-next-line @eslint-react/immutability
    selectedOptions.push(option);
    if (inputRef.current) {
      const input = inputRef.current;
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
    onClickProp?.(...args);
  };
  return renderItem
    ? (
      <Toolbar.Button
        disabled={option.disabled}
        key={optionId(option)}
        nativeButton={nativeButton}
        type={nativeButton ? 'button' : undefined}
        {...props}
        // oxlint-disable-next-line @eslint-react/immutability
        onClick={onClick}
        render={(props) => {
          return renderItem({ ...props, ...option, selected });
        }}
      />
    )
    : (
      <Toolbar.Button
        disabled={option.disabled}
        key={optionId(option)}
        nativeButton={nativeButton}
        // oxlint-disable-next-line @eslint-react/immutability
        onClick={onClick}
        type={nativeButton ? 'button' : undefined}
      >
        {labelNode ?? label}
      </Toolbar.Button>
    );
}

// #endregion
// #region selected options

export type SelectedOptionsProps =
  & Omit<ComponentProps<typeof Toolbar.Root>, 'children' | 'loop'>
  & Partial<Pick<KeyboardEventHandlerOptions, 'keyNavigation'>>
  & {
    readonly nativeButtonItem?: boolean;
    readonly renderItem?: RenderOptionItem;
  };

export function SelectedOptions({
  keyNavigation,
  nativeButtonItem = true,
  orientation = 'horizontal',
  renderItem,
  ...props
}: SelectedOptionsProps): ReactElement {
  const { selectedOptions } = useAutocomplete();
  const refs = useElementReferences();
  const ref = createMergedRef(refs.selectedOptions, props);
  const onFocusIn = useFocusInHandler(refs.selectedOptions);
  const onFocusOut = useFocusOutHandler(refs.selectedOptions);
  const onBlur = mergeCallbacks(onFocusOut, props.onBlur);
  const onFocus = mergeCallbacks(onFocusIn, props.onFocus);
  const handleKeyDown = useToolbarKeyboardEventHandler({
    componentName: 'selected',
    firstItemRef: refs.firstSelectedOption,
    keyNavigation: keyNavigation !== undefined
      ? keyNavigation
      : KeyNavigation.flags(KeyNavigation.NextDown, KeyNavigation.NextUp),
    lastItemRef: refs.lastSelectedOption,
    targetRef: refs.selectedOptions,
  });
  const onKeyDown = mergeCallbacks(props.onKeyDown, handleKeyDown);
  const className = useClassNameOf('selectedOptions', props.className);
  const itemClassName = useClassNameOf('selectedOption');
  return (
    <Toolbar.Root
      {...props}
      className={className}
      loopFocus={false}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      orientation={orientation}
      ref={ref}
    >
      {selectedOptions.map((option, i, { length: n }) => {
        const ref = i === 0 && i === n
          ? createMergedRef(
            refs.firstSelectedOption,
            refs.lastSelectedOption,
          )
          : i === 0
          ? refs.firstSelectedOption
          : i === n
          ? refs.lastSelectedOption
          : undefined;
        return (
          <SelectedOption
            className={itemClassName}
            key={optionId(option)}
            nativeButton={nativeButtonItem}
            ref={ref}
            renderItem={renderItem}
            selected={true}
            {...option}
          />
        );
      })}
    </Toolbar.Root>
  );
}

function SelectedOption({
  disabled,
  id,
  label,
  labelNode,
  nativeButton,
  onClick: onClickProp,
  renderItem,
  selected,
  value,
  ...props
}: OptionPropsInternal): ReactElement {
  const { selectedOptions } = useAutocomplete();
  const { input: inputRef } = useElementReferences();
  const option = { disabled, id, label, labelNode, value } satisfies Option;
  const onClick: NonNullable<typeof onClickProp> = (...args): void => {
    // oxlint-disable-next-line @eslint-react/immutability
    selectedOptions.delete(option);
    if (inputRef.current) {
      const input = inputRef.current;
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
    onClickProp?.(...args);
  };
  return renderItem
    ? (
      <Toolbar.Button
        disabled={option.disabled}
        key={optionId(option)}
        nativeButton={nativeButton}
        type={nativeButton ? 'button' : undefined}
        {...props}
        // oxlint-disable-next-line @eslint-react/immutability
        onClick={onClick}
        render={(props) => {
          return renderItem({ ...props, ...option, selected });
        }}
      />
    )
    : (
      <Toolbar.Button
        disabled={option.disabled}
        key={optionId(option)}
        nativeButton={nativeButton}
        // oxlint-disable-next-line @eslint-react/immutability
        onClick={onClick}
        type={nativeButton ? 'button' : undefined}
      >
        {labelNode ?? label}
      </Toolbar.Button>
    );
}

function SelectedOptionValues({
  name: nameProp,
}: Pick<RootProps, 'name'>): ReactNode {
  const { selectedOptions } = useAutocomplete();
  const nameByField = Field.useName();
  const name = nameProp ?? nameByField;
  if (!name) {
    return undefined;
  }
  if (selectedOptions.length === 0) {
    return <input name={name} type='hidden' value='' />;
  }
  return (
    <>
      {selectedOptions.map((option) => (
        <input
          disabled={option.disabled}
          key={optionId(option)}
          name={name}
          type='hidden'
          value={option.value as string}
        />
      ))}
    </>
  );
}

// #endregion
// #region popup

export type PopupProps =
  & ComponentProps<typeof Popover.Popup>
  & Pick<Popover.Root.Props, 'modal' | 'onOpenChange' | 'onOpenChangeComplete'>
  & Pick<Popover.Portal.Props, 'container' | 'keepMounted'>
  & Pick<Popover.Trigger.Props, 'closeDelay' | 'delay'>
  & {
    readonly open: boolean;
    readonly positioner?:
      & Omit<Popover.Positioner.Props, 'positionMethod'>
      & { readonly positionMethod?: Pick<CSSProperties, 'position'> };
  };

export function Popup({
  closeDelay,
  container,
  delay,
  initialFocus,
  keepMounted,
  modal = false,
  onOpenChange,
  onOpenChangeComplete,
  open,
  positioner,
  ...props
}: PopupProps): ReactElement {
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const rootRef = useRefOf('root');
  const optionsPopupTriggerRef = useRefOf('optionsPopupTrigger');
  const className = useClassNameOf('popup', props.className);
  const backdropClassName = useClassNameOf('popupBackdrop');

  // oxlint-disable @eslint-react/immutability
  useLayoutEffect(() => {
    const { current: trigger } = optionsPopupTriggerRef;
    const { current: root } = rootRef;
    const window = root?.ownerDocument.defaultView;

    if (window && trigger) {
      // TODO: consider shadow-dom
      const onResize = (): void => {
        const { height, left, top, width } = root.getBoundingClientRect();
        trigger.style.left = `${left + window.scrollX}px`;
        trigger.style.top = `${top + window.scrollY}px`;
        trigger.style.width = `${width}px`;
        trigger.style.height = `${height}px`;
      };
      const resizeObserver = new ResizeObserver(onResize);
      resizeObserverRef.current = resizeObserver;
      resizeObserver.observe(root);
      window.addEventListener('resize', onResize);
      window.addEventListener('scroll', onResize);
      return () => {
        resizeObserver.disconnect();
        resizeObserverRef.current = null;
        window.removeEventListener('resize', onResize);
        window.removeEventListener('scroll', onResize);
      };
    }
    return () => undefined;
  });
  // oxlint-enable @eslint-react/immutability
  return (
    <Popover.Root
      modal={modal}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
      open={open}
    >
      <Popover.Trigger
        aria-controls={undefined}
        aria-expanded={undefined}
        aria-haspopup={undefined}
        closeDelay={closeDelay}
        delay={delay}
        inert={true}
        nativeButton={false}
        ref={optionsPopupTriggerRef as RefObject<HTMLButtonElement | null>}
        render={<div />}
        role='none'
        style={{ position: 'fixed', zIndex: '-1' }}
        tabIndex={undefined}
      />
      <Popover.Portal container={container} keepMounted={keepMounted}>
        <Popover.Backdrop className={backdropClassName} />
        <Popover.Positioner
          align='start'
          arrowPadding={0}
          collisionPadding={0}
          {...(positioner as Popover.Positioner.Props)}
        >
          <Popover.Popup
            className={className}
            initialFocus={initialFocus}
            {...props}
          />
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

/** useful to suppress a react compiler error `"Cannot access refs during render"` */
function useRefOf<K extends keyof ElementReferences>(
  name: K,
): ElementReferences[K] {
  const refs = useElementReferences();
  return refs[name];
}

// #endregion
// #region element references

export interface ElementReferences {
  readonly firstOption: RefObject<HTMLButtonElement | null>;
  readonly firstSelectedOption: RefObject<HTMLButtonElement | null>;
  readonly input: RefObject<HTMLInputElement | null>;
  readonly lastOption: RefObject<HTMLButtonElement | null>;
  readonly lastSelectedOption: RefObject<HTMLButtonElement | null>;
  readonly options: RefObject<HTMLDivElement | null>;
  readonly optionsPopupTrigger: RefObject<HTMLDivElement | null>;
  readonly root: RefObject<HTMLElement | null>;
  readonly selectedOptions: RefObject<HTMLDivElement | null>;
}

const [ElementReferencesProvider, useElementReferences] = createValueProvider<
  ElementReferences
>();

export { useElementReferences };

function useElementReferencesFactory(): ElementReferences {
  // oxlint-disable @eslint-react/naming-convention-ref-name
  const firstOption = useRef(null);
  const firstSelectedOption = useRef(null);
  const input = useRef(null);
  const lastOption = useRef(null);
  const lastSelectedOption = useRef(null);
  const options = useRef(null);
  const optionsPopupTrigger = useRef(null);
  const root = useRef(null);
  const selectedOptions = useRef(null);
  // oxlint-enable @eslint-react/naming-convention-ref-name
  return {
    firstOption,
    firstSelectedOption,
    input,
    lastOption,
    lastSelectedOption,
    options,
    optionsPopupTrigger,
    root,
    selectedOptions,
  };
}

// #endregion
