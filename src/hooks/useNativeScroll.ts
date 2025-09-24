import { scrollLockState } from "@/lib/scrollLockState";
import { useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { useIsMobile } from "./useIsMobile";

export function useNativeScroll({ disabled = false }: { disabled?: boolean }) {
  const headerY = useMotionValue(0);
  const headerYSmooth = useSpring(headerY, {
    stiffness: 400,
    damping: 40,
    mass: 0.8,
  });

  const isMobile = useIsMobile();
  const scrollCount = useRef(0);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  const isTouching = useRef(false);
  const touchStartY = useRef(0);
  const headerStartY = useRef(0);

  // Переменные для дросселирования (throttling)
  const lastTouchMoveTime = useRef(0);
  // Обновляем не чаще, чем раз в ~16.67 мс (что соответствует ~60 FPS)
  const THROTTLE_INTERVAL = 16;

  useEffect(() => {
    if (disabled) return;

    // Десктопная логика остается без изменений
    const handleWheel = (event: WheelEvent) => {
      const direction = event.deltaY > 0 ? "down" : "up";

      if (direction === "down") {
        if (scrollTimer.current) clearTimeout(scrollTimer.current);
        scrollCount.current++;

        if (scrollCount.current >= 2 && window.scrollY > 50) {
          headerY.set(-100);
        }

        scrollTimer.current = setTimeout(() => {
          scrollCount.current = 0;
        }, 300);
      } else {
        if (scrollTimer.current) clearTimeout(scrollTimer.current);
        scrollCount.current = 0;
        headerY.set(0);
      }
    };

    // Мобильная логика с оптимизацией
    const handleTouchStart = (event: TouchEvent) => {
      if (!event.touches[0]) return;
      isTouching.current = true;
      touchStartY.current = event.touches[0].clientY;
      headerStartY.current = headerY.get();
      headerY.stop(); // Останавливаем spring-анимацию для мгновенного отклика
    };

    const handleTouchMove = (event: TouchEvent) => {
      const now = performance.now();
      if (now - lastTouchMoveTime.current < THROTTLE_INTERVAL) {
        return; // Пропускаем вызов, если прошло слишком мало времени
      }
      lastTouchMoveTime.current = now;

      if (!isTouching.current || !event.touches[0]) return;
      if (scrollLockState.isLocked) return;

      const currentTouchY = event.touches[0].clientY;
      const deltaY = currentTouchY - touchStartY.current;
      const newHeaderY = headerStartY.current + deltaY;
      const clampedY = Math.max(-100, Math.min(0, newHeaderY));

      headerY.set(clampedY);
    };

    const handleTouchEnd = () => {
      if (!isTouching.current) return;
      isTouching.current = false;
      if (scrollLockState.isLocked) return;

      const currentY = headerY.get();
      const velocity = headerY.getVelocity();

      if (Math.abs(velocity) > 150) {
        headerY.set(velocity < 0 ? -100 : 0);
      } else {
        // Используем порог в 50% для "прилипания"
        headerY.set(currentY < -50 ? -100 : 0);
      }
    };

    if (isMobile) {
      window.addEventListener("touchstart", handleTouchStart, { passive: true });
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleTouchEnd, { passive: true });
      window.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    } else {
      window.addEventListener("wheel", handleWheel, { passive: true });
    }

    return () => {
      if (isMobile) {
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
        window.removeEventListener("touchcancel", handleTouchEnd);
      } else {
        window.removeEventListener("wheel", handleWheel);
      }
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [disabled, isMobile, headerY]);

  const forceShowHeader = () => {
    headerY.set(0);
  };

  return { headerY: headerYSmooth, forceShowHeader };
}
