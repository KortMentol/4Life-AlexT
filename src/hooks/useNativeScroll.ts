/**
 * @module src/hooks/useNativeScroll.ts
 * @description Скрытие хедера при скролле.
 * ИСПРАВЛЕНИЕ: Хедер кэшируется в рефе при первой необходимости, избавляя RAF от querySelector на каждом кадре.
 * @author Kort
 * @version 1.1.0
 */

import { rafLoop } from "@/lib/rafLoop";
import { useCallback, useEffect, useRef } from "react";
import { useIsMobile } from "./useIsMobile";

const HEADER_HEIGHT = 110;
const LERP_DESKTOP = 0.04;

export function useNativeScroll({ disabled = false }: { disabled?: boolean }) {
  const isMobile = useIsMobile();
  const headerRef = useRef<HTMLElement | null>(null);

  const targetYRef = useRef(0);
  const displayYRef = useRef(0);
  const prevScrollRef = useRef(0);

  // ИСПРАВЛЕНИЕ: Ленивое кэширование ссылки на элемент хедера
  const getCachedHeader = (): HTMLElement | null => {
    if (!headerRef.current) {
      headerRef.current = document.querySelector(".header-premium");
    }
    return headerRef.current;
  };

  const showHeader = useCallback(() => {
    targetYRef.current = 0;
    displayYRef.current = 0;
    prevScrollRef.current = window.scrollY;

    const h = getCachedHeader();
    if (h) {
      h.style.transition = "none";
      h.style.transform = "translateY(0px) translateZ(0)";
    }
  }, []);

  useEffect(() => {
    headerRef.current = null; // Сброс при монтировании

    let attempts = 0;
    const maxAttempts = 10;

    const tryShowHeader = () => {
      const h = getCachedHeader();
      if (h) {
        h.style.transition = "none";
        h.style.transform = "translateY(0px) translateZ(0)";
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryShowHeader, 50);
      }
    };

    tryShowHeader();
  }, []);

  useEffect(() => {
    window.addEventListener("force-header-show", showHeader);
    return () => window.removeEventListener("force-header-show", showHeader);
  }, [showHeader]);

  useEffect(() => {
    if (disabled) return;

    const header = getCachedHeader();
    if (!header) return;

    header.style.transition = "none";
    header.style.transform = "translateY(0px) translateZ(0)";

    prevScrollRef.current = window.scrollY;

    if (isMobile) {
      header.style.transition = "none";
      header.style.transform = "translateY(0px) translateZ(0)";
      return () => {};
    }

    let isFirstTick = true;
    let isPreloaderPresent = true;

    const unsub = rafLoop.subscribe((scroll) => {
      if (isFirstTick) {
        prevScrollRef.current = scroll;
        isFirstTick = false;
        return;
      }

      if (isPreloaderPresent) {
        isPreloaderPresent = document.getElementById("preloader") !== null;
      }

      if (
        window.__isRoutingLock ||
        window.__popTransitionInProgress ||
        window.__isScrollRestorationActive ||
        isPreloaderPresent
      ) {
        prevScrollRef.current = scroll;
        return;
      }

      const delta = scroll - prevScrollRef.current;
      prevScrollRef.current = scroll;

      if (Math.abs(delta) > 150) {
        // Пропускаем скачки
      } else if (Math.abs(delta) > 1) {
        targetYRef.current = delta > 0 ? -HEADER_HEIGHT : 0;
      }

      const diff = targetYRef.current - displayYRef.current;
      if (Math.abs(diff) > 0.1) {
        displayYRef.current += diff * LERP_DESKTOP;
        const h = getCachedHeader();
        if (h) {
          h.style.transition = "none";
          h.style.transform = `translateY(${displayYRef.current}px) translateZ(0)`;
        }
      } else if (displayYRef.current !== targetYRef.current) {
        displayYRef.current = targetYRef.current;
        const h = getCachedHeader();
        if (h) {
          h.style.transition = "none";
          h.style.transform = `translateY(${displayYRef.current}px) translateZ(0)`;
        }
      }
    });

    return unsub;
  }, [disabled, isMobile]);

  return { showHeader };
}