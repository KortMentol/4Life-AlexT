/**
 * @module src/utils/effectUtils.ts
 * @description Набор утилит для создания современных визуальных эффектов в пользовательском интерфейсе. Предоставляет функции для создания эффектов гласморфизма (размытое стекло), неоморфизма (объемные элементы) и свечения. Все эффекты адаптируются к текущей теме приложения (светлая/темная) и поддерживают различные настройки интенсивности.
 * @author Kort
 * @version 1.0.0
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter - Документация по CSS backdrop-filter
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow - Документация по CSS box-shadow
 * @usage
 * 1. `src/components/ui/Card.tsx`: Для создания эффекта стеклянных карточек.
 * 2. `src/components/layout/Header.tsx`: Для создания прозрачного хедера с эффектом размытия.
 * 3. `src/components/ui/Button.tsx`: Для добавления эффекта свечения к кнопкам.
 * 4. `src/components/sections/Features.tsx`: Для создания объемных карточек с эффектом неоморфизма.
 * 5. `src/components/ui/Modal.tsx`: Для создания стеклянного фона модального окна.
 * @example
 * // Создание эффекта гласморфизма
 * const glassStyle = createGlassmorphismEffect(theme, { 
 *   blur: 10, 
 *   opacity: 0.8, 
 *   intensity: 'medium' 
 * });
 * 
 * // Создание эффекта неоморфизма
 * const neoStyle = createNeomorphismEffect(theme, { 
 *   intensity: 'strong', 
 *   type: 'convex' 
 * });
 * 
 * // Создание эффекта свечения
 * const glowStyle = createGlowEffect(theme, { 
 *   color: '59, 130, 246', 
 *   intensity: 'medium', 
 *   pulsating: true 
 * });
 */

import { Theme } from "../context/ThemeContext.types";

/**
 * Функция для создания эффекта гласморфизма
 * @param theme Текущая тема
 * @param options Опции для эффекта
 * @returns CSS-стили для эффекта гласморфизма
 */
export const createGlassmorphismEffect = (
  theme: Theme,
  options: {
    blur?: number;
    saturation?: number;
    brightness?: number;
    opacity?: number;
    intensity?: 'light' | 'medium' | 'strong';
  } = {}
): React.CSSProperties => {
  const isDark = theme === 'dark';
  
  const {
    blur = 12,
    saturation = 180,
    brightness = isDark ? 0.9 : 1.05,
    opacity = isDark ? 0.85 : 0.9,
    intensity = 'medium'
  } = options;
  
  // Определяем интенсивность эффекта
  const getIntensityValues = () => {
    switch (intensity) {
      case 'light':
        return {
          blurValue: blur * 0.7,
          saturationValue: saturation * 0.7,
          brightnessValue: isDark ? brightness * 1.1 : brightness * 0.95,
          opacityValue: opacity * 0.7
        };
      case 'strong':
        return {
          blurValue: blur * 1.3,
          saturationValue: saturation * 1.3,
          brightnessValue: isDark ? brightness * 0.9 : brightness * 1.1,
          opacityValue: opacity * 1.3
        };
      case 'medium':
      default:
        return {
          blurValue: blur,
          saturationValue: saturation,
          brightnessValue: brightness,
          opacityValue: opacity
        };
    }
  };
  
  const { blurValue, saturationValue, brightnessValue, opacityValue } = getIntensityValues();
  
  return {
    backdropFilter: `blur(${blurValue}px) saturate(${saturationValue}%) brightness(${brightnessValue})`,
    WebkitBackdropFilter: `blur(${blurValue}px) saturate(${saturationValue}%) brightness(${brightnessValue})`,
    background: isDark
      ? `radial-gradient(circle at 20% 30%, rgba(0,255,255,${opacityValue * 0.08}) 0%, transparent 50%), 
         radial-gradient(circle at 80% 70%, rgba(255,0,255,${opacityValue * 0.08}) 0%, transparent 50%), 
         linear-gradient(135deg, rgba(15,23,42,${opacityValue}) 0%, rgba(30,41,59,${opacityValue * 0.9}) 100%)`
      : `radial-gradient(circle at 25% 25%, rgba(59,130,246,${opacityValue * 0.08}) 0%, transparent 50%), 
         radial-gradient(circle at 75% 75%, rgba(168,85,247,${opacityValue * 0.06}) 0%, transparent 50%), 
         linear-gradient(135deg, rgba(255,255,255,${opacityValue}) 0%, rgba(248,250,252,${opacityValue * 0.9}) 100%)`,
    borderBottom: isDark
      ? `1px solid rgba(255,255,255,0.1)`
      : `1px solid rgba(255,255,255,0.3)`,
    boxShadow: isDark
      ? `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)`
      : `0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)`,
  };
};

/**
 * Функция для создания эффекта неоморфизма
 * @param theme Текущая тема
 * @param options Опции для эффекта
 * @returns CSS-стили для эффекта неоморфизма
 */
export const createNeomorphismEffect = (
  theme: Theme,
  options: {
    intensity?: 'light' | 'medium' | 'strong';
    type?: 'flat' | 'pressed' | 'convex';
  } = {}
): React.CSSProperties => {
  const isDark = theme === 'dark';
  
  const {
    intensity = 'medium',
    type = 'flat'
  } = options;
  
  // Определяем интенсивность эффекта
  const getIntensityValues = () => {
    switch (intensity) {
      case 'light':
        return {
          distance: 3,
          blur: 6,
          opacity: isDark ? 0.3 : 0.1
        };
      case 'strong':
        return {
          distance: 10,
          blur: 20,
          opacity: isDark ? 0.5 : 0.2
        };
      case 'medium':
      default:
        return {
          distance: 5,
          blur: 10,
          opacity: isDark ? 0.4 : 0.15
        };
    }
  };
  
  const { distance, blur, opacity } = getIntensityValues();
  
  // Определяем тип эффекта
  const getTypeValues = () => {
    switch (type) {
      case 'pressed':
        return {
          inset: 'inset ',
          bgColor: isDark ? 'rgba(15,23,42,1)' : 'rgba(255,255,255,1)'
        };
      case 'convex':
        return {
          inset: '',
          bgColor: isDark 
            ? 'linear-gradient(145deg, rgba(30,41,59,1), rgba(15,23,42,1))' 
            : 'linear-gradient(145deg, rgba(255,255,255,1), rgba(241,245,249,1))'
        };
      case 'flat':
      default:
        return {
          inset: '',
          bgColor: isDark ? 'rgba(15,23,42,1)' : 'rgba(255,255,255,1)'
        };
    }
  };
  
  const { inset, bgColor } = getTypeValues();
  
  return {
    background: bgColor,
    borderRadius: '10px',
    boxShadow: isDark
      ? `${inset}${distance}px ${distance}px ${blur}px rgba(0,0,0,${opacity}), 
         ${inset}-${distance}px -${distance}px ${blur}px rgba(255,255,255,${opacity * 0.1})`
      : `${inset}${distance}px ${distance}px ${blur}px rgba(0,0,0,${opacity}), 
         ${inset}-${distance}px -${distance}px ${blur}px rgba(255,255,255,${opacity * 2})`,
  };
};

/**
 * Функция для создания эффекта свечения
 * @param theme Текущая тема
 * @param options Опции для эффекта
 * @returns CSS-стили для эффекта свечения
 */
export const createGlowEffect = (
  theme: Theme,
  options: {
    color?: string;
    intensity?: 'light' | 'medium' | 'strong';
    pulsating?: boolean;
  } = {}
): React.CSSProperties => {
  const isDark = theme === 'dark';
  
  const {
    color = isDark ? '0, 255, 255' : '59, 130, 246',
    intensity = 'medium',
    pulsating = false
  } = options;
  
  // Определяем интенсивность эффекта
  const getIntensityValues = () => {
    switch (intensity) {
      case 'light':
        return {
          opacity: isDark ? 0.3 : 0.2,
          blur: 15
        };
      case 'strong':
        return {
          opacity: isDark ? 0.6 : 0.4,
          blur: 30
        };
      case 'medium':
      default:
        return {
          opacity: isDark ? 0.4 : 0.3,
          blur: 20
        };
    }
  };
  
  const { opacity, blur } = getIntensityValues();
  
  const baseStyle: React.CSSProperties = {
    boxShadow: `0 0 ${blur}px rgba(${color}, ${opacity})`,
    position: 'relative',
  };
  
  // Добавляем анимацию пульсации, если нужно
  if (pulsating) {
    return {
      ...baseStyle,
      animation: 'glow-pulse 2s infinite alternate',
    };
  }
  
  return baseStyle;
};