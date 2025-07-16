/**
 * @module src/utils/themeUtils.ts
 * @description Набор утилит для работы с темами оформления (светлая/темная). Предоставляет функции для получения цветов, классов, стилей, градиентов, теней и свечений в зависимости от текущей темы. Позволяет создавать адаптивные интерфейсы, которые корректно отображаются в обеих темах без дублирования кода.
 * @author Kort
 * @version 1.0.0
 * @see https://tailwindcss.com/docs/dark-mode - Документация по реализации темной темы в Tailwind CSS
 * @usage
 * 1. `src/components/ui/Button.tsx`: Для получения цветов кнопок в зависимости от темы.
 * 2. `src/components/layout/Header.tsx`: Для получения стилей хедера в зависимости от темы.
 * 3. `src/components/ui/Card.tsx`: Для получения теней и градиентов для карточек.
 * 4. `src/components/ui/ThemeToggle.tsx`: Для создания переключателя тем.
 * 5. `src/components/effects/GlowEffect.tsx`: Для получения свечения в зависимости от темы.
 * @example
 * // Получение цвета в зависимости от темы
 * const textColor = getThemeColor('#1f2937', '#f9fafb', theme);
 * 
 * // Получение класса в зависимости от темы
 * const bgClass = getThemeClass('bg-white', 'bg-gray-900', theme);
 * 
 * // Получение стиля в зависимости от темы
 * const buttonStyle = getThemeStyle(
 *   { backgroundColor: '#3b82f6', color: '#ffffff' },
 *   { backgroundColor: '#1e40af', color: '#f9fafb' },
 *   theme
 * );
 * 
 * // Получение градиента и тени в зависимости от темы
 * const gradient = getThemeGradient(theme);
 * const shadow = getThemeShadow(theme);
 */

import { Theme } from "../context/ThemeContext.types";

/**
 * Функция для получения цвета в зависимости от темы
 * @param lightColor Цвет для светлой темы
 * @param darkColor Цвет для темной темы
 * @param currentTheme Текущая тема
 * @returns Цвет в зависимости от темы
 */
export const getThemeColor = (lightColor: string, darkColor: string, currentTheme: Theme): string => {
  return currentTheme === "light" ? lightColor : darkColor;
};

/**
 * Функция для получения класса в зависимости от темы
 * @param lightClass Класс для светлой темы
 * @param darkClass Класс для темной темы
 * @param currentTheme Текущая тема
 * @returns Класс в зависимости от темы
 */
export const getThemeClass = (lightClass: string, darkClass: string, currentTheme: Theme): string => {
  return currentTheme === "light" ? lightClass : darkClass;
};

/**
 * Функция для получения стиля в зависимости от темы
 * @param lightStyle Стиль для светлой темы
 * @param darkStyle Стиль для темной темы
 * @param currentTheme Текущая тема
 * @returns Стиль в зависимости от темы
 */
export const getThemeStyle = <T>(lightStyle: T, darkStyle: T, currentTheme: Theme): T => {
  return currentTheme === "light" ? lightStyle : darkStyle;
};

/**
 * Функция для получения градиента в зависимости от темы
 * @param currentTheme Текущая тема
 * @returns Градиент в зависимости от темы
 */
export const getThemeGradient = (currentTheme: Theme): string => {
  return currentTheme === "light"
    ? "linear-gradient(135deg, rgba(59,130,246,0.5) 0%, rgba(168,85,247,0.5) 100%)"
    : "linear-gradient(135deg, rgba(0,255,255,0.2) 0%, rgba(255,0,255,0.2) 100%)";
};

/**
 * Функция для получения тени в зависимости от темы
 * @param currentTheme Текущая тема
 * @returns Тень в зависимости от темы
 */
export const getThemeShadow = (currentTheme: Theme): string => {
  return currentTheme === "light"
    ? "0 4px 12px rgba(59,130,246,0.15), inset 0 1px 0 rgba(255,255,255,0.7)"
    : "0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)";
};

/**
 * Функция для получения свечения в зависимости от темы
 * @param currentTheme Текущая тема
 * @returns Свечение в зависимости от темы
 */
export const getThemeGlow = (currentTheme: Theme): string => {
  return currentTheme === "light"
    ? "0 0 20px rgba(59,130,246,0.4)"
    : "0 0 20px rgba(0,255,255,0.4)";
};