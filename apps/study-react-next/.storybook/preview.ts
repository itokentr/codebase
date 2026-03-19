import addonA11y from '@storybook/addon-a11y';
import { definePreview } from '@storybook/nextjs-vite';
import '../app/layout.tsx';

export default definePreview({
  addons: [addonA11y()],
  parameters: {
    a11y: {
      test: 'todo',
    },
  },
});
