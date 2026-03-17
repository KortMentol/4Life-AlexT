// src/components/RouteChangeHandler.tsx
import { useNavigation } from "@/App";
import { lenis } from "@/lib/lenis";
import { useEffect, useRef, RefObject } from "react";
import { useLocation, useNavigationType, useNavigate } from "react-router-dom";

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

// --- НОВАЯ, ГАРАНТИРОВАННАЯ ФУНКЦИЯ ВОССТАНОВЛЕНИЯ СКРОЛЛА ---
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

  // Эффект сохранения позиции (debounced)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const currentPath = location.pathname + location.search;
        saveScrollPosition(currentPath, window.scrollY);
      }, 150);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname, location.search]);

  // ПЕРЕХВАТЧИК POP-СОБЫТИЙ (ДО React Router)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Проверка №1: Игнорируем, если это клик по кнопке в меню
      if (isMenuActionRef.current) {
        return;
      }
      
      // Проверка №2
      // Если меню БЫЛО открыто, а теперь мы переходим в состояние,
      // где оно закрыто, значит это закрытие меню кнопкой "назад". Игнорируем.
      if (wasMenuOpenRef.current && !event.state?.menuOpen) {
        return;
      }
      
      if (isHandlingPop.current) return;
      
      // Предотвращаем стандартную навигацию
      event.preventDefault();
      isHandlingPop.current = true;
      
      // Мгновенно показываем вуаль (как делают в Immersive Garden)
      setIsPopping(true);
      lenis?.stop();
      
      // Получаем целевой путь из истории
      const targetPath = event.state?.path || window.location.pathname;
      const targetScroll = getScrollPosition(targetPath) ?? 0;
      
      // Минимальная пауза для отрисовки вуали, затем навигируем
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Принудительно показываем хедер при POP-переходе
          window.dispatchEvent(new CustomEvent("force-header-show"));
          
          // Делаем навигацию за вуалью
          navigate(targetPath, { replace: true });
          
          // Телепортируем скролл
          setTimeout(() => {
            lenis?.scrollTo(targetScroll, { immediate: true, force: true });
            
            // Даем время на стабилизацию, затем элегантно убираем вуаль
            setTimeout(() => {
              setIsPopping(false);
              lenis?.start();
              isHandlingPop.current = false;
            }, 150);
          }, 50);
        });
      });
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate, setIsPopping, isMenuActionRef, wasMenuOpenRef]);

  // ОСНОВНОЙ ЭФФЕКТ (для первой загрузки и обычных переходов)
  useEffect(() => {
    const currentPath = location.pathname + location.search;

    // ЛОГИКА ДЛЯ ПЕРВОЙ ЗАГРУЗКИ
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      const savedY = getScrollPosition(currentPath);

      if (savedY !== null && savedY > 0) {
        const preloader = document.getElementById("preloader");
        if (preloader) {
          setTimeout(() => {
            restoreScrollPosition(savedY);
          }, 2500);
        } else {
          restoreScrollPosition(savedY);
        }
      } else {
        lenis?.start();
      }
      return;
    }

    // Пропускаем, если это pop-переход (обрабатывается выше)
    if (navigationType === "POP" && isHandlingPop.current) {
      return;
    }

    // ОБЫЧНЫЕ ПЕРЕХОДЫ (клики по ссылкам)
    window.dispatchEvent(new CustomEvent("force-header-show"));
    lenis?.scrollTo(0, { immediate: true });
    lenis?.start();
  }, [location.pathname, location.search, navigationType]);

  // Сохраняем текущий путь в history.state для popstate
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    if (window.history.state?.path !== currentPath) {
      window.history.replaceState({ ...window.history.state, path: currentPath }, '', currentPath);
    }
  }, [location.pathname, location.search]);

  return null;
};

export default RouteChangeHandler;
