/**
 * @module src/lib/lenis.ts
 * @description Инициализирует и конфигурирует синглтон-экземпляр Lenis для управления плавной прокруткой в приложении.
 * Экспортирует инстанс `lenis` и утилитарные функции для глобального контроля над скроллом.
 * @author Kort
 * @version 3.0.0 - AWWWARDS 2026 PROFESSIONAL FIXES
 * @see https://github.com/studio-freight/lenis
 * @usage
 * Этот модуль теперь автоматически запускает цикл анимации. Просто импортируйте `lenis` или любую утилиту.
 * import { lenis, scrollTo } from '@/lib/lenis';
 */
import Lenis from "lenis";
import { LenisOptions, LenisScrollToOptions, Lenis as LenisType } from "./lenis.types";

// Определяем мобильное устройство (аналогично useIsMobile хуку)
const isMobile = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= 767;
};

// 1. Создаем и экспортируем ЕДИНСТВЕННЫЙ экземпляр Lenis
export const lenis = new Lenis({
  syncTouch: true,
  lerp: 0.07, // ОРИГИНАЛЬНОЕ значение - возвращаем как было
  duration: isMobile() ? 1.5 : 2.2, // ОРИГИНАЛЬНЫЕ значения
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ОРИГИНАЛЬНЫЙ easing
  smoothWheel: true,
  normalizeWheel: true,
  wheelMultiplier: 1.0,
  touchMultiplier: 2.5,
  infinite: false,
  gestureOrientation: "vertical",
} as LenisOptions) as unknown as LenisType;

// Добавляем кастомное свойство, если оно нужно для вашего типа
lenis.velocity = 0;

// RAF управляется через GSAP ticker в App.tsx — не запускаем здесь свой loop
// Это предотвращает двойной вызов lenis.raf() каждый кадр

// 3. Экспортируем утилитарные функции, которые работают с нашим экземпляром

/**
 * @description Плавно прокручивает страницу к указанной цели.
 */
export const scrollTo = (target: string | HTMLElement | number, options: LenisScrollToOptions = {}) => {
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

// AWWWARDS 2026: Экспорт состояния скролла для компонентов
export const getScrollState = () => ({
  isScrolling: false,
  scroll: (lenis as any).scroll || 0,
  velocity: (lenis as any).velocity || 0,
});
