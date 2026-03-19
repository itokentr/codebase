import { program } from '@commander-js/extra-typings';
import packageJson from '../../package.json' with { type: 'json' };
import { create } from './commands/create.ts';

export async function main(argv: readonly string[]): Promise<void> {
  program
    .name('scaffold')
    .version(packageJson.version)
    .addCommand(create, { isDefault: true });
  await program.parseAsync(argv);
}
