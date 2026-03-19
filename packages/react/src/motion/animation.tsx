import type { TargetAndTransition } from 'motion/react';

export type AnimationTarget = Omit<
  TargetAndTransition,
  'transition' | 'transitionEnd'
>;
