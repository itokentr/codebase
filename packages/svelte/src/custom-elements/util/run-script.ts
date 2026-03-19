import { fork } from 'node:child_process';

export async function runScript(
  binPath: string,
  args: readonly string[],
  cwd: string,
): Promise<void> {
  // oxlint-disable-next-line typescript/no-invalid-void-type
  const { promise, reject, resolve } = Promise.withResolvers<void>();
  const child = fork(binPath, args, { cwd, silent: true });
  let stderr = '';

  child.stderr?.on('data', (chunk) => {
    stderr += String(chunk);
  });
  child.on('error', reject).on('exit', (code, signal) => {
    if (code === 0) {
      resolve();
    } else {
      reject(Error(stderr || (code ?? signal)?.toString()));
    }
  });
  await promise;
}
