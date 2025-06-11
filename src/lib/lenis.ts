import Lenis from "@studio-freight/lenis";
import { LenisOptions, Lenis as LenisType } from "./lenis.types";

// Создаем экземпляр Lenis с оптимальными настройками для современного скроллинга
const lenisInstance = new Lenis({
  duration: 1.2, // Оптимальная длительность для плавности
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Улучшенный easing для плавного начала и конца
  orientation: "vertical", // Вертикальный скроллинг
  gestureOrientation: "vertical", // Жесты только вертикальные
  smoothWheel: true, // Плавный скролл колесиком
  wheelMultiplier: 1, // Множитель скорости колесика (стандартный)
  touchMultiplier: 1, // Стандартный множитель для тач-устройств (уменьшен для более естественного скролла)
  infinite: false, // Отключаем бесконечный скролл
  // Расширенные настройки
  smoothTouch: true, // Включаем плавный скролл для тачскринов
  syncTouch: true, // Синхронизация тач-событий для предотвращения проблем с инерцией
  syncTouchLerp: 0.05, // Уменьшенный коэффициент интерполяции для более плавной синхронизации тач-событий
} as LenisOptions);

// Добавляем свойство velocity, которое требуется в нашем типе Lenis
// Добавляем свойство velocity в экземпляр Lenis
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(lenisInstance as any).velocity = 0;

// Экспортируем с правильным типом
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lenis = lenisInstance as any as LenisType;

// Функция для запуска RAF (Request Animation Frame) цикла
export const startLenisRaf = () => {
  let rafId: number;

  const raf = (time: number) => {
    lenis.raf(time);
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

  window.addEventListener("beforeunload", handleBeforeUnload);
};

// Вспомогательные функции для управления скроллом
export const scrollTo = (
  target: string | HTMLElement | number,
  options = {},
) => {
  lenis.scrollTo(target, {
    offset: 0,
    immediate: false,
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    ...options,
  });
};

// Функция для остановки скролла
export const stopScroll = () => {
  lenis.stop();
  // Сбрасываем скорость и инерцию при остановке
  lenis.velocity = 0;
};

// Функция для возобновления скролла
export const startScroll = () => lenis.start();

// Функция для обновления Lenis при изменениях DOM
export const updateScroll = () => lenis.resize();
