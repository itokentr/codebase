import type { PropsWithChildren, ReactNode } from 'react';
import { Link } from '../_components/link.tsx';
import { getCurrentUser } from '../_states/current-user.ts';
import styles from './auth.module.css';
import { Header } from './header.tsx';
import { HtmlRootLayout } from './html-root.tsx';

export async function AuthLayout({
  children,
}: PropsWithChildren): Promise<ReactNode> {
  const user = await getCurrentUser();
  return (
    <HtmlRootLayout>
      <div className={styles.Root}>
        <Header className={styles.Header} user={user} />
        <div className={styles.Body}>
          <main className={styles.Main}>{children}</main>
          <footer className={styles.Footer}>
            <small>&copy; 株式会社○○○○○○○</small>
            <small>
              <Link href="#">個人情報保護方針</Link>
            </small>
          </footer>
        </div>
      </div>
    </HtmlRootLayout>
  );
}
