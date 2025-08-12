import { lenis, updateScroll } from "@/lib/lenis";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// ИНТЕРФЕЙС, ОПИСЫВАЮЩИЙ PROPS, КОТОРЫЕ КОМПОНЕНТ ТЕПЕРЬ БУДЕТ ПРИНИМАТЬ
interface RouteChangeHandlerProps {
  onTransitionStart: () => void;
  onTransitionEnd: () => void;
  isMenuOpen: boolean;
  closeMenu: () => void;
}

/**
 * @module components/RouteChangeHandler
 * @description Управляет позицией прокрутки, используя "занавес" (оверлей) для бесшовных POP-переходов.
 * @version 4.0.0 (Seamless POP, mobile-safe)
 */
// ИЗМЕНЕНО: Компонент теперь принимает props
const RouteChangeHandler: React.FC<RouteChangeHandlerProps> = ({ onTransitionStart, onTransitionEnd, isMenuOpen, closeMenu }) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef<Map<string, number>>(new Map());
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const isNavigatingRef = useRef(false);
  // Индекс истории для надёжного определения направления POP
  const currentIdxRef = useRef<number>(0);
  // Максимальный индекс, который мы когда-либо достигали в этой вкладке
  const maxIdxRef = useRef<number>(0);
  // neutralization of POP is now handled in App

  // Хранилище в sessionStorage — переживает размонтирование и BFCache (Mobile Safari)
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

  // Инициализируем ref из sessionStorage при первом рендере
  if (isFirstRender.current && scrollPositions.current.size === 0) {
    const initial = readStorage();
    for (const [k, v] of Object.entries(initial)) {
      scrollPositions.current.set(k, v);
    }
  }

  // Стабилизируем колбэки через ref, чтобы их изменение не перезапускало эффект
  const onStartRef = useRef(onTransitionStart);
  const onEndRef = useRef(onTransitionEnd);
  useEffect(() => {
    onStartRef.current = onTransitionStart;
    onEndRef.current = onTransitionEnd;
  }, [onTransitionStart, onTransitionEnd]);

  // 1. Отключаем нативное восстановление скролла
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // 1.1. Инициализация индекса истории для детекции направления POP
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

  // 1.2. Поддерживаем индекс при изменении location (после навигации)
  useEffect(() => {
    try {
      if (navigationType === "POP") {
        // Определяем целевой индекс из state
        const st = window.history.state || {};
        const targetIdx = typeof (st as any).__idx === "number" ? (st as any).__idx : null;
        if (targetIdx !== null) {
          currentIdxRef.current = targetIdx;
        }
      } else if (navigationType === "PUSH") {
        // Новый элемент истории — увеличиваем индекс
        currentIdxRef.current += 1;
        const st = window.history.state || {};
        window.history.replaceState({ ...st, __idx: currentIdxRef.current }, "");
        // Обновляем правую границу (forward доступен, когда current < max)
        if (currentIdxRef.current > maxIdxRef.current) {
          maxIdxRef.current = currentIdxRef.current;
        }
      } else if (navigationType === "REPLACE") {
        // Замена текущей записи — индекс не меняем, только синхронизируем
        const st = window.history.state || {};
        window.history.replaceState({ ...st, __idx: currentIdxRef.current }, "");
      }
    } catch {
      // ignore
    }
    // Экспортируем индексы глобально для App.tsx (опционально используем при POP)
    (window as any).__histCurrentIdx = currentIdxRef.current;
    (window as any).__histMaxIdx = maxIdxRef.current;
  }, [location.key, navigationType]);

  // 1.3. Перехват POP: если меню открыто — НИЧЕГО НЕ ДЕЛАЕМ (всё обрабатывает App)
  useEffect(() => {
    const onPop = () => {
      if (isMenuOpen) return;
    };

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [isMenuOpen, closeMenu]);

  // 2. Новая, бесшовная логика восстановления
  useLayoutEffect(() => {
    // Не запускаем логику занавеса на самом первом рендере (initial mount)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Очищаем предыдущий таймер на случай быстрых последовательных переходов
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current);
    }

    if (navigationType === "POP") {
      // POP: мгновенно и без "занавеса" — никакой задержки/рывков
      const fromStorage = readStorage();
      const savedPosition =
        scrollPositions.current.get(location.key) ?? fromStorage[location.key];

      if (typeof savedPosition === "number") {
        // Синхронное восстановление до первого кадра
        try {
          // Блокируем запись скролла на время восстановления
          isNavigatingRef.current = true;
          // На мобильных даем минимальную маску на кадр, чтобы убрать "миг" верха
          const isMobile = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 767px)").matches;
          if (isMobile) onStartRef.current?.();
          // Останавливаем плавные анимации, фиксируем позицию сразу
          lenis?.stop();
          lenis?.scrollTo(savedPosition, { immediate: true, force: true });
          updateScroll();
        } finally {
          lenis?.start();
        }

        // Гарантийная подстройка: пока высота контента меняется, повторяем фикс (до 500ms)
        let start = 0;
        let frame = 0;
        const maxMs = 500;
        const tolerance = 1; // px
        const ensure = (ts: number) => {
          if (start === 0) start = ts;
          frame++;
          updateScroll();
          const needAdjust = Math.abs(window.scrollY - savedPosition) > tolerance;
          if (needAdjust && ts - start < maxMs) {
            lenis?.scrollTo(savedPosition, { immediate: true, force: true });
            requestAnimationFrame(ensure);
          }
        };
        requestAnimationFrame((ts) => {
          ensure(ts);
          // Снимаем маску и разблокируем запись после кадра
          const isMobile = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 767px)").matches;
          if (isMobile) onEndRef.current?.();
          isNavigatingRef.current = false;
          // Сообщаем глобально, что переход завершён (важно для десктопного хедера)
          window.dispatchEvent(new CustomEvent("route-transition-done"));
        });
      } else {
        // Нет сохраненной позиции — считаем как обычную навигацию
        isNavigatingRef.current = true;
        lenis?.scrollTo(0, { immediate: true });
        requestAnimationFrame(() => {
          isNavigatingRef.current = false;
          window.dispatchEvent(new CustomEvent("route-transition-done"));
        });
      }
    } else {
      // Для обычных переходов (PUSH/REPLACE) — можно использовать занавес и мгновенный скролл вверх
      isNavigatingRef.current = true;
      onStartRef.current?.();
      // Без задержек
      lenis?.scrollTo(0, { immediate: true });
      // Убираем занавес на следующем кадре — минимально возможная длительность
      requestAnimationFrame(() => {
        onEndRef.current?.();
        isNavigatingRef.current = false;
        window.dispatchEvent(new CustomEvent("route-transition-done"));
      });
    }
    // Очистка таймера при смене маршрута/размонтировании
    return () => {
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
        transitionTimeout.current = null;
      }
    };
  }, [location.key, navigationType]);

  // 3. Логика сохранения позиции (throttle по rAF) + синхронизация с sessionStorage
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      // Во время навигации не сохраняем позицию, чтобы не перетирать старую запись
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
    // Сразу зафиксируем текущую позицию (важно для первой записи ключа)
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.key]);

  // 4. Поддержка BFCache/мобильных POP: pageshow/pagehide
  useEffect(() => {
    const onPageShow = () => {
      // При возврате из BFCache Safari сам восстанавливает scroll, но lenis мог рассинхрониться
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
