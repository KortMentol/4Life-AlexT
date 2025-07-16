/**
 * @module src/utils/deviceUtils.ts
 * @description Набор утилит для определения типа устройства, его возможностей и поддерживаемых функций. Позволяет адаптировать пользовательский интерфейс и функциональность в зависимости от устройства пользователя (мобильное, планшет, десктоп), поддержки тач-событий, hover-эффектов и других особенностей. Все функции безопасны для использования в SSR (Server-Side Rendering).
 * @author Kort
 * @version 1.0.0
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgent - Документация по Navigator.userAgent
 * @usage
 * 1. `src/components/layout/Header.tsx`: Для определения типа устройства и адаптации навигации.
 * 2. `src/components/ui/Button.tsx`: Для изменения стилей и поведения кнопок на тач-устройствах.
 * 3. `src/hooks/useScrollBehavior.ts`: Для выбора оптимального способа скролла в зависимости от устройства.
 * 4. `src/components/effects/HoverEffect.tsx`: Для отключения hover-эффектов на устройствах без поддержки hover.
 * 5. `src/utils/imageUtils.ts`: Для выбора оптимального формата изображений в зависимости от поддержки WebP.
 * @example
 * // Определение типа устройства
 * if (isMobileDevice()) {
 *   // Код для мобильных устройств
 * } else if (isTabletDevice()) {
 *   // Код для планшетов
 * } else {
 *   // Код для десктопов
 * }
 * 
 * // Проверка поддержки функций
 * if (isTouchDevice()) {
 *   // Добавляем обработчики тач-событий
 * }
 * 
 * if (supportsHover()) {
 *   // Добавляем hover-эффекты
 * }
 * 
 * // Асинхронная проверка поддержки WebP
 * const useWebP = await supportsWebP();
 * const imagePath = useWebP ? 'image.webp' : 'image.jpg';
 */

/**
 * Проверяет, является ли устройство мобильным телефоном
 * Использует User-Agent для определения типа устройства
 * @returns true, если устройство мобильное, иначе false
 */
export const isMobileDevice = (): boolean => {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

/**
 * Проверяет, является ли устройство планшетом
 * Использует User-Agent и размер экрана для определения типа устройства
 * @returns true, если устройство планшет, иначе false
 */
export const isTabletDevice = (): boolean => {
  if (typeof navigator === "undefined") return false;
  return /(iPad|tablet|Tablet|Android(?!.*Mobile))/i.test(navigator.userAgent);
};

/**
 * Проверяет, является ли устройство десктопом
 * Определяется как устройство, которое не является ни мобильным, ни планшетом
 * @returns true, если устройство десктоп, иначе false
 */
export const isDesktopDevice = (): boolean => {
  return !isMobileDevice() && !isTabletDevice();
};

/**
 * Проверяет, поддерживает ли устройство тач-события
 * Проверяет наличие события 'ontouchstart' или свойства navigator.maxTouchPoints
 * @returns true, если устройство поддерживает тач-события, иначе false
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

/**
 * Проверяет, поддерживает ли устройство hover-эффекты
 * Использует CSS Media Query для определения поддержки hover
 * @returns true, если устройство поддерживает hover, иначе false
 */
export const supportsHover = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover)").matches;
};

/**
 * Возвращает тип устройства в виде строки
 * Удобно для использования в условных выражениях и классах CSS
 * @returns "mobile", "tablet" или "desktop"
 */
export const getDeviceType = (): "mobile" | "tablet" | "desktop" => {
  if (isMobileDevice()) return "mobile";
  if (isTabletDevice()) return "tablet";
  return "desktop";
};

/**
 * Проверяет поддержку определенной CSS-функции в браузере
 * Использует CSS.supports API для проверки поддержки
 * @param feature CSS-свойство или функция для проверки (например, "display: grid")
 * @returns true, если браузер поддерживает указанную функцию, иначе false
 */
export const supportsFeature = (feature: string): boolean => {
  if (typeof window === "undefined") return false;
  return CSS.supports(feature);
};

/**
 * Асинхронно проверяет поддержку формата изображений WebP
 * Создает тестовое изображение WebP и проверяет, может ли браузер его отобразить
 * @returns Promise, который разрешается в true, если устройство поддерживает WebP, иначе false
 */
export const supportsWebP = async (): Promise<boolean> => {
  if (typeof window === "undefined") return false;
  
  // Быстрая проверка для современных браузеров
  if ("createImageBitmap" in window && "avif" in window.document.createElement("img")) {
    return true;
  }
  
  // Проверка для старых браузеров путем загрузки тестового изображения WebP
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image.width > 0 && image.height > 0);
    image.onerror = () => resolve(false);
    image.src = "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=";
  });
};

/**
 * Проверяет поддержку плавного скролла в браузере
 * Проверяет наличие свойства scrollBehavior в стилях документа
 * @returns true, если браузер поддерживает плавный скролл, иначе false
 */
export const supportsSmoothScroll = (): boolean => {
  if (typeof window === "undefined") return false;
  return "scrollBehavior" in document.documentElement.style;
};