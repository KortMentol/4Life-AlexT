/**
 * @module src/utils/scrollStabilizer.ts
 * @description Утилиты для устранения микро-рывков при скролле на desktop устройствах
 * @author Kort
 * @version 1.0.0
 */

/**
 * Применяет CSS классы для стабилизации скролла к элементу
 * @param element - DOM элемент для стабилизации
 * @param type - Тип стабилизации ('scroll' | 'transform')
 */
export const applyScrollStabilization = (
  element: HTMLElement | null,
  type: 'scroll' | 'transform' = 'scroll'
) => {
  if (!element) return;
  
  // Проверяем, что это desktop устройство
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isDesktop) return;
  
  const className = type === 'scroll' ? 'scroll-stabilizer' : 'transform-stabilizer';
  element.classList.add(className, 'gpu-smooth-scroll');
};

/**
 * Удаляет классы стабилизации скролла
 * @param element - DOM элемент
 */
export const removeScrollStabilization = (element: HTMLElement | null) => {
  if (!element) return;
  
  element.classList.remove('scroll-stabilizer', 'transform-stabilizer', 'gpu-smooth-scroll');
};

/**
 * Хук для автоматического применения стабилизации скролла
 * @param ref - React ref элемента
 * @param type - Тип стабилизации
 */
export const useScrollStabilization = (
  ref: React.RefObject<HTMLElement>,
  type: 'scroll' | 'transform' = 'scroll'
) => {
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    applyScrollStabilization(element, type);
    
    return () => {
      removeScrollStabilization(element);
    };
  }, [ref, type]);
};

// Для совместимости с React
import React from 'react';