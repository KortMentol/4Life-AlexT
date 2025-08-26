import { useScroll, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { useIsMobile } from "./useIsMobile";
import { scrollLockState } from "@/lib/scrollLockState";

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
export function useNativeScroll({
  headerHeight,
  topOffset = 8,
  disabled = false,
}: UseNativeScrollOptions) {
  const { scrollY } = useScroll();
  // --- ИЗМЕНЕНИЕ: Создаем MotionValue и Spring только ОДИН РАЗ ---
  const headerY = useMotionValue(0);
  const headerYSmooth = useSpring(headerY, { stiffness: 400, damping: 40 });

  const downScrollCount = useRef(0);
  const downScrollTimer = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();
  const isTouching = useRef(false);
  const prevY = useRef(0);
  const disabledRef = useRef(disabled);
  // Кулдаун для игнорирования wheel сразу после переходов (ПК)
  const wheelCooldownUntilRef = useRef<number>(0);

  useEffect(() => {
    disabledRef.current = disabled;
    if (disabled) {
      // Если выключено, просто останавливаем любую текущую анимацию
      headerY.stop();
      headerYSmooth.stop();
    }
  }, [disabled, headerY, headerYSmooth]);

  const totalHeaderHeight = headerHeight + topOffset * 2;

  // --- ДЕСКТОПНАЯ ЛОГИКА НА ОСНОВЕ СОБЫТИЯ WHEEL ---
  useEffect(() => {
    if (isMobile || disabled) return;

    const handleWheel = (event: WheelEvent) => {
      if (disabledRef.current) return;
      // Не прячем хедер сразу после перехода по истории/ссылке
      if (Date.now() < wheelCooldownUntilRef.current) {
        return;
      }
      const direction = event.deltaY > 0 ? "down" : "up";

      if (direction === "down") {
        // Сбрасываем таймер, если скроллы идут подряд
        if (downScrollTimer.current) clearTimeout(downScrollTimer.current);
        downScrollCount.current++;

        // Скрываем, если сделано 2+ скролла и мы не вверху страницы
        if (
          downScrollCount.current >= 2 &&
          window.scrollY > totalHeaderHeight
        ) {
          headerYSmooth.set(-totalHeaderHeight);
        }

        // Устанавливаем таймер для сброса счетчика, если будет пауза
        downScrollTimer.current = setTimeout(() => {
          downScrollCount.current = 0;
        }, 350);
      } else if (direction === "up") {
        // При скролле вверх немедленно показываем хедер и сбрасываем счетчик
        if (downScrollTimer.current) clearTimeout(downScrollTimer.current);
        downScrollCount.current = 0;
        headerYSmooth.set(0);
      }
    };

    const handleRouteTransitionDone = () => {
      wheelCooldownUntilRef.current = Date.now() + 1000;
      forceShowHeader();
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("route-transition-done", handleRouteTransitionDone);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("route-transition-done", handleRouteTransitionDone);
      if (downScrollTimer.current) clearTimeout(downScrollTimer.current);
    };
  }, [isMobile, disabled, headerY, headerYSmooth, totalHeaderHeight]);

  // --- ЛОГИКА ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ ---
  useEffect(() => {
    if (!isMobile || disabled) return;

    const handleTouchStart = (event: TouchEvent) => {
      if (disabledRef.current) return;
      const touch = event.touches[0];
      if (!touch) return;

      isTouching.current = true;
      prevY.current = touch.clientY;
      headerY.stop();
    };

    const handleTouchMove = (event: TouchEvent) => {
      // Если скролл заблокирован ИЛИ хук отключен, ничего не делаем
      if (disabledRef.current || scrollLockState.isLocked) return;
      const touch = event.touches[0];
      if (!isTouching.current || !touch) return;

      const deltaY = touch.clientY - prevY.current;
      prevY.current = touch.clientY;

      const currentY = headerY.get();
      const newY = currentY + deltaY;

      // Жестко ограничиваем позицию в пределах от 0 до -totalHeaderHeight
      const clampedY = Math.max(-totalHeaderHeight, Math.min(0, newY));

      headerY.set(clampedY);
    };

    const handleTouchEnd = () => {
      if (disabledRef.current) return;
      isTouching.current = false;
      const velocity = scrollY.getVelocity();
      const currentY = headerY.get();

      // Ограничиваем Y в пределах от 0 до -totalHeaderHeight
      const clampedY = Math.max(-totalHeaderHeight, Math.min(0, currentY));
      headerY.set(clampedY);

      // Логика "прилипания" к краям
      if (Math.abs(velocity) < 100) {
        // Если скорость низкая, прилипаем к ближайшему краю
        headerY.set(clampedY < -totalHeaderHeight / 2 ? -totalHeaderHeight : 0);
      } else {
        // Если скорость высокая, анимируем в направлении движения
        headerY.set(velocity > 0 ? -totalHeaderHeight : 0);
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

  const forceShowHeader = () => {
    // Принудительно показываем хедер без дерганий
    try {
      headerY.stop();
      headerYSmooth.stop();
    } catch {}
    headerY.set(0);
    // На всякий случай выставим и значение пружины напрямую,
    // чтобы на ПК моментально отобразилось без ожидания синхронизации
    headerYSmooth.set(0);
  };

  return { headerY: headerYSmooth, forceShowHeader };
}
