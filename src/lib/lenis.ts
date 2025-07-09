import Lenis from "@studio-freight/lenis";
import { LenisOptions, Lenis as LenisType } from "./lenis.types";

// Создаем экземпляр Lenis с настройками, имитирующими Locomotive Scroll
const lenisInstance = new Lenis({
  // --- КЛЮЧЕВЫЕ ПАРАМЕТРЫ ДЛЯ ВЯЗКОСТИ И ПЛАВНОСТИ ---

  // 1. lerp (Linear Interpolation) - главный параметр "вязкости".
  // Значение 0.07 уже хорошее, но для максимальной "тягучести" можно попробовать 0.05 - 0.06.
  // Чем ниже, тем медленнее скролл "догоняет" реальную позицию.
  lerp: 0.06,

  // 2. wheelMultiplier - множитель скорости для колеса мыши.
  // Уменьшаем его, чтобы скролл стал "тяжелее" и требовал больше движений колесом.
  wheelMultiplier: 1.3,

  // 3. touchMultiplier - множитель скорости для касаний.
  // Также уменьшаем для создания ощущения "сопротивления" и инерции на мобильных.
  touchMultiplier: 0.9,

  // --- НАСТРОЙКИ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ ---

  // 4. syncTouch - ОБЯЗАТЕЛЬНО true.
  // Позволяет Lenis работать вместе с нативным скроллом, что критично для жестов,
  // таких как "pull-to-refresh" и правильной работы горизонтальных свайпов.
  syncTouch: true,

  // 5. smoothTouch - Устанавливаем в false.
  // Когда syncTouch: true, лучше отключить собственную эмуляцию плавности Lenis для тач-событий,
  // чтобы избежать конфликтов и получить более предсказуемое, "нативное" ощущение инерции.
  smoothTouch: false, 

  // --- ОБЩИЕ НАСТРОЙКИ ---
  
  // Указываем, что Lenis управляет прокруткой всего окна.
  wrapper: window,
  
  // Отключаем бесконечную прокрутку.
  infinite: false,
  
  // Остальные параметры оставляем как есть, они хорошие.
  duration: 1.5,
  easing: (t) => (t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2),
  orientation: "vertical",
  gestureOrientation: "vertical",
  smoothWheel: true,
} as LenisOptions);


// --- УТИЛИТАРНЫЕ ФУНКЦИИ ---

// Приводим инстанс к нашему типу LenisType
export const lenis = lenisInstance as any as LenisType;
// Добавляем свойство velocity, которое требуется в нашем типе Lenis
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(lenis as any).velocity = 0;


/**
 * @description Запускает глобальный requestAnimationFrame цикл для Lenis.
 * Этот цикл будет обновлять позицию скролла на каждом кадре, создавая плавность.
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
      if(rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    } else if (!rafId) {
      rafId = requestAnimationFrame(raf);
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
};

// Функции scrollTo, stopScroll, startScroll, updateScroll остаются без изменений.
// Они уже написаны хорошо.

export const scrollTo = (target: string | HTMLElement | number, options = {}) => {
  const isMobileDevice = typeof navigator !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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

export const stopScroll = () => {
  lenis.stop();
  lenis.velocity = 0;
};

export const startScroll = () => lenis.start();

export const updateScroll = () => lenis.resize();
