import { useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { useIsMobile } from "./useIsMobile";
import { scrollLockState } from "@/lib/scrollLockState";

export function useNativeScroll({ disabled = false }: { disabled?: boolean }) {
  const headerY = useMotionValue(0);
  const headerYSmooth = useSpring(headerY, { 
    stiffness: 400, 
    damping: 40,
    mass: 0.8
  });
  
  const isMobile = useIsMobile();
  const scrollCount = useRef(0);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  const isTouching = useRef(false);
  const touchStartY = useRef(0);
  const headerStartY = useRef(0);

  useEffect(() => {
    if (disabled) return;

    // Десктопная логика - 2 скролла вниз чтобы скрыть, 1 вверх чтобы показать
    const handleWheel = (event: WheelEvent) => {
      const direction = event.deltaY > 0 ? "down" : "up";
      
      if (direction === "down") {
        if (scrollTimer.current) clearTimeout(scrollTimer.current);
        scrollCount.current++;
        
        if (scrollCount.current >= 2 && window.scrollY > 100) {
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

    // Мобильная логика - следование за пальцем как нативный бар браузера
    const handleTouchStart = (event: TouchEvent) => {
      if (!event.touches[0]) return;
      isTouching.current = true;
      touchStartY.current = event.touches[0].clientY;
      headerStartY.current = headerY.get();
      headerY.stop(); // Останавливаем spring анимацию
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isTouching.current || !event.touches[0]) return;
      
      // Если вертикальный скролл заблокирован горизонтальным свайпом - не двигаем хедер
      if (scrollLockState.isLocked) return;
      
      const currentTouchY = event.touches[0].clientY;
      const deltaY = currentTouchY - touchStartY.current;
      
      // Рассчитываем новую позицию хедера на основе движения пальца
      const newHeaderY = headerStartY.current + deltaY * 0.8; // Увеличиваем чувствительность
      const clampedY = Math.max(-100, Math.min(0, newHeaderY));
      
      // Прямое управление без spring для мгновенного отклика
      headerY.set(clampedY);
    };

    const handleTouchEnd = () => {
      if (!isTouching.current) return;
      isTouching.current = false;
      
      // Если скролл был заблокирован - не анимируем хедер
      if (scrollLockState.isLocked) return;
      
      const currentY = headerY.get();
      const velocity = headerY.getVelocity();
      
      // Логика "прилипания" с учетом скорости и позиции
      if (Math.abs(velocity) > 150) {
        // Быстрое движение - анимируем в направлении движения
        headerY.set(velocity < 0 ? -100 : 0);
      } else {
        // Медленное движение - прилипаем к ближайшей позиции (более чувствительный порог)
        headerY.set(currentY < -30 ? -100 : 0);
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