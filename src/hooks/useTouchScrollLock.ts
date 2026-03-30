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

export const useTouchScrollLock = (isEnabled: boolean) => {
  useEffect(() => {
    const html = document.documentElement;

    if (isEnabled) {
      // CSS touch-action: none блокирует нативный скролл без JS-обработчика
      // Это не трогает compositor thread — браузер сам обрабатывает тач
      html.style.touchAction = "none";
    } else {
      html.style.touchAction = "";
    }

    return () => {
      html.style.touchAction = "";
    };
  }, [isEnabled]);
};
