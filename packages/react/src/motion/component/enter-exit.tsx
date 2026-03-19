'use client';
import type { ValueTransition } from 'motion/react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { createValueProvider } from '../../client/state/value-provider.tsx';
import type { AnimationTarget } from '../animation.tsx';
import {
  standardEnterTransition,
  standardExitTransition,
} from '../easing/md3.tsx';
import type { GeneralNoMotionComponentProps } from './create.tsx';
import { createMotionComponent } from './create.tsx';

export interface EnterExitConfig {
  readonly enterTarget: AnimationTarget;
  readonly enterTransition: Readonly<ValueTransition>;
  readonly exitTarget: AnimationTarget;
  readonly exitTransition: Readonly<ValueTransition>;
}
const [EnterExitConfigProvider, useEnterExitConfig] =
  createValueProvider<EnterExitConfig>({
    enterTarget: { height: 'auto', opacity: 1 },
    enterTransition: standardEnterTransition,
    exitTarget: { height: 0, opacity: 0 },
    exitTransition: standardExitTransition,
  });
export { EnterExitConfigProvider };

export type EnterExitProps = GeneralNoMotionComponentProps &
  (EnterExitConfig | object) & {
    readonly enter: boolean;
  };

export const EnterExit = createMotionComponent(($, props: EnterExitProps) => {
  let { enterTarget, enterTransition, exitTarget, exitTransition } =
    useEnterExitConfig();
  const userConfig = props as Partial<EnterExitConfig>;
  enterTarget = userConfig.enterTarget ?? enterTarget;
  enterTransition = userConfig.enterTransition ?? enterTransition;
  exitTarget = userConfig.exitTarget ?? exitTarget;
  exitTransition = userConfig.exitTransition ?? exitTransition;
  const { enter, ...otherProps } = props;
  return (
    <MotionConfig transition={enter ? enterTransition : exitTransition}>
      <AnimatePresence>
        {enter && (
          <$
            key={1}
            {...otherProps}
            animate={enterTarget}
            exit={exitTarget}
            initial={exitTarget}
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
});
