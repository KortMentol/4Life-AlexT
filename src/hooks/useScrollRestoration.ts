import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { updateScroll } from "@/lib/lenis";

/**
 * @module src/hooks/useScrollRestoration.ts
 * @description Хук для обеспечения корректной работы прокрутки с Lenis. Он отслеживает изменения в DOM (через `ResizeObserver`) и загрузку изображений, вызывая `updateScroll()` для пересчета высоты страницы. Это решает проблемы, когда высота контента меняется динамически, и Lenis "не знает" о новой высоте, что приводит к неправильному поведению скроллбара.
 * @author Kort
 * @version 1.0.0
 * @see updateScroll - Утилита для обновления состояния Lenis.
 * @usage
 * 1. `src/App.tsx`: Вызывается один раз на верхнем уровне приложения для глобального отслеживания изменений.
 * @example
 * // В корневом компоненте приложения (например, App.tsx)
 * useScrollRestoration();
 * 
 * return (
 *   // ... JSX разметка
 * );
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
