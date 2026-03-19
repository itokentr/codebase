import type { BezierDefinition, ValueTransition } from 'motion/react';

// from https://m3.material.io/styles/motion/overview/specs#1b299695-5822-4738-ae56-ef9389b412d2

export const expressiveFastSpatial: Readonly<ValueTransition> = {
  duration: 0.35,
  ease: [0.42, 1.67, 0.21, 0.9],
};
export const expressiveDefaultSpatial: Readonly<ValueTransition> = {
  duration: 0.5,
  ease: [0.38, 1.21, 0.22, 1.0],
};
export const expressiveSlowSpatial: Readonly<ValueTransition> = {
  duration: 0.65,
  ease: [0.39, 1.29, 0.35, 0.98],
};
export const expressiveFastEffects: Readonly<ValueTransition> = {
  duration: 0.15,
  ease: [0.31, 0.94, 0.34, 1.0],
};
export const expressiveDefaultEffects: Readonly<ValueTransition> = {
  duration: 0.2,
  ease: [0.34, 0.8, 0.34, 1.0],
};
export const expressiveSlowEffects: Readonly<ValueTransition> = {
  duration: 0.3,
  ease: [0.34, 0.88, 0.34, 1.0],
};
export const standardFastSpatial: Readonly<ValueTransition> = {
  duration: 0.35,
  ease: [0.27, 1.06, 0.18, 1.0],
};
export const standardDefaultSpatial: Readonly<ValueTransition> = {
  duration: 0.5,
  ease: [0.27, 1.06, 0.18, 1.0],
};
export const standardSlowSpatial: Readonly<ValueTransition> = {
  duration: 0.75,
  ease: [0.27, 1.06, 0.18, 1.0],
};
export const standardFastEffects: Readonly<ValueTransition> = {
  duration: 0.15,
  ease: [0.31, 0.94, 0.34, 1.0],
};
export const standardDefaultEffects: Readonly<ValueTransition> = {
  duration: 0.2,
  ease: [0.34, 0.8, 0.34, 1.0],
};
export const standardSlowEffects: Readonly<ValueTransition> = {
  duration: 0.3,
  ease: [0.34, 0.88, 0.34, 1.0],
};

// from https://m3.material.io/styles/motion/easing-and-duration/tokens-specs#433b1153-2ea3-4fe2-9748-803a47bc97ee

export const emphasizedDecelerate: BezierDefinition = [0.05, 0.7, 0.1, 1.0];
export const emphasizedAccelerate: BezierDefinition = [0.3, 0.0, 0.8, 0.15];
export const standardDecelerate: BezierDefinition = [0, 0, 0, 1];
export const standardAccelerate: BezierDefinition = [0.3, 0, 1, 1];

// from https://m3.material.io/styles/motion/easing-and-duration/tokens-specs#c009dec6-f29b-4503-b9f0-482af14a8bbd

export const durationShort1: number = 0.5;
export const durationShort2: number = 0.1;
export const durationShort3: number = 0.15;
export const durationShort4: number = 0.2;
export const durationMedium1: number = 0.25;
export const durationMedium2: number = 0.3;
export const durationMedium3: number = 0.35;
export const durationMedium4: number = 0.4;
export const durationLong1: number = 0.45;
export const durationLong2: number = 0.5;
export const durationLong3: number = 0.55;
export const durationLong4: number = 0.6;

//

export const emphasizedEnterTransition: Readonly<ValueTransition> = {
  duration: durationMedium2,
  ease: emphasizedDecelerate,
};
export const emphasizedExitTransition: Readonly<ValueTransition> = {
  duration: durationShort4,
  ease: emphasizedAccelerate,
};
export const standardEnterTransition: Readonly<ValueTransition> = {
  duration: durationShort4,
  ease: standardDecelerate,
};
export const standardExitTransition: Readonly<ValueTransition> = {
  duration: durationShort3,
  ease: standardAccelerate,
};
