// src/hooks/useNativeScroll.ts (ОПТИМИЗИРОВАННАЯ ВЕРСИЯ)
import { useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { scrollLockState } from "@/lib/scrollLockState";
import { useIsMobile } from "./useIsMobile";

const throttle = (func: (...args: any[]) => void, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export function useNativeScroll({ disabled = false }: { disabled?: boolean }) {
  const isMobile = useIsMobile();
  const headerY = useMotionValue(0);
  const headerYSmooth = useSpring(headerY, { stiffness: 300, damping: 30 });

  const prevScrollPos = useRef(window.scrollY);
  const wheelCount = useRef(0);
  const wheelTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isMobile || disabled) return;

    const handleWheel = (e: WheelEvent) => {
      if (window.scrollY <= 50) return;
      
      const isScrollingDown = e.deltaY > 0;

      if (isScrollingDown) {
        wheelCount.current++;
        
        if (wheelCount.current >= 2) {
          headerY.set(-120);
        }

        if (wheelTimer.current) clearTimeout(wheelTimer.current);
        wheelTimer.current = setTimeout(() => {
          wheelCount.current = 0;
        }, 400);
      } else {
        wheelCount.current = 0;
        headerY.set(0);
        if (wheelTimer.current) clearTimeout(wheelTimer.current);
      }
    };

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingUp = prevScrollPos.current > currentScrollPos;
      const scrollDelta = Math.abs(currentScrollPos - prevScrollPos.current);
      
      if (scrollDelta < 5) {
        prevScrollPos.current = currentScrollPos;
        return;
      }
      
      if (currentScrollPos <= 50) {
        headerY.set(0);
      } else if (isScrollingUp) {
        headerY.set(0);
      } else if (scrollDelta > 20) {
        headerY.set(-120);
      }

      prevScrollPos.current = currentScrollPos;
    };

    const throttledScroll = throttle(handleScroll, 16);

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("scroll", throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", throttledScroll);
      if (wheelTimer.current) clearTimeout(wheelTimer.current);
    };
  }, [isMobile, disabled, headerY]);

  useEffect(() => {
    if (!isMobile || disabled) return;

    let lastTouchY = 0;
    let lastMoveTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      lastTouchY = touch.clientY;
      lastMoveTime = Date.now();
      headerYSmooth.stop();
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      
      const now = Date.now();
      if (now - lastMoveTime < 16) return; // 60fps throttle
      
      const currentY = touch.clientY;

      // --- CORE FIX: GUARD CLAUSE ---
      // Если скролл заблокирован глобально (идет горизонтальный свайп),
      // мы не анимируем хедер, но ОБЯЗАНЫ обновить координаты, 
      // чтобы не было резкого прыжка (teleport) при разблокировке.
      if (scrollLockState.isLocked || disabled) {
        lastTouchY = currentY;
        lastMoveTime = now;
        return;
      }
      
      const deltaY = currentY - lastTouchY;
      const currentHeaderY = headerY.get();
      
      // Движение пальца вверх (скролл страницы вниз) = скрываем хедер
      // Движение пальца вниз (скролл страницы вверх) = показываем хедер
      const newHeaderY = currentHeaderY + deltaY * 0.5; // 0.5 для плавности
      const clampedY = Math.max(-120, Math.min(0, newHeaderY));
      
      headerY.set(clampedY);
      lastTouchY = currentY;
      lastMoveTime = now;
    };
    
    const handleTouchEnd = () => {
      const currentY = headerY.get();
      const velocity = headerY.getVelocity();
      
      if (Math.abs(velocity) > 200) {
        headerY.set(velocity < 0 ? -120 : 0);
      } else {
        headerY.set(currentY < -60 ? -120 : 0);
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, disabled, headerY, headerYSmooth]);
  
  return { headerY: headerYSmooth };
}
