import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { lenis, updateScroll } from "@/lib/lenis";

/**
 * @module src/components/utils/RouteChangeHandler.tsx
 * @description Утилитарный компонент, который отслеживает изменения URL с помощью хука `useLocation` из `react-router-dom`. При каждом изменении пути (`location.pathname`) он может выполнять определенные действия. Компонент не рендерит ничего в DOM (возвращает `null`).
 * @author Kort
 * @version 1.1.0
 * @usage
 * 1. `src/App.tsx`: Используется для отслеживания смены маршрута.
 * @example
 * return (
 *   <Router>
 *     <RouteChangeHandler />
 *     // ... остальные маршруты
 *   </Router>
 * );
 */
const RouteChangeHandler: React.FC = () => {
  const location = useLocation();
  const navigationType = useNavigationType(); // 'POP' | 'PUSH' | 'REPLACE'

  // Храним позиции скролла по ключу history
  const positionsRef = useRef<Map<string, number>>(new Map());
  const prevLocationRef = useRef(location);

  // Включаем ручное управление восстановлением скролла
  useEffect(() => {
    const historyWithSR = window.history as History & { scrollRestoration?: "auto" | "manual" };
    const prev = historyWithSR.scrollRestoration;
    try {
      if ("scrollRestoration" in historyWithSR) {
        historyWithSR.scrollRestoration = "manual";
      }
    } catch {}
    return () => {
      try {
        if ("scrollRestoration" in historyWithSR && prev) {
          historyWithSR.scrollRestoration = prev;
        }
      } catch {}
    };
  }, []);

  useEffect(() => {
    prevLocationRef.current = location;

    // Унифицированная функция мгновенного скролла с синхронизацией Lenis
    const instantScrollTo = (y: number) => {
      // Останавливаем текущие анимации скролла
      try { lenis.stop(); } catch {}
      // Сначала ставим нативно (на всякий случай)
      window.scrollTo(0, y);
      // Ждем кадр, пересчитываем размеры, затем мгновенно синхронизируем Lenis
      requestAnimationFrame(() => {
        updateScroll();
        requestAnimationFrame(() => {
          try { lenis.scrollTo(y, { immediate: true }); } catch { window.scrollTo(0, y); }
          // Небольшая задержка перед стартом, чтобы не дергалась инерция
          setTimeout(() => { try { lenis.start(); } catch {} }, 0);
        });
      });
    };

    if (navigationType === "POP") {
      // Восстанавливаем сохраненную позицию (если нет — 0)
      const saved = positionsRef.current.get(location.key) ?? 0;
      instantScrollTo(saved);
    } else {
      // PUSH/REPLACE — гарантированно наверх
      instantScrollTo(0);
    }
  }, [location.key, location.pathname, navigationType]);

  // Подписываемся на скролл и сохраняем позицию для текущего ключа history
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          positionsRef.current.set(location.key, window.scrollY || 0);
          ticking = false;
        });
      }
    };

    // Запишем стартовую позицию для текущего экрана
    positionsRef.current.set(location.key, window.scrollY || 0);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll as EventListener);
    };
  }, [location.key]);

  return null;
};

export default RouteChangeHandler;
