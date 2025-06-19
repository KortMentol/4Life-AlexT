import { useLayoutEffect, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  lenis,
  scrollTo,
  stopScroll,
  startScroll,
  updateScroll,
} from "@/lib/lenis";
import { mainNav } from "@/config/site";

export function ScrollToTopOnRouteChange() {
  const location = useLocation();

  // Эффект для принудительного сброса скролла при навигации
  useLayoutEffect(() => {
    // Останавливаем скролл перед изменениями
    stopScroll();

    // Сбрасываем скорость и инерцию
    lenis.velocity = 0;

    // Принудительно устанавливаем позицию скролла в 0
    window.scrollTo(0, 0);

    // Используем requestAnimationFrame для гарантии выполнения в следующем кадре анимации
    requestAnimationFrame(() => {
      // Сбрасываем скролл в начало страницы с помощью Lenis вместо нативного scrollTo
      scrollTo(0, { immediate: true });

      // Обновляем Lenis для учета новых размеров DOM
      updateScroll();

      // Запускаем скролл с небольшой задержкой для завершения рендеринга
      const timer = setTimeout(() => {
        startScroll();
      }, 50);

      return () => clearTimeout(timer);
    });
  }, [location.pathname, location.search, location.hash]);

  // Дополнительный эффект для навигации.
  //     На настольных устройствах делаем лёгкую анимацию (чтобы скрыть возможный контент-флэш).
  //     На мобильных — пропускаем, оставляем мгновенный «телепорт» без анимации.
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    if (isMobile) return;

    const currentNavItem = mainNav.find((item) => item.href === location.pathname);
    if (!currentNavItem) return;

    const timer = setTimeout(() => {
      lenis.scrollTo(0, {
        duration: 0.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }, 80);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
}
