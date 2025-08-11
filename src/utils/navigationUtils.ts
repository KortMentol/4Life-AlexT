// src/utils/navigationUtils.ts (ВЕРСИЯ, СОВМЕСТИМАЯ С УМНЫМ HANDLER'ОМ)

import { scrollTo as lenisScrollTo } from "@/lib/lenis";
import { NavigateFunction } from "react-router-dom";

/**
 * Функция для плавного/мгновенного скролла к заданной Y-позиции.
 * @param options Опции для скролла. y - позиция (по умолчанию 0).
 */
export const scrollToTop = (
  options: { duration?: number; immediate?: boolean; y?: number } = {},
): void => {
  const { duration = 1.5, immediate = false, y = 0 } = options;
  lenisScrollTo(y, { immediate, duration });
};

/**
 * Упрощенная функция для обработки клика по ссылке.
 * Она не управляет скроллом при навигации, доверяя это RouteChangeHandler.
 */
export const handleLinkClick = (
  e: React.MouseEvent,
  navigate: NavigateFunction,
  path: string,
  currentPath: string,
  options: { immediate?: boolean } = {},
): void => {
  e.preventDefault();

  if (currentPath === path) {
    // Если мы уже на нужной странице, просто скроллим вверх.
    scrollToTop({ immediate: options.immediate });
  } else {
    // Если переходим на новую страницу, просто вызываем navigate.
    // RouteChangeHandler сам позаботится о скролле наверх.
    navigate(path);
  }
};
