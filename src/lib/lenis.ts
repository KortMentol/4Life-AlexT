/**
 * @module src/lib/lenis
 * @description Этот модуль инициализирует и настраивает библиотеку Lenis для создания эффекта плавной "вязкой" прокрутки,
 * имитирующей Locomotive Scroll. Он экспортирует сконфигурированный синглтон-экземпляр Lenis и утилитарные функции
 * для управления прокруткой во всем приложении. Конфигурация тщательно подобрана для обеспечения максимальной
 * плавности и отзывчивости на десктопных и мобильных устройствах.
 * @author Kort
 * @version 1.0.0
 * @see {@link https://lenis.studiofreight.com/docs|Документация Lenis}
 * @usage
 * 1. `src/hooks/useScrollRestoration.ts`: Используется функция `updateScroll` для обновления состояния скролла при восстановлении позиции.
 * 2. `src/hooks/useResetScrollOnNavigation.ts`: Используется экземпляр `lenis` для сброса прокрутки к верху страницы при навигации.
 * 3. `src/components/ui/ScrollToTopButton.tsx`: Используется экземпляр `lenis` для реализации плавной прокрутки наверх.
 * 4. `src/components/layout/Header.tsx`: Используется экземпляр `lenis` для отслеживания событий скролла и изменения состояния хедера.
 * 5. `src/components/layout/MobileMenu.tsx`: Используется экземпляр `lenis` для блокировки и разблокировки прокрутки при открытии/закрытии мобильного меню.
 * 6. `src/components/layout/Layout.tsx`: Используется функция `updateScroll` для пересчета размеров контейнера скролла при изменениях в DOM.
 * @example
 * // В корневом компоненте приложения (например, Layout.tsx)
 * // необходимо запустить цикл requestAnimationFrame для Lenis.
 * import { useEffect } from 'react';
 * import { startLenisRaf } from '@/lib/lenis';
 *
 * const Layout = ({ children }) => {
 *   useEffect(() => {
 *     startLenisRaf();
 *   }, []);
 *
 *   return <main>{children}</main>;
 * };
 */
import Lenis from "@studio-freight/lenis";
import { LenisOptions, Lenis as LenisType } from "./lenis.types";

// Создаем экземпляр Lenis с настройками для идеального мобильного скролла
const lenisInstance = new Lenis({
  // --- КЛЮЧЕВЫЕ ПАРАМЕТРЫ ДЛЯ ВЯЗКОСТИ И ПЛАВНОСТИ ---

  // 1. lerp - для максимальной плавности и "вязкости" как на giuligartner.com
  lerp: 0.07,

  // 2. wheelMultiplier - для десктопа, умеренная скорость
  wheelMultiplier: 1.5,

  // 3. touchMultiplier - критично для мобильных, делаем более чувствительным
  touchMultiplier: 1,

  // --- НАСТРОЙКИ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ ---

  // 4. syncTouch - включаем для работы с нативными жестами
  syncTouch: true,

  // 5. smoothTouch - ВКЛЮЧАЕМ для плавности на мобильных
  smoothTouch: true,

  // 6. syncTouchLerp - дополнительная плавность для тач-событий
  syncTouchLerp: 0.08,

  // --- ОБЩИЕ НАСТРОЙКИ ---

  wrapper: window,
  infinite: false,
  duration: 1.2,
  easing: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  orientation: "vertical",
  gestureOrientation: "vertical",
  smoothWheel: true,
} as LenisOptions);

// --- УТИЛИТАРНЫЕ ФУНКЦИИ ---

/**
 * @description Сконфигурированный экземпляр Lenis для управления плавной прокруткой.
 * @type {LenisType}
 */
export const lenis = lenisInstance as any as LenisType;
// Добавляем свойство velocity, которое требуется в нашем типе Lenis
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(lenis as any).velocity = 0;

/**
 * @description Запускает глобальный цикл requestAnimationFrame для Lenis.
 * Этот цикл необходим для обновления позиции скролла на каждом кадре, что создает эффект плавности.
 * Функция также содержит оптимизацию: цикл останавливается, когда вкладка браузера неактивна, и возобновляется при возвращении.
 * Вызывать эту функцию нужно один раз при инициализации приложения.
 */
export const startLenisRaf = () => {
  let rafId: number;

  const raf = (time: number) => {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  };

  rafId = requestAnimationFrame(raf);

  // Оптимизация: останавливаем RAF, когда вкладка неактивна
  const handleVisibilityChange = () => {
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    } else if (!rafId) {
      rafId = requestAnimationFrame(raf);
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
};

/**
 * @description Плавно прокручивает страницу к указанной цели.
 * @param {string | HTMLElement | number} target - Цель для прокрутки. Может быть CSS-селектором, DOM-элементом или числовым значением (позиция в пикселях).
 * @param {object} [options={}] - Дополнительные опции для Lenis.scrollTo().
 * @see {@link https://lenis.studiofreight.com/docs#methods-scrollto|Документация Lenis.scrollTo}
 */
export const scrollTo = (target: string | HTMLElement | number, options = {}) => {
  const isMobileDevice = typeof navigator !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Специальная обработка для скролла в самый верх на мобильных устройствах для избежания багов
  if (isMobileDevice && typeof target === "number" && target === 0) {
    window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }

  lenis.scrollTo(target, {
    offset: 0,
    immediate: false, // Нам нужна плавная анимация, а не мгновенная
    duration: 1.5, // Используем увеличенную длительность для плавности
    easing: (t: number) => (t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2),
    ...options,
  });
};

/**
 * @description Мгновенно останавливает любую активную плавную прокрутку.
 */
export const stopScroll = () => lenis.stop();

/**
 * @description Возобновляет обработку событий прокрутки после вызова stopScroll().
 */
export const startScroll = () => lenis.start();

/**
 * @description Принудительно пересчитывает размеры контейнера прокрутки.
 * Необходимо вызывать после динамического добавления/удаления контента или изменения размеров окна.
 */
export const updateScroll = () => lenis.resize();
