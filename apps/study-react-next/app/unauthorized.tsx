import type { ReactNode } from 'react';
import { SignInForm } from './_layout/sign-in-form.tsx';
import { UnauthLayout } from './_layout/unauth.tsx';

export default function Unauthorized(): ReactNode {
  return (
    <UnauthLayout>
      <SignInForm />
    </UnauthLayout>
  );
}
