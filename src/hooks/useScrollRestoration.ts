import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { updateScroll } from "@/lib/lenis";

/**
 * Хук для правильного восстановления позиции скролла при навигации
 * и обновления Lenis при изменениях в DOM
 */
export function useScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    // Обновляем Lenis при изменении DOM
    const resizeObserver = new ResizeObserver(() => {
      updateScroll();
    });

    // Наблюдаем за изменениями в основном контейнере
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      resizeObserver.observe(mainContent);
    }

    // Обработчик для обновления Lenis при загрузке изображений
    const handleImageLoad = () => {
      updateScroll();
    };

    // Добавляем обработчики для всех изображений
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", handleImageLoad);
      }
    });

    return () => {
      // Очистка
      if (mainContent) {
        resizeObserver.unobserve(mainContent);
      }
      images.forEach((img) => {
        img.removeEventListener("load", handleImageLoad);
      });
    };
  }, [location.pathname]);

  return null;
}

export default useScrollRestoration;
