'use client';
import { Field } from '@lib/react/base-ui/form/field';
import styles from './field.module.css';

Field.classNames.add({
  error: styles.Error,
  label: styles.Label,
  root: styles.Root,
});

export { Field };
