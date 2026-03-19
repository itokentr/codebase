import {
  MultilineText,
  classNames,
  flatReactNode,
} from '@lib/react/client/dom';
import type { ComponentProps, ReactElement } from 'react';
import styles from './h1.module.css';

export function H1({
  children,
  className,
  text,
  ...props
}: ComponentProps<'div'> & { readonly text: string }): ReactElement {
  const classNameValue = classNames(styles.Root, className);
  return (
    <div {...props} className={classNameValue}>
      <h1 className={styles.Heading}>
        <span className={styles.HeadingText}>
          <MultilineText>{text}</MultilineText>
        </span>
      </h1>
      {!children ? undefined : <Nav>{children}</Nav>}
    </div>
  );
}

function Nav({ children }: ComponentProps<'nav'>): ReactElement {
  const nodes = flatReactNode(children);
  return (
    <nav className={styles.Nav}>
      {nodes?.map((child, i) => (
        // oxlint-disable-next-line @eslint-react/no-array-index-key
        <div className={styles.NavItem} key={i}>
          {child}
        </div>
      ))}
    </nav>
  );
}
