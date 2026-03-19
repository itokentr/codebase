import type { MotionConfigContext } from 'motion/react';
import { createValueProvider } from '../client/state/value-provider.tsx';

export interface MotionConfig {
  readonly nonce?: MotionConfigContext['nonce'];
  readonly reducedMotion?: MotionConfigContext['reducedMotion'];
  readonly transition?: MotionConfigContext['transition'];
}
const [MotionConfigProvider, useMotionConfig] =
  createValueProvider<MotionConfig>({});

export { MotionConfigProvider, useMotionConfig };
