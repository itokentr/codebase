import preview from '../../../.storybook/preview.ts';
import { Button } from './button.tsx';

const meta = preview.meta({
  component: Button,
});

export const Disabled = meta.story({
  args: {
    children: 'ログイン',
    disabled: true,
  },
});

export const SignIn = meta.story({
  args: {
    children: 'ログイン',
    type: 'submit',
  },
});
