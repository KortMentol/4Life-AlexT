/**
 * @module src/lib/lenis.ts
 * @description Этот модуль инициализирует и настраивает синглтон-экземпляр библиотеки Lenis для плавной прокрутки.
 * Он экспортирует сам экземпляр `lenis` и набор утилитарных функций для управления скроллом: запуск и остановка,
 * прокрутка к элементу и обновление при изменениях в DOM. Конфигурация оптимизирована для десктопных и мобильных устройств,
 * обеспечивая нативный скролл на мобильных для лучшего UX.
 * @author Kort
 * @version 1.0.0
 * @see src/lib/lenis.types.ts
 * @see https://github.com/studio-freight/lenis
 * @usage
 * 1. `src/components/layout/Layout.tsx`: Инициализирует RAF-цикл с помощью `startLenisRaf`.
 * 2. `src/components/layout/Header.tsx`: Использует `scrollTo` для навигации по якорным ссылкам.
 * 3. `src/components/layout/MobileMenu.tsx`: Использует `scrollTo` для навигации и `stopScroll`/`startScroll` для блокировки прокрутки при открытом меню.
 * 4. `src/components/ui/ScrollToTopButton.tsx`: Использует `scrollTo` для прокрутки наверх страницы.
 * 5. `src/hooks/useResetScrollOnNavigation.ts`: Использует `scrollTo` для сброса прокрутки при смене маршрута.
 * 6. `src/hooks/useScrollRestoration.ts`: Использует `updateScroll` для обновления Lenis при изменениях DOM.
 * @example
 * import { scrollTo } from '@/lib/lenis';
 *
 * const MyComponent = () => (
 *   <button onClick={() => scrollTo('#target-section')}>
 *     Scroll to Section
 *   </button>
 * );
 */
import Lenis from "@studio-freight/lenis";
import { LenisOptions, Lenis as LenisType } from "./lenis.types";

// Определяем, является ли устройство мобильным
const isMobile = typeof navigator !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Создаем экземпляр Lenis с оптимальными настройками для современного скроллинга
const lenisInstance = new Lenis({
  duration: isMobile ? 0.5 : 1.2, // Значительно уменьшенная длительность для мобильных устройств
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Улучшенный easing для плавного начала и конца
  orientation: "vertical", // Вертикальный скроллинг
  gestureOrientation: "vertical", // Жесты только вертикальные
  smoothWheel: true, // Плавный скролл колесиком
  wheelMultiplier: 1, // Множитель скорости колесика (стандартный)
  touchMultiplier: isMobile ? 2 : 1, // Значительно увеличенный множитель для тач-устройств на мобильных
  infinite: false, // Отключаем бесконечный скролл
  // Расширенные настройки
  smoothTouch: false, // Отключаем плавный scroll для тачскринов, чтобы сохранить нативный scroll и корректное скрытие тулбара
  // Отключаем syncTouch, чтобы Lenis не блокировал нативные события и тулбар мог скрываться
  syncTouch: false,
  lerp: isMobile ? 0.05 : 0.1, // Уменьшаем линейную интерполяцию для мобильных (ближе к мгновенному)
} as LenisOptions);

// Добавляем свойство velocity, которое требуется в нашем типе Lenis
// Добавляем свойство velocity в экземпляр Lenis
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(lenisInstance as any).velocity = 0;

/**
 * @description Синглтон-экземпляр Lenis, настроенный с оптимальными параметрами.
 * @type {LenisType}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lenis = lenisInstance as any as LenisType;

/**
 * @description Запускает цикл `requestAnimationFrame` (RAF) для Lenis, который обеспечивает плавную анимацию скролла.
 * Функция также добавляет обработчики для оптимизации производительности: приостанавливает RAF, когда вкладка неактивна,
 * и очищает его при выгрузке страницы.
 */
export const startLenisRaf = () => {
  let rafId: number;
  let lastTime = 0;

  // Оптимизированная функция RAF с ограничением частоты кадров для мобильных устройств
  const raf = (time: number) => {
    // Для мобильных устройств можно ограничить частоту обновлений для экономии ресурсов
    if (isMobile) {
      // Обновляем не чаще 60 раз в секунду на мобильных
      if (time - lastTime > 16) {
        // ~60fps
        lenis.raf(time);
        lastTime = time;
      }
    } else {
      // На десктопе обновляем каждый кадр
      lenis.raf(time);
    }

    rafId = requestAnimationFrame(raf);
  };

  rafId = requestAnimationFrame(raf);

  // Добавляем обработчик для остановки RAF при переходе между страницами
  const handleBeforeUnload = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
    lenis.velocity = 0;
  };

  // Добавляем обработчик для оптимизации при потере фокуса (экономия батареи)
  const handleVisibilityChange = () => {
    if (document.hidden) {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    } else if (!rafId) {
      rafId = requestAnimationFrame(raf);
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  document.addEventListener("visibilitychange", handleVisibilityChange);
};

/**
 * @description Утилита для плавной прокрутки к указанной цели (элемент, селектор или числовое значение).
 * На мобильных устройствах использует нативный `window.scrollTo` для мгновенной прокрутки вверх,
 * в остальных случаях делегирует управление Lenis.
 * @param {string | HTMLElement | number} target - Цель для прокрутки.
 * @param {LenisScrollToOptions} [options={}] - Дополнительные опции для Lenis.
 */
export const scrollTo = (target: string | HTMLElement | number, options = {}) => {
  // Определяем, является ли устройство мобильным
  const isMobileDevice = typeof navigator !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // На мобильных устройствах используем нативный скролл для мгновенного отклика
  if (isMobileDevice && typeof target === "number" && target === 0) {
    // Если скроллим в начало страницы на мобильном устройстве
    window.scrollTo({
      top: 0,
      behavior: "auto", // Используем 'auto' вместо 'smooth' для мгновенного скролла
    });
    return;
  }

  // В остальных случаях используем Lenis
  lenis.scrollTo(target, {
    offset: 0,
    immediate: isMobileDevice, // Мгновенный скролл на мобильных
    duration: isMobileDevice ? 0.5 : 1.2, // Еще меньшая длительность для мобильных
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    ...options,
  });
};

/**
 * @description Полностью останавливает скролл Lenis.
 */
export const stopScroll = () => {
  lenis.stop();
  // Сбрасываем скорость и инерцию при остановке
  lenis.velocity = 0;
};

/**
 * @description Возобновляет скролл Lenis после остановки.
 */
export const startScroll = () => lenis.start();

/**
 * @description Пересчитывает размеры и обновляет экземпляр Lenis.
 * Необходимо вызывать при изменениях в DOM, которые влияют на высоту страницы (например, открытие/закрытие аккордеона).
 */
export const updateScroll = () => lenis.resize();
