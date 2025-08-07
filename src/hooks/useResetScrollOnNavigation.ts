import { lenis } from "@/lib/lenis";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * @module src/hooks/useResetScrollOnNavigation.ts
 * @description Хук, который сбрасывает позицию прокрутки в верхнее положение при смене маршрута.
 * @author Kort
 * @version 1.2.0 - Добавлена проверка `location.state`, чтобы игнорировать сброс при навигации из мобильного меню.
 * @see lenis - Экземпляр библиотеки плавной прокрутки.
 * @usage
 * 1. `src/App.tsx`: Вызывается один раз на верхнем уровне приложения для обеспечения глобального эффекта.
 */
export function useResetScrollOnNavigation() {
  const location = useLocation();

  useEffect(() => {
    // Проверяем, был ли этот переход инициирован из мобильного меню.
    // Если да, то этот хук ничего не делает, позволяя меню управлять скроллом.
    if (location.state?.fromMenuClick) {
      return;
    }

    // Для всех остальных переходов мгновенно скроллим наверх.
    lenis?.scrollTo(0, { immediate: true });
  }, [location.pathname]); // Зависимость только от пути
}

export default useResetScrollOnNavigation;
