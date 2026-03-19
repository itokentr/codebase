import { Radio as Base } from '@lib/react/base-ui/form/radio-button';
import { MultilineText } from '@lib/react/client/dom';
import type { ReactElement } from 'react';
import styles from './radio-button.module.css';

Base.classNames.add({
  group: styles.RadioButtonGroup,
  indicator: styles.Indicator,
  label: styles.Label,
  root: styles.RadioButton,
});

export function Radio(
  { label: labelText, ...props }: Base.Props,
): ReactElement {
  const label = (
    <span className={styles.LabelText}>
      <MultilineText>{labelText}</MultilineText>
    </span>
  );
  return (
    <Base
      {...props}
      indicator={
        <svg className={styles.Icon} width='18' height='13' viewBox='0 0 18 13'>
          <polygon points='5.9 12.5 .3 7.4 1.7 6 5.9 9.8 16.3 .5 17.7 1.9 5.9 12.5' />
        </svg>
      }
      label={label}
    >
    </Base>
  );
}

export const RadioGroup = Base.Group;
