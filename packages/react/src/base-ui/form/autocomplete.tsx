'use client';
import { useRender } from '@base-ui/react/use-render';
import type {
  Dispatch,
  MouseEventHandler,
  PropsWithChildren,
  ReactElement,
  SetStateAction,
} from 'react';
import { useState } from 'react';
import {
  useFocusInEvent,
  useFocusOutEvent,
} from '../../client/dom/focus-event.tsx';
import { createValueProvider } from '../../client/state/value-provider.tsx';
import { exports } from '../util/exports.ts';
import * as Base from './autocomplete/abstract.tsx';
import { KeyNavigation } from './autocomplete/keyboard-event-handler.tsx';

// #region namespace

export declare namespace Autocomplete {
  type ElementReferences = Base.ElementReferences;
  type Props = RootProps;
  type RenderOptionItem = Base.RenderOptionItem;

  namespace ClearButton {
    type Props = ClearButtonProps;
  }
  namespace Input {
    type Context = Base.InputContext;
    type Props = Base.InputProps;
  }
  namespace OpenButton {
    type Props = OpenButtonProps;
  }
  namespace Options {
    type Props = Base.OptionsProps;
  }
  namespace Popup {
    type Context = PopupContext;
    type Props = PopupProps;
  }
  namespace SelectedOptions {
    type Props = Base.SelectedOptionsProps;
  }
}

const [classNames, useClassName, useClassNameOf, useClassNames] = Base
  .classNames.extendTypes<
  RelevantComponentStates
>();

export const Autocomplete = exports(Root, {
  ClearButton,
  Input: Base.Input,
  KeyNavigation,
  OpenButton,
  Options: Base.Options,
  Popup,
  SelectedOptions: Base.SelectedOptions,
  classNames,
  useAutocomplete: Base.useAutocomplete,
  useClassName,
  useClassNameOf,
  useClassNames,
  useElementReferences: Base.useElementReferences,
});

// #endregion
// #region components

type RelevantComponentStates = {
  clearButton: never;
  openButton: never;
};

type RootProps = Base.RootProps & {
  readonly defaultOpen?: boolean;
};

function Root({
  children,
  defaultOpen,
  ...props
}: Autocomplete.Props): ReactElement {
  const [open, setOpen] = useState<boolean | null>(defaultOpen ?? false);
  const optionsPopup: PopupContext = { open, setOpen };
  return (
    <Base.Root {...props}>
      <PopupContextProvider value={optionsPopup}>
        <RootInner>{children}</RootInner>
      </PopupContextProvider>
    </Base.Root>
  );
}

function RootInner({ children }: PropsWithChildren): ReactElement {
  const { setOpen } = usePopupContext();
  useFocusInEvent(() => setOpen(null));
  useFocusOutEvent(() => setOpen(false));
  return <>{children}</>;
}

type ClearButtonProps = useRender.ComponentProps<'button', never>;

function ClearButton({
  onClick: onClickProp,
  render,
  ...props
}: Autocomplete.ClearButton.Props): ReactElement {
  const { options, selectedOptions } = Base.useAutocomplete();
  const { setInput } = Base.useInputContext();
  const {
    input: { current: input },
  } = Base.useElementReferences();
  const className = useClassNameOf('clearButton', props.className);
  const onClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    setInput('');
    options.clear();
    selectedOptions.clear();
    input?.focus();
    onClickProp?.(event);
  };
  if (!render) {
    // oxlint-disable-next-line jsx-a11y/control-has-associated-label
    render = <button type='button' />;
  }
  return useRender({ props: { ...props, className, onClick }, render });
}

type OpenButtonProps = useRender.ComponentProps<'button', never>;

function OpenButton({
  onClick: onClickProp,
  render,
  ...props
}: Autocomplete.OpenButton.Props): ReactElement {
  const { onInputChange } = Base.useAutocomplete();
  const { input } = Base.useInputContext();
  const { input: inputRef } = Base.useElementReferences();
  const className = useClassNameOf('openButton', props.className);
  const onClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onInputChange({
      callback() {
        inputRef.current?.focus();
      },
      value: input,
    });
    onClickProp?.(event);
  };
  if (!render) {
    // oxlint-disable-next-line jsx-a11y/control-has-associated-label
    render = <button type='button' />;
  }
  return useRender({ props: { ...props, className, onClick }, render });
}

type PopupProps = Omit<Base.PopupProps, 'open'>;

function Popup(props: Autocomplete.Popup.Props): ReactElement {
  const { open } = usePopupContext();
  const { options } = Base.useAutocomplete();
  return <Base.Popup {...props} open={open ?? options.length > 0} />;
}

interface PopupContext {
  readonly open: boolean | null;
  readonly setOpen: Dispatch<SetStateAction<boolean | null>>;
}

const [PopupContextProvider, usePopupContext$] = createValueProvider<
  PopupContext
>();

function usePopupContext(): PopupContext {
  return usePopupContext$();
}

// #endregion
