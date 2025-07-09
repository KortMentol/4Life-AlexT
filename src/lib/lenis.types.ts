/**
 * @module src/lib/lenis.types.ts
 * @description Определяет TypeScript-типы и интерфейсы для конфигурации и взаимодействия с библиотекой плавной прокрутки Lenis (@studio-freight/lenis).
 * @author Kort
 * @version 1.0.0
 * @see src/lib/lenis.ts
 * @usage
 * 1. `src/lib/lenis.ts`: Используется для типизации экземпляра Lenis и его функций.
 */

/**
 * @interface LenisOptions
 * @description Опции для инициализации экземпляра Lenis. Позволяют настроить поведение скролла, такое как продолжительность, easing-функции и множители для разных устройств ввода.
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

/**
 * @interface LenisScrollToOptions
 * @description Опции для метода `scrollTo` в Lenis. Позволяют управлять анимацией прокрутки к цели.
 */
export interface LenisScrollToOptions {
  offset?: number;
  immediate?: boolean;
  duration?: number;
  easing?: (t: number) => number;
  [key: string]: unknown;
}

/**
 * @type LenisScrollCallback
 * @description Тип для callback-функции, которая вызывается при событии 'scroll' в Lenis. Предоставляет информацию о текущем состоянии скролла.
 * @param {object} scrollInfo - Объект с данными о скролле.
 * @param {number} scrollInfo.scroll - Текущая позиция скролла.
 * @param {number} scrollInfo.limit - Максимальное значение скролла.
 * @param {number} scrollInfo.velocity - Текущая скорость скролла.
 * @param {number} scrollInfo.direction - Направление скролла (1 - вниз, -1 - вверх).
 * @param {number} scrollInfo.progress - Прогресс скролла от 0 до 1.
 */
export type LenisScrollCallback = (scrollInfo: {
  scroll: number;
  limit: number;
  velocity: number;
  direction: number;
  progress: number;
}) => void;

/**
 * @interface Lenis
 * @description Основной интерфейс, описывающий экземпляр Lenis. Включает свойства и методы для управления скроллом, подписки на события и жизненного цикла.
 */
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
