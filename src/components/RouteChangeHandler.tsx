import { lenis } from "@/lib/lenis";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const STORAGE_KEY = "scroll_positions_v_final";

const RouteChangeHandler = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const isFirstLoad = useRef(true);

  const saveScrollPosition = (path: string, position: number) => {
    try {
      const positions = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      positions[path] = Math.round(position);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
    } catch (error) {
      console.warn("RouteChangeHandler: Failed to save position.", error);
    }
  };

  const getScrollPosition = (path: string): number | null => {
    try {
      const positions = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return positions[path] ?? null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentPath = window.location.pathname + window.location.search;
        saveScrollPosition(currentPath, window.scrollY);
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useLayoutEffect(() => {
    lenis?.stop();
    const currentPath = location.pathname + location.search;

    const restoreScroll = (y: number) => {
      let attempts = 0;
      let animationFrameId: number | null = null;
      const MAX_ATTEMPTS = 300;

      const attempt = () => {
        if (document.documentElement.scrollHeight > y) {
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          lenis?.scrollTo(y, { immediate: true, force: true });
          setTimeout(() => {
            lenis?.start();
            history.scrollRestoration = "auto";
          }, 50);
        } else if (attempts < MAX_ATTEMPTS) {
          attempts++;
          animationFrameId = requestAnimationFrame(attempt);
        } else {
          lenis?.start();
          history.scrollRestoration = "auto";
        }
      };
      requestAnimationFrame(attempt);
    };

    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      const savedY = getScrollPosition(currentPath);

      if (savedY !== null && savedY > 0) {
        history.scrollRestoration = "manual";
        const preloader = document.getElementById("preloader");

        if (preloader) {
          const observer = new MutationObserver((_, obs) => {
            if (!document.getElementById("preloader")) {
              setTimeout(() => restoreScroll(savedY), 100);
              obs.disconnect();
            }
          });
          observer.observe(document.body, { childList: true });
          setTimeout(() => {
            observer.disconnect();
            restoreScroll(savedY);
          }, 3500);
        } else {
          restoreScroll(savedY);
        }
      } else {
        lenis?.start();
        history.scrollRestoration = "auto";
      }
      return;
    }

    if (navigationType === "POP") {
      const savedY = getScrollPosition(currentPath);
      if (savedY !== null) {
        restoreScroll(savedY);
      } else {
        lenis?.scrollTo(0, { immediate: true, force: true });
        lenis?.start();
      }
    } else {
      lenis?.scrollTo(0, { immediate: true, force: true });
      lenis?.start();
    }
  }, [location.pathname, location.search, navigationType]);

  return null;
};

export default RouteChangeHandler;
