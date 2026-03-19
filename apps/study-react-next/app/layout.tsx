import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './_styles/app.css';

export const metadata: Metadata = {
  title: {
    default: 'App',
    template: '%s | App',
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>): ReactNode {
  return children;
}
