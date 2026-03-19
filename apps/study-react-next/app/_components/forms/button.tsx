'use client';
import { Form } from '@lib/react/base-ui/form/form';
import { MultilineText, classNames } from '@lib/react/client/dom';
import type {
  ButtonHTMLAttributes,
  FunctionComponent,
  JSX,
  PropsWithChildren,
  ReactElement,
  RefAttributes,
} from 'react';
import type { LinkProps } from '../link.tsx';
import { Link } from '../link.tsx';
import styles from './button.module.css';

export type ButtonProps = PropsWithChildren<
  & ButtonHTMLAttributes<HTMLButtonElement>
  & RefAttributes<HTMLButtonElement>
  & Partial<LinkProps>
  & {
    readonly icon?:
      | FunctionComponent<Omit<JSX.IntrinsicElements['svg'], 'children'>>
      | null;
    readonly iconProps?: Omit<JSX.IntrinsicElements['svg'], 'children'> | null;
  }
>;

export function Button({
  children,
  className,
  disabled,
  href,
  icon: Icon,
  iconProps,
  ...props
}: ButtonProps): ReactElement {
  const formContext = Form.useFormContext(true);
  const disabledValue = disabled ?? formContext?.disabled ?? false;
  const label = (
    <span className={styles.Label}>
      <MultilineText>{children}</MultilineText>
    </span>
  );
  const content = Icon
    ? (
      <>
        <Icon
          role='presentation'
          {...iconProps}
          className={classNames(styles.Icon, iconProps?.className)}
        />
        {label}
      </>
    )
    : label;
  if (href != undefined) {
    return (
      <Link
        {...props}
        aria-disabled={disabledValue}
        className={classNames(styles.Button, className)}
        href={href}
        inert={disabledValue}
      >
        {content}
      </Link>
    );
  }
  return (
    <button
      type='button'
      {...props}
      className={classNames(styles.Button, className)}
      disabled={disabledValue}
    >
      {content}
    </button>
  );
}
