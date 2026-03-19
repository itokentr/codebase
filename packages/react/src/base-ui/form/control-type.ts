import type { StringLike } from '@lib/types';
import type { FormControlElementName } from '../../client/form/element-types.ts';
import type { ComponentStates } from '../dom/class-name.ts';
import type {
  BaseUiComponentCommonProps,
  BaseUiComponentProps,
} from '../dom/component-type.ts';

/**
 * @template P Base UI component properties like `Checkbox.Root.Props`
 * @template S Base UI component state like `Checkbox.Root.State`
 * @template O properties to be excluded from `P`
 * @template C descendant components of the component
 * @template E DOM element type bound with the component
 * @template V indicates that the component has controlled value
 */
export type FieldControlProps<
  P extends BaseUiComponentCommonProps<any, S, any>,
  S extends object,
  O extends keyof P | null = null,
  C extends ComponentStates | null = null,
  E extends FormControlElementName | '*' = FormControlElementName,
  V extends StringLike | number | null = null,
> = Omit<BaseUiComponentProps<P, S, O, C, E>, 'value'> &
  (NonNullable<V> extends never ? object : { readonly value?: V });
