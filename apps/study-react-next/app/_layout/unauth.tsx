import type { PropsWithChildren, ReactElement } from 'react';
import { HtmlRootLayout } from './html-root.tsx';
import styles from './unauth.module.css';

export function UnauthLayout({ children }: PropsWithChildren): ReactElement {
  return (
    <HtmlRootLayout>
      <div className={styles.Root}>
        <header className={styles.Header}>
          <abbr title='something'>LOGO</abbr>
        </header>
        <main className={styles.Main}>{children}</main>
      </div>
    </HtmlRootLayout>
  );
}
