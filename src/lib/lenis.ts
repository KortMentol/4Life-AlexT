/**
 * @module src/lib/lenis.ts
 * @description Инициализирует и конфигурирует синглтон-экземпляр Lenis для управления плавной прокруткой в приложении.
 * Экспортирует инстанс `lenis` и утилитарные функции для глобального контроля над скроллом.
 * @author Kort
 * @version 2.1.0
 * @see https://github.com/studio-freight/lenis
 * @usage
 * Этот модуль теперь автоматически запускает цикл анимации. Просто импортируйте `lenis` или любую утилиту.
 * import { lenis, scrollTo } from '@/lib/lenis';
 */
import Lenis from "lenis";
import { LenisOptions, Lenis as LenisType } from "./lenis.types";

// 1. Создаем и экспортируем ЕДИНСТВЕННЫЙ экземпляр Lenis
export const lenis = new Lenis({

  syncTouch: true,

} as LenisOptions) as any as LenisType;

// Добавляем кастомное свойство, если оно нужно для вашего типа
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(lenis as any).velocity = 0;

// 2. Запускаем цикл анимации СРАЗУ ЖЕ при загрузке этого модуля
// Это гарантирует, что `lenis` всегда будет 'живым'
if (typeof window !== "undefined") {
  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

// 3. Экспортируем утилитарные функции, которые работают с нашим экземпляром

/**
 * @description Плавно прокручивает страницу к указанной цели.
 */
export const scrollTo = (target: string | HTMLElement | number, options = {}) => {
  const isMobileDevice = typeof navigator !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobileDevice && typeof target === "number" && target === 0) {
    window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }

  lenis.scrollTo(target, {
    offset: 0,
    immediate: false,
    duration: 1.5,
    easing: (t: number) => (t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2),
    ...options,
  });
};

/**
 * @description Мгновенно останавливает любую активную плавную прокрутку.
 */
export const stopScroll = () => lenis.stop();

/**
 * @description Возобновляет обработку событий прокрутки.
 */
export const startScroll = () => lenis.start();

/**
 * @description Принудительно пересчитывает размеры контейнера прокрутки.
 */
export const updateScroll = () => lenis.resize();
