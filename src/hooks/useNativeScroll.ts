import { useScroll, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { useIsMobile } from "./useIsMobile";

interface UseNativeScrollOptions {
  headerHeight: number;
  topOffset?: number;
  disabled?: boolean;
}

export type { UseNativeScrollOptions };

/**
 * @module src/hooks/useNativeScroll.ts
 * @description Управляет поведением хедера при скролле, обеспечивая плавную анимацию.
 * @version 5.0.0 (Awwwards Level - Refined)
 *
 * @logic
 * - **На ПК**: Хедер плавно скрывается после двух последовательных скроллов вниз и появляется после одного скролла вверх. Используется пружинная анимация для премиального ощущения.
 * - **На Мобильных**: Позиция хедера напрямую следует за пальцем. После отпускания, он плавно "прилипает" к ближайшему состоянию (открыт/закрыт).
 */
export function useNativeScroll({ headerHeight, topOffset = 8, disabled = false }: UseNativeScrollOptions) {
  const { scrollY } = useScroll();
  const headerY = useSpring(0, { stiffness: 400, damping: 40 });

  const startY = useRef(0);
  const downScrollCount = useRef(0);
  const downScrollTimer = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();
  const isTouching = useRef(false);

  const totalHeaderHeight = headerHeight + topOffset * 2;

  // --- ДЕСКТОПНАЯ ЛОГИКА НА ОСНОВЕ СОБЫТИЯ WHEEL ---
  useEffect(() => {
    if (isMobile || disabled) return;

    const handleWheel = (event: WheelEvent) => {
      const direction = event.deltaY > 0 ? "down" : "up";

      if (direction === "down") {
        // Сбрасываем таймер, если скроллы идут подряд
        if (downScrollTimer.current) clearTimeout(downScrollTimer.current);
        downScrollCount.current++;

        // Скрываем, если сделано 2+ скролла и мы не вверху страницы
        if (downScrollCount.current >= 2 && window.scrollY > totalHeaderHeight) {
          headerY.set(-totalHeaderHeight);
        }

        // Устанавливаем таймер для сброса счетчика, если будет пауза
        downScrollTimer.current = setTimeout(() => {
          downScrollCount.current = 0;
        }, 350);

      } else if (direction === "up") {
        // При скролле вверх немедленно показываем хедер и сбрасываем счетчик
        if (downScrollTimer.current) clearTimeout(downScrollTimer.current);
        downScrollCount.current = 0;
        headerY.set(0);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (downScrollTimer.current) clearTimeout(downScrollTimer.current);
    };
  }, [isMobile, disabled, headerY, totalHeaderHeight]);

  // --- ЛОГИКА ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ ---
  useEffect(() => {
    if (!isMobile || disabled) return;

    let startHeaderY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;

      isTouching.current = true;
      startY.current = touch.clientY;
      startHeaderY = headerY.get();
      headerY.stop();
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!isTouching.current || !touch) return;

      const deltaY = touch.clientY - startY.current;
      const newY = startHeaderY + deltaY;
      headerY.set(Math.max(-totalHeaderHeight, Math.min(0, newY)));
    };

    const handleTouchEnd = () => {
      isTouching.current = false;
      const velocity = scrollY.getVelocity();
      const currentY = headerY.get();

      // Логика "прилипания" к краям после отпускания пальца
      // velocity > 0: скролл вниз (палец вверх), velocity < 0: скролл вверх (палец вниз)
      if (velocity > 500 || (velocity >= 0 && currentY < -totalHeaderHeight / 2)) {
        headerY.set(-totalHeaderHeight);
      } else {
        headerY.set(0);
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isMobile, disabled, headerY, scrollY, totalHeaderHeight]);

  // Возвращаем хедер в исходное положение, если хук отключается
  useEffect(() => {
    if (disabled) {
      headerY.set(0);
    }
  }, [disabled, headerY]);

  return { headerY };
}
