'use client';
import { classNames } from '@lib/react/client/dom';
import { Link } from '@lib/react/next/client/link';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import type { ComponentProps, ReactElement } from 'react';
import { useState } from 'react';
import type { CurrentUser } from '../_types/current-user.ts';
import styles from './header.module.css';
import { Navigation } from './navigation.tsx';

export type HeaderProps = Omit<ComponentProps<'header'>, 'children'> & {
  readonly user: CurrentUser;
};

export function Header({ user, ...props }: HeaderProps): ReactElement {
  const [expanded, setExpanded] = useState(true);
  const classNameValue = classNames(props, styles.Header);
  function onExpanderClick(): void {
    setExpanded(!expanded);
  }
  return (
    <header {...props} className={classNameValue} data-expanded={expanded}>
      <b className={styles.Logo}>
        <Link className={styles.LogoText} href='/'>
          <abbr title='something'>LOGO</abbr>
        </Link>
      </b>
      <Navigation user={user} className={styles.Navigation} />
      <button
        className={styles.Expander}
        onClick={onExpanderClick}
        role='none'
        type='button'
      >
        <ArrowBackIosNewIcon className={styles.ExpanderIcon} />
      </button>
    </header>
  );
}
