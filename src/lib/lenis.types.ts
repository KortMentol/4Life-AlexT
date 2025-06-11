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

// Определяем тип для callback-функции событий Lenis
export type LenisScrollCallback = (scrollInfo: {
  scroll: number;
  limit: number;
  velocity: number;
  direction: number;
  progress: number;
}) => void;

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
  on: (event: string, callback: LenisScrollCallback) => void;
  off: (event: string, callback: LenisScrollCallback) => void;
  [key: string]: unknown;
}
