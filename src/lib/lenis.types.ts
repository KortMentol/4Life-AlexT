/**
 * Типы для библиотеки Lenis
 */

export interface LenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  orientation?: "vertical" | "horizontal";
  gestureOrientation?: "vertical" | "horizontal";
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  infinite?: boolean;
  smoothTouch?: boolean;
  syncTouch?: boolean;
  syncTouchLerp?: number;
  [key: string]: unknown;
}

export interface LenisScrollToOptions {
  offset?: number;
  immediate?: boolean;
  duration?: number;
  easing?: (t: number) => number;
  [key: string]: unknown;
}

export interface Lenis {
  velocity: number;
  stop: () => void;
  start: () => void;
  raf: (time: number) => void;
  scrollTo: (
    target: string | HTMLElement | number,
    options?: LenisScrollToOptions,
  ) => void;
  resize: () => void;
  [key: string]: unknown;
}
