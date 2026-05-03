/**
 * @module src/hooks/useTouchScrollLock.ts
 * @description Блокировка нативного скролла через CSS touch-action вместо preventDefault().
 * CSS-подход не блокирует compositor thread — браузер может оптимизировать скролл нативно.
 * @author Kort
 * @version 3.0.0 - CSS touch-action вместо passive:false preventDefault
 * @usage
 * 1. `src/App.tsx`: Используется для блокировки нативного скролла, когда меню закрыто.
 * @param {boolean} isEnabled - Флаг активации блокировки
 */
import { useEffect } from "react";

export const useTouchScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    const html = document.documentElement;
    // Когда isLocked = true (например, меню открыто), жестко блокируем всё
    if (isLocked) {
      html.style.touchAction = "none";
      html.style.overflow = "hidden";
    } else {
      html.style.touchAction = "";
      html.style.overflow = "";
    }
    return () => {
      html.style.touchAction = "";
      html.style.overflow = "";
    };
  }, [isLocked]);
};
