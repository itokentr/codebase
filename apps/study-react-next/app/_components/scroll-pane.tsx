'use client';
import { ScrollArea } from '@base-ui/react/scroll-area';
import { classNames } from '@lib/react/client/dom';
import type { PropsWithChildren, ReactElement } from 'react';
import styles from './scroll-pane.module.css';

export type ScrollPaneProps = PropsWithChildren<{
  readonly className?: string;
}>;

export function ScrollPane({
  children,
  className,
}: ScrollPaneProps): ReactElement {
  return (
    <ScrollArea.Root className={styles.ScrollArea}>
      <ScrollArea.Viewport className={styles.Viewport}>
        <ScrollArea.Content className={classNames(styles.Content, className)}>
          {children}
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className={styles.Scrollbar}>
        <ScrollArea.Thumb className={styles.Thumb} />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
