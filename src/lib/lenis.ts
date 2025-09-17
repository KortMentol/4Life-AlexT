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
import { LenisOptions, LenisScrollToOptions, Lenis as LenisType } from "./lenis.types";

// Определяем мобильное устройство (аналогично useIsMobile хуку)
const isMobile = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= 767;
};

// 1. Создаем и экспортируем ЕДИНСТВЕННЫЙ экземпляр Lenis
export const lenis = new Lenis({
  syncTouch: true,
  lerp: 0.07, // Ключевой параметр: 0.05-0.08 дает ощущение "тягучести"
  duration: isMobile() ? 1.5 : 2.2, // mobile: 1.5, desktop: 1.7
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Плавное замедление
  smoothWheel: true,
  normalizeWheel: true,
  wheelMultiplier: 1.0, // Стандартная скорость колеса
  touchMultiplier: 2.5, // Немного ускорить скролл на тач-устройствах
  infinite: false,
} as LenisOptions) as unknown as LenisType;

// Добавляем кастомное свойство, если оно нужно для вашего типа
lenis.velocity = 0;

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
