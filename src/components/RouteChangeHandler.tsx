// src/components/RouteChangeHandler.tsx
// AWWWARDS 2026 — BULLETPROOF SCROLL RESTORATION
import { useNavigation } from "@/App";
import { lenis } from "@/lib/lenis";
import { RefObject, useEffect, useRef } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";

const STORAGE_KEY = "4life_scroll_pos_v2"; // v2 для сброса старого localStorage

interface RouteChangeHandlerProps {
  isMenuActionRef: RefObject<boolean>;
  wasMenuOpenRef: RefObject<boolean>;
}

// ═════════════════════════════════════════════════════════════════════════════
// 1. ХРАНИЛИЩЕ: sessionStorage (изолирует вкладки)
// ═════════════════════════════════════════════════════════════════════════════
const saveScrollPosition = (path: string, position: number) => {
  try {
    const positions = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
    positions[path] = Math.round(position);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {}
};

const getScrollPosition = (path: string): number => {
  try {
    const positions = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
    return typeof positions[path] === "number" ? positions[path] : 0;
  } catch {
    return 0;
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// 2. ЧТЕНИЕ: Правильный источник для каждого устройства
// ═════════════════════════════════════════════════════════════════════════════
const getCurrentScrollY = (): number => {
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) {
    return window.scrollY || 0;
  }
  if (lenis && typeof lenis.scroll === "number") {
    return lenis.scroll;
  }
  return window.scrollY || 0;
};

// ═════════════════════════════════════════════════════════════════════════════
// 3. ВОССТАНОВЛЕНИЕ: «Freeze, Wait, Teleport» с ResizeObserver
// ═════════════════════════════════════════════════════════════════════════════
const restoreScrollPosition = (targetY: number): Promise<void> => {
  return new Promise((resolve) => {
    if (!lenis) {
      window.scrollTo({ top: targetY, behavior: "auto" });
      requestAnimationFrame(() => resolve());
      return;
    }

    lenis.stop();

    let debounceTimer: NodeJS.Timeout;
    let fallbackTimer: NodeJS.Timeout;

    const finalize = () => {
      observer.disconnect();
      clearTimeout(debounceTimer);
      clearTimeout(fallbackTimer);

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const safeY = Math.min(targetY, Math.max(0, maxScroll));

      lenis.scrollTo(safeY, { immediate: true, force: true });

      requestAnimationFrame(() => {
        lenis.start();
        resolve();
      });
    };

    const observer = new ResizeObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(finalize, 150);
    });

    observer.observe(document.body);
    fallbackTimer = setTimeout(finalize, 1000);
  });
};

const RouteChangeHandler = ({ isMenuActionRef, wasMenuOpenRef }: RouteChangeHandlerProps) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const navigate = useNavigate();
  const isFirstLoad = useRef(true);
  const { setIsPopping } = useNavigation();
  const isHandlingPop = useRef(false);
  const navigationLock = useRef(false);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const handleMenuTransitionComplete = () => {
      navigationLock.current = false;
      isHandlingPop.current = false;
    };
    window.addEventListener("menu-transition-complete", handleMenuTransitionComplete);
    return () => window.removeEventListener("menu-transition-complete", handleMenuTransitionComplete);
  }, []);

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    const saveCurrentPosition = () => {
      saveScrollPosition(currentPath, getCurrentScrollY());
    };
    window.addEventListener("beforeunload", saveCurrentPosition);
    window.addEventListener("pagehide", saveCurrentPosition);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") saveCurrentPosition();
    });
    return () => {
      saveCurrentPosition();
      window.removeEventListener("beforeunload", saveCurrentPosition);
      window.removeEventListener("pagehide", saveCurrentPosition);
    };
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handlePopState = async (event: PopStateEvent) => {
      if (
        isMenuActionRef.current ||
        navigationLock.current ||
        window.__menuTransitionInProgress ||
        isHandlingPop.current
      )
        return;
      if (wasMenuOpenRef.current && (!event.state || !event.state.menuOpen)) return;

      isHandlingPop.current = true;
      navigationLock.current = true;

      try {
        // ШАГ 1: FREEZE. Мгновенно убиваем инерцию Lenis.
        if (lenis) {
          lenis.stop();
          // @ts-ignore - внутренний API Lenis для сброса скорости
          if (lenis.velocity !== undefined) lenis.velocity = 0;
        }

        // ШАГ 2: READ. Теперь позиция точна.
        saveScrollPosition(location.pathname + location.search, getCurrentScrollY());

        let targetPath = event.state?.path;
        if (!targetPath) {
          // Тип-сейф ожидание следующего кадра
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          targetPath = window.location.pathname + window.location.search;
        }

        const targetY = getScrollPosition(targetPath);

        setIsPopping(true); // Включаем вуаль
        window.dispatchEvent(new CustomEvent("force-header-show"));

        navigate(targetPath, { replace: true });

        // ШАГ 3: WAIT & TELEPORT. Ждем отрисовки DOM и телепортируемся.
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        await restoreScrollPosition(targetY);

        setIsPopping(false); // Убираем вуаль
      } finally {
        isHandlingPop.current = false;
        navigationLock.current = false;
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [location.pathname, location.search, navigate, setIsPopping, isMenuActionRef, wasMenuOpenRef]);

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      const restoreAfterPreloader = async () => {
        const savedY = getScrollPosition(currentPath);
        if (savedY > 0) {
          await restoreScrollPosition(savedY);
        } else {
          lenis?.start();
        }
        window.removeEventListener("app-mounted", restoreAfterPreloader);
      };

      // Логика прелоадера: если он уже скрыт, запускаем сразу.
      if (document.getElementById("preloader") === null) {
        restoreAfterPreloader();
      } else {
        window.addEventListener("app-mounted", restoreAfterPreloader, { once: true });
      }
      return;
    }

    if (navigationType === "POP" && isHandlingPop.current) return;

    if (!navigationLock.current) {
      window.dispatchEvent(new CustomEvent("force-header-show"));
      lenis?.scrollTo(0, { immediate: true });
    }
  }, [location.pathname, location.search, navigationType]);

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    if (window.history.state?.path !== currentPath) {
      window.history.replaceState({ ...window.history.state, path: currentPath }, "", currentPath);
    }
  }, [location.pathname, location.search]);

  return null;
};

export default RouteChangeHandler;
