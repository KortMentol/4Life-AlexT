// src/components/RouteChangeHandler.tsx
import { useNavigation } from "@/App";
import { lenis } from "@/lib/lenis";
import { RefObject, useEffect, useRef } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";

// Возвращаем старый ключ localStorage, как было в вашей рабочей версии
const STORAGE_KEY = "scroll_positions_v_final";

interface RouteChangeHandlerProps {
  isMenuActionRef: RefObject<boolean>;
  wasMenuOpenRef: RefObject<boolean>;
}

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

// ═════════════════════════════════════════════════════════════════════════════
// ИДЕАЛЬНАЯ ФУНКЦИЯ ВОССТАНОВЛЕНИЯ (ИЗ ВАШЕГО СТАРОГО РАБОЧЕГО КОДА)
// ═════════════════════════════════════════════════════════════════════════════
const restoreScrollPosition = (y: number, retries = 5) => {
  lenis?.stop();

  const attemptScroll = (attempt: number) => {
    if (attempt <= 0) {
      lenis?.start(); // Если не получилось за все попытки, просто запускаем скролл
      return;
    }

    // Проверяем, готова ли страница
    if (document.documentElement.scrollHeight > y) {
      lenis?.scrollTo(y, { immediate: true, force: true });
      requestAnimationFrame(() => {
        lenis?.start();
      });
    } else {
      // Если нет, пробуем еще раз через небольшой интервал
      setTimeout(() => attemptScroll(attempt - 1), 50);
    }
  };

  attemptScroll(retries);
};

const RouteChangeHandler = ({ isMenuActionRef, wasMenuOpenRef }: RouteChangeHandlerProps) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const navigate = useNavigate();
  const isFirstLoad = useRef(true);
  const { setIsPopping } = useNavigation();
  const isHandlingPop = useRef(false);

  // ═════════════════════════════════════════════════════════════════════════════
  // ЭФФЕКТ СОХРАНЕНИЯ ПОЗИЦИИ (С ЗАЩИТОЙ ОТ ПЕРЕЗАПИСИ)
  // ═════════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      // КРИТИЧЕСКИ ВАЖНО: блокируем сохранение, если идет pop-переход или загрузка.
      // Это полностью решает баг, когда 0px стирались и заменялись на 200px!
      if (ticking || isHandlingPop.current || isFirstLoad.current) return;

      ticking = true;
      requestAnimationFrame(() => {
        const currentPath = location.pathname + location.search;
        saveScrollPosition(currentPath, window.scrollY);
        ticking = false;
      });
    };

    // Экстренное сохранение при закрытии/перезагрузке
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

  // ═════════════════════════════════════════════════════════════════════════════
  // ПЕРЕХВАТЧИК POP-СОБЫТИЙ (С ТЯГУЧЕЙ ВУАЛЬЮ)
  // ═════════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (isMenuActionRef.current) return;
      if (wasMenuOpenRef.current && !event.state?.menuOpen) return;
      if (isHandlingPop.current) return;

      event.preventDefault();
      isHandlingPop.current = true;

      // 1. Показываем вуаль немедленно
      setIsPopping(true);
      lenis?.stop();

      const targetPath = event.state?.path || window.location.pathname + window.location.search;
      const targetScroll = getScrollPosition(targetPath) ?? 0;

      // 2. Двойной RAF гарантирует, что браузер отрендерит черную вуаль
      // ДО того, как React заблокирует поток навигацией
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          navigate(targetPath, { replace: true });

          // 3. Ждем пока React вставит новую страницу в DOM
          setTimeout(() => {
            restoreScrollPosition(targetScroll);

            // 4. ТАЙМИНГ ВУАЛИ (AWWWARDS FEEL)
            // Задержка в 350мс держит вуаль закрытой, скрывая прыжки скролла и контента.
            // Только после этого мы отключаем вуаль, и она ПЛАВНО растворяется за 0.5s.
            setTimeout(() => {
              setIsPopping(false);
              lenis?.start();
              isHandlingPop.current = false;
            }, 350);
          }, 50); // 50ms - время на рендер
        });
      });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate, setIsPopping, isMenuActionRef, wasMenuOpenRef]);

  // ═════════════════════════════════════════════════════════════════════════════
  // ПЕРВАЯ ЗАГРУЗКА И ОБЫЧНЫЕ ПЕРЕХОДЫ
  // ═════════════════════════════════════════════════════════════════════════════
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
        // Снимаем блокировку первой загрузки с небольшой задержкой
        setTimeout(() => {
          isFirstLoad.current = false;
        }, 300);
      };

      if (document.getElementById("preloader")) {
        setTimeout(performRestore, 2500); // Точно как в вашем старом коде
      } else {
        performRestore();
      }
      return;
    }

    if (navigationType === "POP" && isHandlingPop.current) {
      return;
    }

    // ОБЫЧНЫЕ ПЕРЕХОДЫ (клики по ссылкам)
    window.dispatchEvent(new CustomEvent("force-header-show"));
    lenis?.scrollTo(0, { immediate: true });
    lenis?.start();
  }, [location.pathname, location.search, navigationType]);

  // Синхронизация пути
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    if (window.history.state?.path !== currentPath) {
      window.history.replaceState({ ...window.history.state, path: currentPath }, "", currentPath);
    }
  }, [location.pathname, location.search]);

  return null;
};

export default RouteChangeHandler;
