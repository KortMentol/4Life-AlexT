import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { lenis } from "@/lib/lenis";

/**
 * @module src/hooks/useResetScrollOnNavigation.ts
 * @description Хук, который принудительно сбрасывает позицию прокрутки в верхнее положение при каждой смене маршрута (`location.pathname`). Это необходимо для корректной работы с библиотекой плавной прокрутки Lenis, так как хук останавливает инерционное движение, сбрасывает скорость и немедленно перемещает скролл наверх, предотвращая "перескакивание" на старую позицию на новой странице.
 * @author Kort
 * @version 1.0.0
 * @see lenis - Экземпляр библиотеки плавной прокрутки.
 * @usage
 * 1. `src/App.tsx`: Вызывается один раз на верхнем уровне приложения для обеспечения глобального эффекта.
 * @example
 * // В корневом компоненте приложения (например, App.tsx)
 * useResetScrollOnNavigation();
 * 
 * return (
 *   // ... JSX разметка
 * );
 */
export function useResetScrollOnNavigation() {
  const location = useLocation();

  useEffect(() => {
    // Останавливаем Lenis для предотвращения инерции
    lenis.stop();

    // Сбрасываем скорость и инерцию
    lenis.velocity = 0;

    // Принудительно устанавливаем позицию скролла в 0
    window.scrollTo(0, 0);

    // Используем RAF для гарантии выполнения после рендеринга
    requestAnimationFrame(() => {
      // Повторно сбрасываем скролл для надежности
      lenis.scrollTo(0, { immediate: true });

      // Запускаем Lenis с небольшой задержкой
      setTimeout(() => {
        lenis.start();
      }, 50);
    });
  }, [location.pathname]);
}

export default useResetScrollOnNavigation;
