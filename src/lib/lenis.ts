/**
 * @module src/lib/lenis.ts
 * @description Инициализирует синглтон Lenis только для десктопа.
 * На мобильных устройствах (<=767px) lenis = null, используется нативный скролл.
 * @author Kort
 * @version 4.0.0 - Mobile-native / Desktop-Lenis split
 */
import Lenis from "lenis";
import {
  LenisOptions,
  LenisScrollToOptions,
  Lenis as LenisType,
} from "./lenis.types";

const isMobile = () =>
  typeof window !== "undefined" && window.innerWidth <= 767;

let lenisInstance: LenisType | null = null;

if (!isMobile() && typeof window !== "undefined") {
  // --- ДЕСКТОПНАЯ ВЕРСИЯ: создаём настоящий Lenis ---
  lenisInstance = new Lenis({
    syncTouch: true,
    lerp: 0.07,
    duration: 2.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  } as LenisOptions) as unknown as LenisType;
}

// На мобильных lenis === null — компоненты должны это учитывать
export const lenis = lenisInstance;

// --- Утилиты, работающие как с Lenis, так и с нативным скроллом ---

/**
 * @description easeInOutQuint — та же кривая что на десктопе через Lenis.
 * Медленный старт → разгон → нежное торможение.
 */
const easeInOutQuint = (t: number): number =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

/** Активный RAF-скролл на мобайле — храним id чтобы отменять предыдущий */
let rafScrollId: number | null = null;

/**
 * @description Программный RAF-скролл для мобайла с кастомным easing.
 * Работает как Lenis на десктопе — полный контроль над кривой и duration.
 * Отменяется если пользователь коснётся экрана во время анимации.
 */
const rafScrollTo = (targetY: number, duration: number): void => {
  if (typeof window === "undefined") return;

  // Отменяем предыдущую анимацию если была
  if (rafScrollId !== null) {
    cancelAnimationFrame(rafScrollId);
    rafScrollId = null;
  }

  const startY = window.scrollY;
  const distance = targetY - startY;

  // Если уже там — ничего не делаем
  if (Math.abs(distance) < 1) return;

  const startTime = performance.now();
  const durationMs = duration * 1000;

  // Отмена по touch — пользователь начал скроллить сам
  const cancelOnTouch = () => {
    if (rafScrollId !== null) {
      cancelAnimationFrame(rafScrollId);
      rafScrollId = null;
    }
    window.removeEventListener("touchstart", cancelOnTouch, { capture: true });
  };
  window.addEventListener("touchstart", cancelOnTouch, {
    capture: true,
    passive: true,
  });

  const tick = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    const easedProgress = easeInOutQuint(progress);

    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) {
      rafScrollId = requestAnimationFrame(tick);
    } else {
      rafScrollId = null;
      window.removeEventListener("touchstart", cancelOnTouch, {
        capture: true,
      });
    }
  };

  rafScrollId = requestAnimationFrame(tick);
};

/**
 * @description Прокручивает страницу к цели.
 * Десктоп — через Lenis (easeInOutQuint).
 * Мобайл — через RAF с тем же easeInOutQuint для премиального ощущения.
 */
export const scrollTo = (
  target: string | HTMLElement | number,
  options: LenisScrollToOptions = {},
) => {
  if (lenis) {
    // Десктоп: используем Lenis
    lenis.scrollTo(target, { duration: 1.5, ...options });
  } else {
    // Мобайл: RAF-скролл с кастомным easing
    if (typeof window !== "undefined") {
      if (options.immediate) {
        // Мгновенный скролл (например при смене роута)
        let targetY = 0;
        if (typeof target === "number") {
          targetY = target + (options.offset || 0);
        } else {
          const el =
            typeof target === "string"
              ? (document.querySelector(target) as HTMLElement | null)
              : target;
          if (el)
            targetY =
              el.getBoundingClientRect().top +
              window.scrollY +
              (options.offset || 0);
        }
        window.scrollTo(0, targetY);
        return;
      }

      let targetY: number | undefined;
      if (typeof target === "number") {
        targetY = target + (options.offset || 0);
      } else {
        const el =
          typeof target === "string"
            ? (document.querySelector(target) as HTMLElement | null)
            : target;
        if (el)
          targetY =
            el.getBoundingClientRect().top +
            window.scrollY +
            (options.offset || 0);
      }

      if (targetY !== undefined) {
        rafScrollTo(targetY, options.duration ?? 1.2);
      }
    }
  }
};

/** @description Останавливает плавный скролл (только десктоп). */
export const stopScroll = () => lenis?.stop();

/** @description Возобновляет плавный скролл (только десктоп). */
export const startScroll = () => lenis?.start();

/** @description Пересчитывает размеры контейнера скролла (только десктоп). */
export const updateScroll = () => lenis?.resize();

export const getScrollState = () => ({
  isScrolling: lenis ? (lenis as any).isScrolling : false,
  scroll: lenis
    ? (lenis as any).scroll
    : typeof window !== "undefined"
      ? window.scrollY
      : 0,
  velocity: lenis ? (lenis as any).velocity : 0,
});
