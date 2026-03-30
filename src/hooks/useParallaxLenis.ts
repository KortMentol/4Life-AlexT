/**
 * Параллакс через глобальный RAF синглтон — один loop на всё приложение.
 * Никакого собственного requestAnimationFrame — подписываемся на rafLoop.
 */
import { rafLoop } from "@/lib/rafLoop";
import { useEffect } from "react";

interface Options {
  strength?: number;
  disabled?: boolean;
  /** -1 = обратное направление (контент движется против фона) */
  direction?: 1 | -1;
}

export function useParallaxLenis(
  ref: React.RefObject<HTMLElement>,
  containerRef: React.RefObject<HTMLElement>,
  options: Options = {},
) {
  const { strength = 60, disabled = false, direction = 1 } = options;

  useEffect(() => {
    const el = ref.current;
    const container = containerRef.current;
    if (!el || !container || disabled || strength === 0) return;

    let winH = window.innerHeight;
    let containerTop = 0;
    let containerH = 0;

    const cacheGeometry = () => {
      winH = window.innerHeight;
      containerH = container.offsetHeight;
      containerTop = container.getBoundingClientRect().top + window.scrollY;
    };

    cacheGeometry();
    const initTimer = setTimeout(cacheGeometry, 150);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(cacheGeometry, 200);
    };
    window.addEventListener("resize", onResize, { passive: true });

    let lastScroll = -1;

    const onTick = (scroll: number) => {
      if (scroll === lastScroll) return;
      lastScroll = scroll;

      const relTop = containerTop - scroll;
      if (relTop > winH + 200 || relTop + containerH < -200) return;

      const totalTravel = winH + containerH;
      const progress = Math.max(0, Math.min(1, (scroll - (containerTop - winH)) / totalTravel));
      const offset = (progress - 0.5) * strength * direction;

      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    const unsub = rafLoop.subscribe(onTick);

    return () => {
      unsub();
      clearTimeout(initTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      if (el) el.style.transform = "";
    };
  }, [ref, containerRef, strength, disabled]);
}
