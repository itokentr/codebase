'use client';
import type { ReactElement } from 'react';
import type { LinkProps as BaseProps } from 'react-router';
import { Link as Base, useLocation, useResolvedPath } from 'react-router';
import { classNames } from '../../client/dom/class-name.ts';
import { hrefCanActive } from '../../client/util/href-can-active.ts';

export interface LinkProps<Path extends string> extends Omit<BaseProps, 'to'> {
  readonly classNameActive?: string;
  readonly classNameSemiActive?: string;
  readonly excludeActive?: readonly (string | RegExp)[];
  readonly excludeSemiActive?: readonly (string | RegExp)[];
  readonly to: Path;
}

export function Link<Path extends string = string>({
  className,
  classNameActive = 'active',
  classNameSemiActive = 'semi-active',
  excludeActive,
  excludeSemiActive,
  to,
  ...props
}: LinkProps<Path>): ReactElement {
  const currentPath = useLocation().pathname;
  const href = useResolvedPath(to, props).pathname;
  let ariaCurrent: 'page' | undefined;
  switch (
    hrefCanActive({ currentPath, excludeActive, excludeSemiActive, href })
  ) {
    case 'active': {
      className = classNames(className, classNameActive);
      ariaCurrent = 'page';
      break;
    }
    case 'semi-active': {
      className = classNames(className, classNameSemiActive);
      break;
    }
  }
  return (
    <Base aria-current={ariaCurrent} className={className} to={to} {...props} />
  );
}
