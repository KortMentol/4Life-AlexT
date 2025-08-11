/**
 * @module src/utils/deviceUtils.ts
 * @description
 * Набор утилит для определения возможностей устройства и браузера.
 * Этот модуль отвечает на вопросы "Что умеет это устройство?", а не "Какого размера у него экран?".
 * Для логики, зависящей от размеров экрана, следует использовать хук `useMediaQuery`.
 * @author Kort
 * @version 2.0.0
 */

/**
 * Проверяет, поддерживает ли устройство сенсорный ввод (тач-события).
 * Это более надежно, чем проверка User-Agent, так как учитывает гибридные устройства (ноутбуки с тачскрином).
 * @returns {boolean} `true`, если устройство поддерживает сенсорный ввод.
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

/**
 * Проверяет, поддерживает ли устройство hover-эффекты (наведение курсора).
 * Полезно для отключения hover-анимаций на мобильных устройствах, чтобы избежать "залипания" состояний.
 * @returns {boolean} `true`, если устройство поддерживает hover.
 */
export const supportsHover = (): boolean => {
  if (typeof window === "undefined") return false;
  // `matchMedia` - самый надежный способ проверить это.
  return window.matchMedia("(hover: hover)").matches;
};

/**
 * Асинхронно проверяет, поддерживает ли браузер формат изображений WebP.
 * Это позволяет оптимизировать загрузку, отдавая современные форматы изображений.
 * @returns {Promise<boolean>} Promise, который разрешается в `true`, если WebP поддерживается.
 */
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image.width > 0 && image.height > 0);
    image.onerror = () => resolve(false);
    image.src =
      "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=";
  });
};

/**
 * Проверяет, поддерживает ли браузер нативный плавный скролл через CSS.
 * @returns {boolean} `true`, если `scroll-behavior: smooth` поддерживается.
 */
export const supportsSmoothScroll = (): boolean => {
  if (typeof window === "undefined") return false;
  return "scrollBehavior" in document.documentElement.style;
};
