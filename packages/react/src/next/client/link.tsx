'use client';
import Base from 'next/link';
import { usePathname } from 'next/navigation';
import type { UrlObject } from 'node:url';
import type { ComponentPropsWithRef, ReactElement } from 'react';
import { classNames } from '../../client/dom/class-name.ts';
import { hrefCanActive } from '../../client/util/href-can-active.ts';

export interface LinkProps<Path extends string | UrlObject> extends Omit<
  ComponentPropsWithRef<typeof Base>,
  'href'
> {
  readonly classNameActive?: string;
  readonly classNameSemiActive?: string;
  readonly excludeActive?: readonly (string | RegExp)[];
  readonly excludeSemiActive?: readonly (string | RegExp)[];
  readonly href: Path;
}

export function Link<Path extends string | UrlObject>({
  className,
  classNameActive = 'active',
  classNameSemiActive = 'semi-active',
  excludeActive,
  excludeSemiActive,
  href,
  ...props
}: LinkProps<Path>): ReactElement {
  const currentPath = usePathname();
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
    <Base
      aria-current={ariaCurrent}
      className={className}
      // type of `href` will be changed when `typedRoutes: true` is in next.config.ts
      // eslint-disable-next-line
      href={href as any}
      {...props}
    />
  );
}
