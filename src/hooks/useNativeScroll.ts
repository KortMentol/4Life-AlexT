/**
 * Хедер через глобальный RAF синглтон.
 * Lerp-интерполяция: тягуче на десктопе, чуть живее на тач.
 */
import { rafLoop } from "@/lib/rafLoop";
import { useEffect, useRef } from "react";
import { useIsMobile } from "./useIsMobile";

const HEADER_HEIGHT = 80;
const LERP_DESKTOP = 0.06;
const LERP_TOUCH = 0.085; // на 30% быстрее чем десктоп
const SNAP_TRANSITION = "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)";

function getHeader(): HTMLElement | null {
  return document.querySelector(".header-premium");
}

function getLiveY(el: HTMLElement): number {
  const t = getComputedStyle(el).transform;
  if (!t || t === "none") return 0;
  return new DOMMatrix(t).m42;
}

export function useNativeScroll({ disabled = false }: { disabled?: boolean }) {
  const isMobile = useIsMobile();
  const targetYRef = useRef(0);
  const displayYRef = useRef(0);

  useEffect(() => {
    if (disabled) return;

    const lerp = isMobile ? LERP_TOUCH : LERP_DESKTOP;
    let prevScroll = window.scrollY;

    const h = getHeader();
    if (h) {
      displayYRef.current = getLiveY(h);
      targetYRef.current = displayYRef.current;
    }

    const unsub = rafLoop.subscribe((scroll) => {
      const delta = scroll - prevScroll;
      prevScroll = scroll;

      if (scroll <= 60) {
        targetYRef.current = 0;
      } else if (Math.abs(delta) > 1) {
        targetYRef.current = delta > 0 ? -HEADER_HEIGHT : 0;
      }

      const diff = targetYRef.current - displayYRef.current;
      if (Math.abs(diff) > 0.1) {
        displayYRef.current += diff * lerp;
        const header = getHeader();
        if (header) {
          header.style.transition = "none";
          header.style.transform = `translateY(${displayYRef.current}px)`;
        }
      }
    });

    return unsub;
  }, [disabled, isMobile]);

  const showHeader = () => {
    targetYRef.current = 0;
    const h = getHeader();
    if (h) {
      h.style.transition = SNAP_TRANSITION;
      h.style.transform = "translateY(0px)";
      displayYRef.current = 0;
    }
  };

  return { showHeader };
}
