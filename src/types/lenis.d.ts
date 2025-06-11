declare module "lenis" {
  export default class Lenis {
    constructor(options: LenisOptions);

    /**
     * Обновляет анимацию прокрутки
     * @param time Временная метка для анимации
     */
    raf(time: number): void;

    /**
     * Уничтожает экземпляр Lenis и освобождает ресурсы
     */
    destroy(): void;

    /**
     * Обновляет размеры при изменении окна
     */
    resize(): void;

    /**
     * Прокручивает к указанной цели
     * @param target Элемент или позиция для прокрутки
     * @param options Опции прокрутки
     */
    scrollTo(
      target: number | HTMLElement | string,
      options?: LenisScrollOptions,
    ): void;

    /**
     * Останавливает прокрутку
     */
    stop(): void;

    /**
     * Запускает прокрутку
     */
    start(): void;
  }

  export interface LenisOptions {
    /**
     * Длительность анимации прокрутки в секундах
     */
    duration?: number;

    /**
     * Функция плавности (easing)
     */
    easing?: (t: number) => number;

    /**
     * Направление прокрутки
     */
    direction?: "vertical" | "horizontal";

    /**
     * Направление жестов
     */
    gestureDirection?: "vertical" | "horizontal" | "both";

    /**
     * Включить плавную прокрутку
     */
    smooth?: boolean;

    /**
     * Множитель скорости прокрутки мышью
     */
    mouseMultiplier?: number;

    /**
     * Включить плавную прокрутку на сенсорных устройствах
     */
    smoothTouch?: boolean;

    /**
     * Множитель скорости прокрутки на сенсорных устройствах
     */
    touchMultiplier?: number;

    /**
     * Включить бесконечную прокрутку
     */
    infinite?: boolean;

    /**
     * Обработчик события прокрутки
     */
    onScroll?: (instance: Lenis) => void;
  }

  export interface LenisScrollOptions {
    /**
     * Смещение от цели в пикселях
     */
    offset?: number;

    /**
     * Мгновенная прокрутка без анимации
     */
    immediate?: boolean;

    /**
     * Длительность анимации прокрутки в секундах
     */
    duration?: number;

    /**
     * Функция плавности (easing)
     */
    easing?: (t: number) => number;

    /**
     * Обработчик завершения прокрутки
     */
    onComplete?: () => void;
  }
}
