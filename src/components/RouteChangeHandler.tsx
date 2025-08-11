import { lenis } from "@/lib/lenis";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// ИНТЕРФЕЙС, ОПИСЫВАЮЩИЙ PROPS, КОТОРЫЕ КОМПОНЕНТ ТЕПЕРЬ БУДЕТ ПРИНИМАТЬ
interface RouteChangeHandlerProps {
  onTransitionStart: () => void;
  onTransitionEnd: () => void;
}

/**
 * @module components/RouteChangeHandler
 * @description Управляет позицией прокрутки, используя "занавес" (оверлей) для бесшовных POP-переходов.
 * @version 3.0.0 (Seamless)
 */
// ИЗМЕНЕНО: Компонент теперь принимает props
const RouteChangeHandler: React.FC<RouteChangeHandlerProps> = ({ onTransitionStart, onTransitionEnd }) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef<Map<string, number>>(new Map());
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

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
      const savedPosition = scrollPositions.current.get(location.key);

      if (savedPosition !== undefined) {
        // 1. Показываем "занавес"
        onStartRef.current?.();

        // 2. Ждем, пока страница отрисуется за "занавесом"
        transitionTimeout.current = setTimeout(() => {
          // 3. Делаем один точный скролл
          lenis?.scrollTo(savedPosition, { immediate: true, force: true });

          // 4. Убираем "занавес"
          onEndRef.current?.();
        }, 250); // 250ms - надежное время для отрисовки
      } else {
        lenis?.scrollTo(0, { immediate: true });
      }
    } else {
      // Для обычных переходов (клик по ссылке) скроллим наверх мгновенно.
      lenis?.scrollTo(0, { immediate: true });
    }
    // Очистка таймера при смене маршрута/размонтировании
    return () => {
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
        transitionTimeout.current = null;
      }
    };
  }, [location.key, navigationType]);

  // 3. Логика сохранения позиции
  useEffect(() => {
    const handleScroll = () => {
      scrollPositions.current.set(location.key, window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.key]);

  return null;
};

export default RouteChangeHandler;
