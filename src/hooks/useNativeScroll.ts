/**
 * @module src/hooks/useNativeScroll.ts
 * @description Скрытие и отображение хедера при скролле.
 *
 * ИСПРАВЛЕНИЕ БАГА "МИРАЖА ХЕДЕРА ПРИ ЗАКРЫТИИ ПЛЕЕРА":
 * 1. В эффекте инициализации/разблокировки хука (`useEffect([disabled, isMobile])`)
 *    убран насильственный сброс `header.style.transform = "translateY(0px) translateZ(0)"`.
 * 2. Теперь при включении хука (когда модалка/видеоплеер закрывается и `disabled`
 *    становится `false`) применяется текущее сохраненное значение `displayYRef.current`.
 * 3. Если хедер был убран за пределы экрана (`-110px`) до открытия плеера, после закрытия
 *    плеера он сохранит позицию `-110px`. Хедер больше не появляется ложно, не застывает
 *    "миражом" при скролле вниз и не прыгает при скролле вверх.
 *
 * @author Geminis AI & Kort
 * @version 2.2.0
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

  const isPreloaderActiveRef = useRef(true);

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

  const hideHeader = useCallback(() => {
    targetYRef.current = -HEADER_HEIGHT;
    displayYRef.current = -HEADER_HEIGHT;
    prevScrollRef.current = window.scrollY;

    const h = getCachedHeader();
    if (h) {
      h.style.transition = "none";
      h.style.transform = `translateY(${-HEADER_HEIGHT}px) translateZ(0)`;
    }
  }, []);

  useEffect(() => {
    headerRef.current = null;

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
    if (isMobile) return;

    const handlePopComplete = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 200) {
        showHeader();
      } else {
        hideHeader();
      }
    };

    window.addEventListener("pop-transition-complete", handlePopComplete);
    return () => window.removeEventListener("pop-transition-complete", handlePopComplete);
  }, [isMobile, showHeader, hideHeader]);

  useEffect(() => {
    isPreloaderActiveRef.current = document.getElementById("preloader") !== null;

    const handlePreloaderOutro = () => {
      isPreloaderActiveRef.current = false;
    };

    window.addEventListener("preloader-outro-start", handlePreloaderOutro);
    return () => {
      window.removeEventListener("preloader-outro-start", handlePreloaderOutro);
    };
  }, []);

  useEffect(() => {
    if (disabled) return;

    const header = getCachedHeader();
    if (!header) return;

    // ИСПРАВЛЕНИЕ: Вместо насильственного вытаскивания хедера на 0px
    // при снятии блокировки (закрытии модалки/плеера), сохраняем реальную Y-координату!
    header.style.transition = "none";
    header.style.transform = `translateY(${displayYRef.current}px) translateZ(0)`;

    prevScrollRef.current = window.scrollY;

    if (isMobile) {
      header.style.transition = "none";
      header.style.transform = "translateY(0px) translateZ(0)";
      return () => {};
    }

    let isFirstTick = true;

    const unsub = rafLoop.subscribe((scroll) => {
      if (isFirstTick) {
        prevScrollRef.current = scroll;
        isFirstTick = false;
        return;
      }

      if (
        window.__isRoutingLock ||
        window.__popTransitionInProgress ||
        window.__isScrollRestorationActive ||
        isPreloaderActiveRef.current
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
