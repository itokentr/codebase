import type { Named } from '../../data/named.ts';
import { GeneralError } from './general-error.ts';

export abstract class NamedError<T extends string>
  extends GeneralError
  implements Named<T>
{
  abstract override readonly name: T;
}
