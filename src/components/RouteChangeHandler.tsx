import { useNavigation } from "@/App";
import { lenis } from "@/lib/lenis";
import { RefObject, useEffect, useRef } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";

declare global {
  interface Window {
    __popTransitionInProgress?: boolean;
    __isRoutingLock?: boolean;
  }
}

const STORAGE_KEY = "scroll_positions_v_final";

// --- AWWWARDS 2026: IN-MEMORY SCROLL CACHE ---
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
    // Пишем в историю браузера только при остановке скролла (Защита Safari от краша)
    const state = window.history.state || {};
    window.history.replaceState({ ...state, _scroll: memoryScrollCache[window.location.pathname + window.location.search] || 0 }, "");
  } catch {}
};

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", flushToDisk);
}

const saveScrollPosition = (path: string, position: number) => {
  initScrollCache();
  const rounded = Math.round(position);

  // 1. Быстрая запись в ОЗУ (каждый кадр, 0% нагрузки)
  if (memoryScrollCache) {
    memoryScrollCache[path] = rounded;
  }

  // 2. Отложенный сброс на диск (через 250мс после полной остановки)
  if (diskFlushTimeout) clearTimeout(diskFlushTimeout);
  diskFlushTimeout = setTimeout(flushToDisk, 250);
};

const getScrollPosition = (path: string): number | null => {
  initScrollCache();
  // Сначала берем точные данные из ОЗУ
  if (memoryScrollCache && memoryScrollCache[path] != null) {
    return memoryScrollCache[path];
  }
  // Если ОЗУ очищено (после перезагрузки), берем бэкап из истории
  try {
    if (window.history.state?._scroll != null) return window.history.state._scroll;
  } catch {}
  return null;
};

interface RouteChangeHandlerProps {
  isMenuActionRef: RefObject<boolean>;
  wasMenuOpenRef: RefObject<boolean>;
}

/**
 * AWWWARDS 2026: Умное восстановление скролла (Smart Observer + Scrollbar Sync).
 * Ждет физического появления контента (React.lazy) в DOM любой длительности
 * и принудительно синхронизирует кастомный UI-скроллбар через микро-сдвиг.
 */
const restoreScrollPosition = (y: number, maxWaitMs = 3500) => {
  lenis?.stop();
  window.__isScrollRestorationActive = true; // Block header scroll adjustments during restoration

  let observer: ResizeObserver | null = null;
  let timeoutId: NodeJS.Timeout;
  let isRestored = false;

  const finalizeScroll = () => {
    if (isRestored) return;
    isRestored = true;

    if (observer) observer.disconnect();
    clearTimeout(timeoutId);

    if (window.ScrollTrigger) window.ScrollTrigger.refresh(true);

    if (lenis) {
      lenis.resize();

      // Прыгаем в целевую позицию
      lenis.scrollTo(y, { immediate: true, force: true } as any);

      requestAnimationFrame(() => {
        if (!lenis) return;
        lenis.start();

        // ФИКС СКРОЛЛБАРА: Делаем микро-сдвиг, чтобы Lenis отправил событие 'scroll'
        // и кастомный ползунок справа мгновенно прыгнул на нужную высоту.
        requestAnimationFrame(() => {
          if (!lenis) return;
          lenis.scrollTo(y + 0.1, { immediate: true, force: true } as any);

          // Allow the micro-scroll adjustment to be processed in the current frame,
          // then release the block in the next frame.
          requestAnimationFrame(() => {
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
    if (isRestored) return;
    if (lenis) lenis.resize();

    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    // Проверяем, доросла ли страница до нужной высоты (с запасом 50px)
    if (maxScroll >= y - 50) {
      finalizeScroll();
    }
  };

  // 1. Пробуем мгновенно
  checkAndScroll();
  if (isRestored) return;

  // 2. Ждем сетевую загрузку контента через ResizeObserver
  observer = new ResizeObserver(() => {
    checkAndScroll();
  });
  observer.observe(document.body);

  // 3. Предохранитель на случай обрыва связи
  timeoutId = setTimeout(() => {
    finalizeScroll();
    window.__isScrollRestorationActive = false;
  }, maxWaitMs);
};

const RouteChangeHandler = ({ isMenuActionRef, wasMenuOpenRef }: RouteChangeHandlerProps) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const navigate = useNavigate();
  const isFirstLoad = useRef(true);
  const { setIsPopping } = useNavigation();
  const isHandlingPop = useRef(false);
  const prevPathnameRef = useRef(location.pathname);

  // Сохранение позиции при скролле (с защитой от перезаписи во время POP)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking || isHandlingPop.current || isFirstLoad.current || window.__isRoutingLock) return; // <-- ADD window.__isRoutingLock CHECK

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
      // КРИТИЧНО: Останавливаем Lenis МГНОВЕННО для Firefox (фикс задержки при инерции)
      if (lenis) {
        lenis.stop();
        // Сбрасываем velocity и isScrolling для мгновенной остановки инерции
        (lenis as any).velocity = 0;
        (lenis as any).isScrolling = false;
      }

      // Игнорируем POP от меню
      if (isMenuActionRef.current) return;
      if (wasMenuOpenRef.current && !event.state?.menuOpen) return;

      // Игнорируем переход на/с записи menuOpen — это меню, не навигация
      if (event.state?.menuOpen === true) return;

      // ФИКС: Игнорируем запуск пелены перехода, если изменились только query-параметры
      const targetPathname = window.location.pathname;
      if (targetPathname === prevPathnameRef.current) {
        return;
      }

      if (isHandlingPop.current) return;

      // КРИТИЧНО: Обновляем prevPathnameRef СРАЗУ, чтобы следующий POP-вперёд тоже показал вуаль
      prevPathnameRef.current = targetPathname;

      isHandlingPop.current = true;
      window.__popTransitionInProgress = true; // КРИТИЧНО: Устанавливаем глобальный флаг
      window.__isRoutingLock = true; // <-- LOCK SCROLL SAVING

      // Показываем вуаль немедленно
      setIsPopping(true);

      const targetPath = event.state?.path || window.location.pathname + window.location.search;
      const targetScroll = getScrollPosition(targetPath) ?? 0;

      // Fail-safe timeout: ensure cleanup happens even if something fails (увеличено до 2500ms для ленивой загрузки)
      cleanupTimeout = setTimeout(() => {
        setIsPopping(false);
        lenis?.start();
        isHandlingPop.current = false;
        window.__popTransitionInProgress = false; // КРИТИЧНО: Сбрасываем флаг при timeout
        window.__isRoutingLock = false; // <-- RELEASE LOCK
        if (window.ScrollTrigger) {
          window.ScrollTrigger.refresh();
        }
        // Уведомляем о завершении при timeout
        window.dispatchEvent(new CustomEvent("pop-transition-complete"));
      }, 2500); // Увеличено для надежной маскировки ленивой загрузки

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
                window.__isRoutingLock = false; // <-- RELEASE LOCK

                // Шаг 5: Финальный refresh после всего
                if (window.ScrollTrigger) {
                  window.ScrollTrigger.refresh();
                }

                // КРИТИЧНО: Уведомляем видео что POP переход завершен
                window.dispatchEvent(new CustomEvent("pop-transition-complete"));
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
        window.__isRoutingLock = false; // <-- RELEASE LOCK
        // Уведомляем о завершении при cleanup
        window.dispatchEvent(new CustomEvent("pop-transition-complete"));
      }
    };
  }, [navigate, setIsPopping, isMenuActionRef, wasMenuOpenRef]);

  // Первая загрузка и обычные переходы (PUSH)
  useEffect(() => {
    const currentPath = location.pathname + location.search;

    // СЦЕНАРИЙ 1: Первая загрузка сайта
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

    // СЦЕНАРИЙ 2: POP-переход (обрабатывается в popstate listener выше)
    // Блокируем прыжок в 0, если мы сейчас находимся в процессе обработки POP-перехода
    if (navigationType === "POP" || isHandlingPop.current) {
      return;
    }

    // СЦЕНАРИЙ 3: Обычный клик по ссылке в хедере (PUSH)
    // Проверяем, изменился ли сам путь (без учета параметров)
    const isPathChanged = location.pathname !== prevPathnameRef.current;
    prevPathnameRef.current = location.pathname;

    // Если изменились только параметры (например, открытие модалки), отменяем прыжок в 0
    if (!isPathChanged) {
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
      window.history.replaceState({ ...window.history.state, path: currentPath }, "", currentPath);
    }
  }, [location.pathname, location.search]);

  return null;
};

export default RouteChangeHandler;
