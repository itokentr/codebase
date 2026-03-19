'use client';
import { Checkbox as Base } from '@lib/react/base-ui/form/checkbox';
import { MultilineText } from '@lib/react/client/dom';
import type { ReactElement } from 'react';
import styles from './checkbox.module.css';

Base.classNames.add({
  indicator: styles.Indicator,
  label: styles.Label,
  root: styles.Checkbox,
});

export function Checkbox({
  label: labelText,
  ...props
}: Base.Props): ReactElement {
  const label = (
    <span className={styles.LabelText}>
      <MultilineText>{labelText}</MultilineText>
    </span>
  );
  return <Base {...props} label={label} />;
}

export const CheckboxGroup = Base.Group;
