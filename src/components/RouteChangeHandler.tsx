import { useNavigation } from "@/App";
import { lenis } from "@/lib/lenis";
import { RefObject, useEffect, useRef } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";

// Глобальная декларация для флага POP перехода
declare global {
  interface Window {
    __popTransitionInProgress?: boolean;
  }
}

const STORAGE_KEY = "scroll_positions_v_final";

interface RouteChangeHandlerProps {
  isMenuActionRef: RefObject<boolean>;
  wasMenuOpenRef: RefObject<boolean>;
}

const saveScrollPosition = (path: string, position: number) => {
  const rounded = Math.round(position);

  // Основное хранилище
  try {
    const positions = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    positions[path] = rounded;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {}

  // Резерв в history.state для приватного режима iOS
  try {
    const state = window.history.state || {};
    window.history.replaceState({ ...state, _scroll: rounded }, "");
  } catch {}
};

const getScrollPosition = (path: string): number | null => {
  // Приоритет: localStorage
  try {
    const positions = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (positions[path] != null) return positions[path];
  } catch {}

  // Резерв: history.state
  try {
    if (window.history.state?._scroll != null)
      return window.history.state._scroll;
  } catch {}

  return null;
};

/**
 * AWWWARDS 2026: Профессиональное восстановление скролла.
 * Ждем полной готовности DOM + ScrollTrigger перед восстановлением.
 */
const restoreScrollPosition = (y: number, retries = 10) => {
  lenis?.stop();

  const attemptScroll = (attempt: number) => {
    if (attempt <= 0) {
      lenis?.start();
      return;
    }

    // КРИТИЧНО: Проверяем что ScrollTrigger готов и высоты пересчитаны
    const isScrollTriggerReady =
      window.ScrollTrigger &&
      window.ScrollTrigger.getAll().every((st: any) => st.isActive !== false);

    const isContentReady =
      document.documentElement.scrollHeight > y + window.innerHeight;

    if (isScrollTriggerReady && isContentReady) {
      if (lenis) {
        // Используем force: true чтобы игнорировать любые блокировки
        lenis.scrollTo(y, { immediate: true, force: true } as any);
        requestAnimationFrame(() => lenis?.start());
      } else {
        // Нативный скролл на мобиле
        window.scrollTo(0, y);
      }
    } else {
      // Увеличиваем задержку для более надежного ожидания
      setTimeout(() => attemptScroll(attempt - 1), 100);
    }
  };

  attemptScroll(retries);
};

const RouteChangeHandler = ({
  isMenuActionRef,
  wasMenuOpenRef,
}: RouteChangeHandlerProps) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const navigate = useNavigate();
  const isFirstLoad = useRef(true);
  const { setIsPopping } = useNavigation();
  const isHandlingPop = useRef(false);

  // Сохранение позиции при скролле (с защитой от перезаписи во время POP)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking || isHandlingPop.current || isFirstLoad.current) return;

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

  // Перехват POP-событий (кнопка назад/вперёд) с fail-safe cleanup
  useEffect(() => {
    let cleanupTimeout: NodeJS.Timeout | null = null;

    const handlePopState = (event: PopStateEvent) => {
      // Игнорируем POP от меню
      if (isMenuActionRef.current) return;
      if (wasMenuOpenRef.current && !event.state?.menuOpen) return;

      // Игнорируем переход на/с записи menuOpen — это меню, не навигация
      if (event.state?.menuOpen === true) return;

      if (isHandlingPop.current) return;

      isHandlingPop.current = true;
      window.__popTransitionInProgress = true; // КРИТИЧНО: Устанавливаем глобальный флаг

      // Показываем вуаль немедленно
      setIsPopping(true);
      lenis?.stop();

      const targetPath =
        event.state?.path || window.location.pathname + window.location.search;
      const targetScroll = getScrollPosition(targetPath) ?? 0;

      // Fail-safe timeout: ensure cleanup happens even if something fails (увеличено до 1500ms)
      cleanupTimeout = setTimeout(() => {
        setIsPopping(false);
        lenis?.start();
        isHandlingPop.current = false;
        window.__popTransitionInProgress = false; // КРИТИЧНО: Сбрасываем флаг при timeout
        if (window.ScrollTrigger) {
          window.ScrollTrigger.refresh();
        }
        // Уведомляем о завершении при timeout
        window.dispatchEvent(new CustomEvent("pop-transition-complete"));
      }, 1500); // Увеличено с 1000ms до 1500ms

      // Двойной RAF — гарантирует рендер вуали до навигации
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          navigate(targetPath, { replace: true });

          // AWWWARDS ПОДХОД: Ждем рендер + пересчет ScrollTrigger + восстановление
          setTimeout(() => {
            // Шаг 1: Обновляем ScrollTrigger ДО восстановления скролла
            if (window.ScrollTrigger) {
              window.ScrollTrigger.refresh(true); // true = force refresh
            }

            // Шаг 2: Дополнительная задержка для полного пересчета высот
            setTimeout(() => {
              // Шаг 3: Восстанавливаем скролл (теперь с правильными высотами)
              restoreScrollPosition(targetScroll);

              // Шаг 4: Держим вуаль 450ms — полностью скрывает любые прыжки
              setTimeout(() => {
                if (cleanupTimeout) clearTimeout(cleanupTimeout);
                setIsPopping(false);
                lenis?.start();
                isHandlingPop.current = false;
                window.__popTransitionInProgress = false; // КРИТИЧНО: Сбрасываем глобальный флаг

                // Шаг 5: Финальный refresh после всего
                if (window.ScrollTrigger) {
                  window.ScrollTrigger.refresh();
                }

                // КРИТИЧНО: Уведомляем видео что POP переход завершен
                window.dispatchEvent(
                  new CustomEvent("pop-transition-complete"),
                );
              }, 450); // Увеличено с 350ms до 450ms
            }, 100); // Увеличено с 50ms до 100ms для надежности
          }, 100); // Увеличено с 50ms до 100ms
        });
      });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      // Cleanup on unmount
      if (cleanupTimeout) clearTimeout(cleanupTimeout);
      if (isHandlingPop.current) {
        setIsPopping(false);
        lenis?.start();
        isHandlingPop.current = false;
        window.__popTransitionInProgress = false; // КРИТИЧНО: Сбрасываем флаг при cleanup
        // Уведомляем о завершении при cleanup
        window.dispatchEvent(new CustomEvent("pop-transition-complete"));
      }
    };
  }, [navigate, setIsPopping, isMenuActionRef, wasMenuOpenRef]);

  // Первая загрузка и обычные переходы (PUSH)
  useEffect(() => {
    const currentPath = location.pathname + location.search;

    if (isFirstLoad.current) {
      const savedY = getScrollPosition(currentPath);

      const performRestore = () => {
        if (savedY !== null && savedY > 0) {
          restoreScrollPosition(savedY);
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

    if (navigationType === "POP" && isHandlingPop.current) {
      return;
    }

    // PUSH — прыжок в 0
    window.dispatchEvent(new CustomEvent("force-header-show"));
    if (lenis) {
      lenis.scrollTo(0, { immediate: true } as any);
      lenis.start();
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.search, navigationType]);

  // Синхронизация пути в history.state
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    if (window.history.state?.path !== currentPath) {
      window.history.replaceState(
        { ...window.history.state, path: currentPath },
        "",
        currentPath,
      );
    }
  }, [location.pathname, location.search]);

  return null;
};

export default RouteChangeHandler;
