import Lenis from "lenis";
import { LenisOptions, LenisScrollToOptions, Lenis as LenisType } from "./lenis.types";

const isMobile = () => typeof window !== "undefined" && window.innerWidth <= 767;

let lenisInstance: LenisType | null = null;

if (!isMobile() && typeof window !== "undefined") {
  lenisInstance = new Lenis({
    syncTouch: true,
    lerp: 0.07,
    duration: 2.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  } as LenisOptions) as unknown as LenisType;

  if (document.getElementById("preloader")) {
    lenisInstance.stop();
  }
}

export const lenis = lenisInstance;

const easeInOutQuint = (t: number): number =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

let rafScrollId: number | null = null;

const rafScrollTo = (targetY: number, duration: number): void => {
  if (typeof window === "undefined") return;

  if (rafScrollId !== null) {
    cancelAnimationFrame(rafScrollId);
    rafScrollId = null;
  }

  const startY = window.scrollY;
  const distance = targetY - startY;

  if (Math.abs(distance) < 1) return;

  const startTime = performance.now();
  const durationMs = duration * 1000;

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

export const scrollTo = (target: string | HTMLElement | number, options: LenisScrollToOptions = {}) => {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.5, ...options });
  } else if (typeof window !== "undefined") {
    if (options.immediate) {
      let targetY = 0;
      if (typeof target === "number") {
        targetY = target + (options.offset || 0);
      } else {
        const el = typeof target === "string" ? (document.querySelector(target) as HTMLElement | null) : target;
        if (el) targetY = el.getBoundingClientRect().top + window.scrollY + (options.offset || 0);
      }
      window.scrollTo(0, targetY);
      return;
    }

    let targetY: number | undefined;
    if (typeof target === "number") {
      targetY = target + (options.offset || 0);
    } else {
      const el = typeof target === "string" ? (document.querySelector(target) as HTMLElement | null) : target;
      if (el) targetY = el.getBoundingClientRect().top + window.scrollY + (options.offset || 0);
    }

    if (targetY !== undefined) {
      rafScrollTo(targetY, options.duration ?? 1.2);
    }
  }
};

export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();
export const updateScroll = () => lenis?.resize();

export const getScrollState = () => ({
  isScrolling: lenis ? Boolean((lenis as unknown as { isScrolling?: boolean }).isScrolling) : false,
  scroll: lenis ? Number((lenis as unknown as { scroll?: number }).scroll ?? 0) : typeof window !== "undefined" ? window.scrollY : 0,
  velocity: lenis ? Number((lenis as unknown as { velocity?: number }).velocity ?? 0) : 0,
});
