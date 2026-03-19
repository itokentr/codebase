import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { H1 } from './_components/h1.tsx';
import { AuthLayout } from './_layout/auth.tsx';

const title = 'ダッシュボード';

export const metadata: Metadata = {
  title,
};

export default function Dashboard(): ReactNode {
  return (
    <AuthLayout>
      <H1 text={title} />
    </AuthLayout>
  );
}
