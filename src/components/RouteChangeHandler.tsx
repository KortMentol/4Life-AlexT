import { lenis, updateScroll } from "@/lib/lenis";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// ИНТЕРФЕЙС С НЕОБЯЗАТЕЛЬНЫМИ ПРОПСАМИ
interface RouteChangeHandlerProps {
  onTransitionStart?: () => void; // Сделали необязательным
  onTransitionEnd?: () => void; // Сделали необязательным
  isMenuOpen: boolean;
  closeMenu: () => void;
}

const RouteChangeHandler: React.FC<RouteChangeHandlerProps> = ({
  onTransitionStart,
  onTransitionEnd,
  isMenuOpen,
  closeMenu,
}) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef<Map<string, number>>(new Map());
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const isNavigatingRef = useRef(false);
  const currentIdxRef = useRef<number>(0);
  const maxIdxRef = useRef<number>(0);

  const STORAGE_KEY = "__scroll_positions_v2__";
  const readStorage = (): Record<string, number> => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, number>) : {};
    } catch {
      return {};
    }
  };
  const writeStorage = (data: Record<string, number>) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  };

  if (isFirstRender.current && scrollPositions.current.size === 0) {
    const initial = readStorage();
    for (const [k, v] of Object.entries(initial)) {
      scrollPositions.current.set(k, v);
    }
  }

  const onStartRef = useRef(onTransitionStart);
  const onEndRef = useRef(onTransitionEnd);
  useEffect(() => {
    onStartRef.current = onTransitionStart;
    onEndRef.current = onTransitionEnd;
  }, [onTransitionStart, onTransitionEnd]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    try {
      const st = window.history.state || {};
      if (typeof st.__idx !== "number") {
        window.history.replaceState({ ...st, __idx: 0 }, "");
        currentIdxRef.current = 0;
      } else {
        currentIdxRef.current = st.__idx;
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      const st = window.history.state || {};
      if (navigationType === "POP") {
        const targetIdx = typeof (st as any).__idx === "number" ? (st as any).__idx : null;
        if (targetIdx !== null) {
          currentIdxRef.current = targetIdx;
        }
      } else if (navigationType === "PUSH") {
        currentIdxRef.current += 1;
        window.history.replaceState({ ...st, __idx: currentIdxRef.current }, "");
        if (currentIdxRef.current > maxIdxRef.current) {
          maxIdxRef.current = currentIdxRef.current;
        }
      } else if (navigationType === "REPLACE") {
        window.history.replaceState({ ...st, __idx: currentIdxRef.current }, "");
      }
    } catch {
      // ignore
    }
    (window as any).__histCurrentIdx = currentIdxRef.current;
    (window as any).__histMaxIdx = maxIdxRef.current;
  }, [location.key, navigationType]);

  useEffect(() => {
    const onPop = () => {
      if (isMenuOpen) return;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [isMenuOpen, closeMenu]);

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current);
    }

    if (navigationType === "POP") {
      const fromStorage = readStorage();
      const savedPosition = scrollPositions.current.get(location.key) ?? fromStorage[location.key];

      if (typeof savedPosition === "number") {
        try {
          isNavigatingRef.current = true;
          const isMobile =
            typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 767px)").matches;
          if (isMobile) onStartRef.current?.();
          lenis?.stop();
          lenis?.scrollTo(savedPosition, { immediate: true, force: true });
          updateScroll();
        } finally {
          lenis?.start();
        }

        let start = 0;
        const maxMs = 500;
        const tolerance = 1;
        const ensure = (ts: number) => {
          if (start === 0) start = ts;
          updateScroll();
          const needAdjust = Math.abs(window.scrollY - savedPosition) > tolerance;
          if (needAdjust && ts - start < maxMs) {
            lenis?.scrollTo(savedPosition, { immediate: true, force: true });
            requestAnimationFrame(ensure);
          }
        };
        requestAnimationFrame((ts) => {
          ensure(ts);
          const isMobile =
            typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 767px)").matches;
          if (isMobile) onEndRef.current?.();
          isNavigatingRef.current = false;
          window.dispatchEvent(new CustomEvent("route-transition-done"));
        });
      } else {
        isNavigatingRef.current = true;
        lenis?.scrollTo(0, { immediate: true });
        requestAnimationFrame(() => {
          isNavigatingRef.current = false;
          window.dispatchEvent(new CustomEvent("route-transition-done"));
        });
      }
    } else {
      isNavigatingRef.current = true;
      onStartRef.current?.();
      lenis?.scrollTo(0, { immediate: true });
      requestAnimationFrame(() => {
        onEndRef.current?.();
        isNavigatingRef.current = false;
        window.dispatchEvent(new CustomEvent("route-transition-done"));
      });
    }

    return () => {
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
        transitionTimeout.current = null;
      }
    };
  }, [location.key, navigationType]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (isNavigatingRef.current || (typeof window !== "undefined" && (window as any).__menuTransitionInProgress)) {
        return;
      }
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          const y = window.scrollY;
          scrollPositions.current.set(location.key, y);
          const obj = readStorage();
          obj[location.key] = y;
          writeStorage(obj);
        });
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.key]);

  useEffect(() => {
    const onPageShow = () => {
      const obj = readStorage();
      const y = obj[location.key];
      if (typeof y === "number") {
        lenis?.stop();
        lenis?.scrollTo(y, { immediate: true, force: true });
        updateScroll();
        lenis?.start();
      }
    };
    const onPageHide = () => {
      const obj = readStorage();
      obj[location.key] = window.scrollY;
      writeStorage(obj);
    };
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [location.key]);

  return null;
};

export default RouteChangeHandler;
