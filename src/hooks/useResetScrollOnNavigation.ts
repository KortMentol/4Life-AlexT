import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { lenis } from "@/lib/lenis";

/**
 * Хук для принудительного сброса скролла при навигации,
 * решает проблему с инерцией Lenis при переходе между страницами
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
