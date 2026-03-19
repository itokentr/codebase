import { defineConfig } from 'vitest/config';
import { reactCompiler } from '../src/react-compiler/vite-plugin.ts';

const root = import.meta.dirname;

export default defineConfig(({ command }) => {
  return {
    plugins: [reactCompiler({ command, root })],
    root,
    test: {
      disableConsoleIntercept: false,
      environment: 'jsdom',
    },
  };
});
