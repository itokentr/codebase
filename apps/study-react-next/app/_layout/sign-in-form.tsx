'use client';
import { redirect, usePathname, useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { useActionState } from 'react';
import { type SignInFormControls, signIn } from '../_actions/sign-in.ts';
import { Button } from '../_components/forms/button.tsx';
import { Checkbox } from '../_components/forms/checkbox.tsx';
import { Field } from '../_components/forms/field.tsx';
import { Form } from '../_components/forms/form.tsx';
import { Input } from '../_components/forms/input.tsx';
import { LinkText } from '../_components/link.tsx';
import styles from './sign-in-form.module.css';

const defaultValues: SignInFormControls = {
  email: 'error@example.com',
  keepSession: '',
  password: 'password',
};

export function SignInForm(): ReactNode {
  const [state, action, pending] = useActionState(signIn, undefined);
  const currentPath = usePathname();
  const query = useSearchParams().toString();

  if (state?.success) {
    redirect(`${currentPath}${query ? `?${query}` : ''}` as '/');
  }
  return (
    <Form
      action={action}
      autoComplete='on'
      className={styles.Form}
      defaultValues={defaultValues}
      disabled={pending}
      errors={state?.errors}
    >
      <Field name='email'>
        <Field.Label className={styles.Label}>メールアドレス</Field.Label>
        <Input autoComplete='email' required type='email' />
        <Field.Error />
      </Field>
      <Field name='password'>
        <Field.Label className={styles.Label}>パスワード</Field.Label>
        <Input autoComplete='current-password' required type='password' />
        <Field.Error />
      </Field>
      <nav>
        <LinkText href='#'>パスワードを忘れた方</LinkText>
      </nav>
      <Field name='keepSession'>
        <Checkbox label='次回から自動的にログイン' />
      </Field>
      <Button type='submit'>ログイン</Button>
    </Form>
  );
}
