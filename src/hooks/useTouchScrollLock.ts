/**
 * @module src/hooks/useTouchScrollLock.ts
 * @description Хук для агрессивной блокировки нативного поведения браузера при тач-скролле.
 * Предотвращает pull-to-refresh, скрытие адресной строки и другие нативные UI-действия,
 * позволяя Lenis полностью контролировать прокрутку.
 * @author Kort
 * @version 1.0.0
 * @usage
 * 1. `src/App.tsx`: Используется для блокировки нативного скролла, когда меню закрыто.
 * @param {boolean} isEnabled - Флаг активации блокировки
 * @example
 * useTouchScrollLock(!isMenuOpen);
 */
import { useEffect } from 'react';

export const useTouchScrollLock = (isEnabled: boolean) => {
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const handleTouchMove = (e: TouchEvent) => {
      // Запрещаем браузеру выполнять нативные действия (pull-to-refresh, скрытие UI)
      // Lenis продолжит обрабатывать координаты касания для плавной прокрутки
      e.preventDefault();
    };

    // { passive: false } критически важна - разрешает использовать preventDefault()
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isEnabled]);
};
