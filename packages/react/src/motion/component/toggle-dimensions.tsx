'use client';
import { MotionConfig, useMotionValue } from 'motion/react';
import { useLayoutEffect, useRef } from 'react';
import { createValueProvider } from '../../client/state/value-provider.tsx';
import { standardExitTransition } from '../easing/md3.tsx';
import type {
  GeneralMotionComponentProps,
  GeneralNoMotionComponentProps,
} from './create.tsx';
import { createMotionComponent } from './create.tsx';

export interface ToggleDimensionsConfig extends Pick<
  GeneralMotionComponentProps,
  'transition'
> {}

const [ToggleDimensionsConfigProvider, useToggleDimensionsConfig] =
  createValueProvider<ToggleDimensionsConfig>({
    transition: standardExitTransition,
  });
export { ToggleDimensionsConfigProvider };

export type ToggleDimensionsProps = GeneralNoMotionComponentProps &
  (ToggleDimensionsConfig | object);

export const ToggleDimensions = createMotionComponent(
  ($, props: ToggleDimensionsProps) => {
    const ref = useRef<HTMLElement | null>(null);
    const height = useMotionValue(0);
    let { transition } = useToggleDimensionsConfig();
    const userConfig = props as Partial<ToggleDimensionsConfig>;
    transition = userConfig.transition ?? transition;
    useLayoutEffect(() => {
      const { current: target } = ref;
      if (target) {
        height.set(target.getBoundingClientRect().height);
      }
    });
    return (
      <MotionConfig transition={transition}>
        <$ key={1} ref={ref} height={height} {...props} />
      </MotionConfig>
    );
  },
);
