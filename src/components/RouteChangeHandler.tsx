/**
 * @module src/components/RouteChangeHandler.tsx
 * @description Умное восстановление скролла (Smart Observer + Scrollbar Sync).
 * 
 * @author Kort
 * @version 1.3.0
 */

import { useNavigation } from "@/App";
import { lenis } from "@/lib/lenis";
import { RefObject, useEffect, useRef } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";

declare global {
  interface Window {
    __popTransitionInProgress?: boolean;
    __isRoutingLock?: boolean;
    __isScrollRestorationActive?: boolean;
  }
}

const STORAGE_KEY = "scroll_positions_v_final";

let memoryScrollCache: Record<string, number> | null = null;
let diskFlushTimeout: NodeJS.Timeout | null = null;

const initScrollCache = () => {
  if (memoryScrollCache) return;
  try {
    memoryScrollCache = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    memoryScrollCache = {};
  }
};

const flushToDisk = () => {
  if (!memoryScrollCache) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryScrollCache));
    const state = window.history.state || {};
    window.history.replaceState(
      { ...state, _scroll: memoryScrollCache[window.location.pathname + window.location.search] || 0 },
      "",
    );
  } catch {}
};

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", flushToDisk);
}

const saveScrollPosition = (path: string, position: number) => {
  initScrollCache();
  const rounded = Math.round(position);

  if (memoryScrollCache) {
    memoryScrollCache[path] = rounded;
  }

  if (diskFlushTimeout) clearTimeout(diskFlushTimeout);
  diskFlushTimeout = setTimeout(flushToDisk, 250);
};

const getScrollPosition = (path: string): number | null => {
  initScrollCache();
  if (memoryScrollCache && memoryScrollCache[path] != null) {
    return memoryScrollCache[path];
  }
  try {
    if (window.history.state?._scroll != null) return window.history.state._scroll;
  } catch {}
  return null;
};

class RestorationController {
  private observer: ResizeObserver | null = null;
  private timeoutId: NodeJS.Timeout | null = null;
  private isRestored = false;

  public start(y: number, maxWaitMs = 3500) {
    this.cancel();
    this.isRestored = false;
    lenis?.stop();
    window.__isScrollRestorationActive = true;

    const finalizeScroll = () => {
      if (this.isRestored) return;
      this.isRestored = true;
      this.cleanup();

      if (window.ScrollTrigger) window.ScrollTrigger.refresh(true);

      if (lenis) {
        lenis.resize();
        lenis.scrollTo(y, { immediate: true, force: true } as any);

        requestAnimationFrame(() => {
          if (!lenis) return;
          lenis.start();
          requestAnimationFrame(() => {
            if (!lenis) return;
            lenis.scrollTo(y, { immediate: true, force: true } as any);
            requestAnimationFrame(() => {
              if (window.ScrollTrigger) {
                window.ScrollTrigger.update();
              }
              window.__isScrollRestorationActive = false;
            });
          });
        });
      } else {
        window.scrollTo(0, y);
        window.__isScrollRestorationActive = false;
      }
    };

    const checkAndScroll = () => {
      if (this.isRestored) return;
      if (lenis) lenis.resize();

      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      if (maxScroll >= y - 50) {
        finalizeScroll();
      }
    };

    checkAndScroll();
    if (this.isRestored) return;

    this.observer = new ResizeObserver(() => {
      checkAndScroll();
    });
    this.observer.observe(document.body);

    this.timeoutId = setTimeout(() => {
      finalizeScroll();
      window.__isScrollRestorationActive = false;
    }, maxWaitMs);
  }

  private cleanup() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  public cancel() {
    this.cleanup();
    this.isRestored = true;
  }
}

const restorationController = new RestorationController();

interface RouteChangeHandlerProps {
  isMenuActionRef: RefObject<boolean>;
  wasMenuOpenRef: RefObject<boolean>;
}

const RouteChangeHandler = ({ isMenuActionRef, wasMenuOpenRef }: RouteChangeHandlerProps) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const navigate = useNavigate();
  const isFirstLoad = useRef(true);
  const { setIsPopping } = useNavigation();
  const isHandlingPop = useRef(false);
  const prevPathnameRef = useRef(location.pathname);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking || isHandlingPop.current || isFirstLoad.current || window.__isRoutingLock) return;

      ticking = true;
      requestAnimationFrame(() => {
        const currentPath = location.pathname + location.search;
        saveScrollPosition(currentPath, window.scrollY);
        ticking = false;
      });
    };

    const emergencySave = () => {
      if (isHandlingPop.current || isFirstLoad.current) return;
      saveScrollPosition(location.pathname + location.search, window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("beforeunload", emergencySave);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", emergencySave);
    };
  }, [location.pathname, location.search]);

  useEffect(() => {
    let cleanupTimeout: NodeJS.Timeout | null = null;

    const handlePopState = (event: PopStateEvent) => {
      if (lenis) {
        lenis.stop();
        (lenis as any).velocity = 0;
        (lenis as any).isScrolling = false;
      }

      if (isMenuActionRef.current) return;
      if (wasMenuOpenRef.current && !event.state?.menuOpen) return;
      if (event.state?.menuOpen === true) return;

      const targetPathname = window.location.pathname;
      if (targetPathname === prevPathnameRef.current) {
        return;
      }

      if (isHandlingPop.current) return;

      prevPathnameRef.current = targetPathname;
      isHandlingPop.current = true;
      window.__popTransitionInProgress = true;
      window.__isRoutingLock = true;

      setIsPopping(true);

      // ОТПРАВЛЯЕМ СИГНАЛ СТАРТА ПЕРЕХОДА (устраняет интервальный таймер в скроллбаре)
      window.dispatchEvent(new CustomEvent("pop-transition-start"));

      const targetPath = event.state?.path || window.location.pathname + window.location.search;
      const targetScroll = getScrollPosition(targetPath) ?? 0;

      if (cleanupTimeout) clearTimeout(cleanupTimeout);

      cleanupTimeout = setTimeout(() => {
        setIsPopping(false);
        lenis?.start();
        isHandlingPop.current = false;
        window.__popTransitionInProgress = false;
        window.__isRoutingLock = false;
        if (window.ScrollTrigger) {
          window.ScrollTrigger.refresh();
        }
        window.dispatchEvent(new CustomEvent("pop-transition-complete"));
      }, 2500);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          navigate(targetPath, { replace: true });

          setTimeout(() => {
            if (window.ScrollTrigger) {
              window.ScrollTrigger.refresh(true);
            }

            setTimeout(() => {
              restorationController.start(targetScroll);

              setTimeout(() => {
                if (cleanupTimeout) clearTimeout(cleanupTimeout);
                setIsPopping(false);
                lenis?.start();
                isHandlingPop.current = false;
                window.__popTransitionInProgress = false;
                window.__isRoutingLock = false;

                if (window.ScrollTrigger) {
                  window.ScrollTrigger.refresh();
                }
                window.dispatchEvent(new CustomEvent("pop-transition-complete"));
              }, 450);
            }, 100);
          }, 100);
        });
      });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      restorationController.cancel();
      if (cleanupTimeout) clearTimeout(cleanupTimeout);
      if (isHandlingPop.current) {
        setIsPopping(false);
        lenis?.start();
        isHandlingPop.current = false;
        window.__popTransitionInProgress = false;
        window.__isRoutingLock = false;
        window.dispatchEvent(new CustomEvent("pop-transition-complete"));
      }
    };
  }, [navigate, setIsPopping, isMenuActionRef, wasMenuOpenRef]);

  useEffect(() => {
    const currentPath = location.pathname + location.search;

    if (isFirstLoad.current) {
      const savedY = getScrollPosition(currentPath);

      const performRestore = () => {
        if (savedY !== null && savedY > 0) {
          restorationController.start(savedY);
        } else {
          lenis?.start();
        }
        setTimeout(() => {
          isFirstLoad.current = false;
        }, 300);
      };

      if (document.getElementById("preloader")) {
        setTimeout(performRestore, 2500);
      } else {
        performRestore();
      }
      return;
    }

    if (navigationType === "POP" || isHandlingPop.current) {
      return;
    }

    const isPathChanged = location.pathname !== prevPathnameRef.current;
    prevPathnameRef.current = location.pathname;

    if (!isPathChanged) {
      return;
    }

    window.dispatchEvent(new CustomEvent("force-header-show"));
    if (lenis) {
      lenis.scrollTo(0, { immediate: true } as any);
      lenis.start();
    } else {
      window.scrollTo(0, 0);
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
