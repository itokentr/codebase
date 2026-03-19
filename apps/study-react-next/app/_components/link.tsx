import type { LinkProps as BaseProps } from '@lib/react/next/client/link';
import { Link as Base } from '@lib/react/next/client/link';
import classNames from 'classnames';
import NextLink from 'next/link';
import type { ComponentProps, ReactElement } from 'react';
import styles from './link.module.css';

export type LinkHref =
  | Extract<ComponentProps<typeof NextLink>['href'], string>
  | `https://${string}`
  | `http://${string}`
  | '#';

export interface LinkProps extends BaseProps<LinkHref> {}

export function Link({ href, ...props }: LinkProps): ReactElement {
  return <Base {...props} href={href as string} />;
}

export function LinkText({ className, ...props }: LinkProps): ReactElement {
  return <Link className={classNames(styles.Link, className)} {...props} />;
}
