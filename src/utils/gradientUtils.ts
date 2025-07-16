/**
 * @module src/utils/gradientUtils.ts
 * @description Набор утилит для создания и манипуляции CSS-градиентами различных типов. Предоставляет функции для создания линейных, радиальных и конических градиентов с настраиваемыми параметрами (цвета, позиции, прозрачность). Также включает готовые градиенты для светлой и темной тем.
 * @author Kort
 * @version 1.0.0
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/gradient - Документация по CSS-градиентам
 * @usage
 * 1. `src/components/ui/Button.tsx`: Для создания градиентного фона кнопок.
 * 2. `src/components/layout/Header.tsx`: Для создания градиентного фона хедера.
 * 3. `src/components/sections/Hero.tsx`: Для создания градиентного фона главной секции.
 * 4. `src/components/ui/Card.tsx`: Для создания градиентных границ карточек.
 * 5. `src/components/effects/GradientBackground.tsx`: Для создания анимированных градиентных фонов.
 * @example
 * // Создание линейного градиента
 * const linearGradient = createLinearGradient(
 *   135, // угол в градусах
 *   ['#3b82f6', '#8b5cf6'], // цвета
 *   [0, 1] // позиции (0-1)
 * );
 * 
 * // Создание радиального градиента
 * const radialGradient = createRadialGradient(
 *   'circle',
 *   'center',
 *   ['rgba(59, 130, 246, 0.8)', 'rgba(59, 130, 246, 0)'],
 *   [0, 1]
 * );
 * 
 * // Создание градиента с прозрачностью
 * const transparentGradient = createGradientWithAlpha(
 *   'linear',
 *   ['#3b82f6', '#8b5cf6'],
 *   [0.8, 0.4], // значения прозрачности
 *   { angle: 45 }
 * );
 */

import { hexToRgba } from './colorUtils';

/**
 * Функция для создания линейного градиента
 * @param angle Угол градиента в градусах
 * @param colors Массив цветов
 * @param positions Массив позиций цветов (0-1)
 * @returns CSS-строка с линейным градиентом
 */
export const createLinearGradient = (
  angle: number,
  colors: string[],
  positions?: number[]
): string => {
  if (colors.length < 2) {
    throw new Error('Gradient must have at least 2 colors');
  }

  const colorStops = colors.map((color, index) => {
    if (positions && positions[index] !== undefined) {
      return `${color} ${positions[index] * 100}%`;
    }
    return color;
  });

  return `linear-gradient(${angle}deg, ${colorStops.join(', ')})`;
};

/**
 * Функция для создания радиального градиента
 * @param shape Форма градиента ('circle' или 'ellipse')
 * @param position Позиция центра градиента (например, 'center', 'top left')
 * @param colors Массив цветов
 * @param positions Массив позиций цветов (0-1)
 * @returns CSS-строка с радиальным градиентом
 */
export const createRadialGradient = (
  shape: 'circle' | 'ellipse',
  position: string,
  colors: string[],
  positions?: number[]
): string => {
  if (colors.length < 2) {
    throw new Error('Gradient must have at least 2 colors');
  }

  const colorStops = colors.map((color, index) => {
    if (positions && positions[index] !== undefined) {
      return `${color} ${positions[index] * 100}%`;
    }
    return color;
  });

  return `radial-gradient(${shape} at ${position}, ${colorStops.join(', ')})`;
};

/**
 * Функция для создания конического градиента
 * @param angle Начальный угол градиента в градусах
 * @param position Позиция центра градиента (например, 'center', 'top left')
 * @param colors Массив цветов
 * @param positions Массив позиций цветов (0-1)
 * @returns CSS-строка с коническим градиентом
 */
export const createConicGradient = (
  angle: number,
  position: string,
  colors: string[],
  positions?: number[]
): string => {
  if (colors.length < 2) {
    throw new Error('Gradient must have at least 2 colors');
  }

  const colorStops = colors.map((color, index) => {
    if (positions && positions[index] !== undefined) {
      return `${color} ${positions[index] * 360}deg`;
    }
    return color;
  });

  return `conic-gradient(from ${angle}deg at ${position}, ${colorStops.join(', ')})`;
};

/**
 * Функция для создания градиента с прозрачностью
 * @param type Тип градиента ('linear', 'radial', 'conic')
 * @param colors Массив цветов
 * @param alphas Массив значений прозрачности (0-1)
 * @param options Дополнительные параметры градиента
 * @returns CSS-строка с градиентом
 */
export const createGradientWithAlpha = (
  type: 'linear' | 'radial' | 'conic',
  colors: string[],
  alphas: number[],
  options: {
    angle?: number;
    shape?: 'circle' | 'ellipse';
    position?: string;
    positions?: number[];
  } = {}
): string => {
  const colorsWithAlpha = colors.map((color, index) => {
    return hexToRgba(color, alphas[index] || 1);
  });

  const {
    angle = 135,
    shape = 'circle',
    position = 'center',
    positions,
  } = options;

  switch (type) {
    case 'linear':
      return createLinearGradient(angle, colorsWithAlpha, positions);
    case 'radial':
      return createRadialGradient(shape, position, colorsWithAlpha, positions);
    case 'conic':
      return createConicGradient(angle, position, colorsWithAlpha, positions);
    default:
      throw new Error(`Unknown gradient type: ${type}`);
  }
};

/**
 * Функция для создания градиента для темной темы
 * @returns CSS-строка с градиентом для темной темы
 */
export const createDarkThemeGradient = (): string => {
  return `
    radial-gradient(circle at 20% 30%, rgba(0,255,255,0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255,0,255,0.08) 0%, transparent 50%),
    linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(30,41,59,0.75) 100%)
  `;
};

/**
 * Функция для создания градиента для светлой темы
 * @returns CSS-строка с градиентом для светлой темы
 */
export const createLightThemeGradient = (): string => {
  return `
    radial-gradient(circle at 25% 25%, rgba(59,130,246,0.08) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(168,85,247,0.06) 0%, transparent 50%),
    linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)
  `;
};