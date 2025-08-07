/**
 * @module src/hooks/useGlassmorphism.ts
 * @description Хук для создания современного эффекта гласморфизма (стеклянного морфизма) с настраиваемыми параметрами. Генерирует оптимизированные CSS-стили для создания полупрозрачного эффекта матового стекла с размытием, насыщенностью, яркостью и градиентами. Автоматически адаптируется к текущей теме (светлой/темной) и поддерживает различные уровни интенсивности эффекта.
 * @author Kort
 * @version 1.0.0
 * @see https://uxdesign.cc/glassmorphism-in-user-interfaces-1f39bb1308c9 - О тренде гласморфизма в UI
 * @usage
 * 1. `src/components/layout/Header.tsx`: Для создания эффекта гласморфизма в хедере при скролле.
 * 2. `src/components/layout/MobileMenu.tsx`: Для создания эффекта гласморфизма в мобильном меню и его оверлее.
 * 3. `src/components/ui/Card.tsx`: Для создания карточек с эффектом стекла.
 * 4. `src/components/modals/Modal.tsx`: Для создания модальных окон с эффектом гласморфизма.
 * 5. `src/components/sections/Hero.tsx`: Для создания полупрозрачных элементов в героической секции.
 * @example
 * // Базовое использование
 * const { style } = useGlassmorphism();
 *
 * // Использование с настройками
 * const { style } = useGlassmorphism({
 *   blur: 16,
 *   saturation: 180,
 *   brightness: 1.1,
 *   opacity: 0.8,
 *   intensity: 'strong'
 * });
 *
 * // Применение стилей к компоненту
 * <div style={style} className="rounded-xl p-6">
 *   Контент с эффектом гласморфизма
 * </div>
 */
import { useMemo } from "react";
import { useTheme } from "./useTheme";
import { useThemeColors } from "./useThemeColors";

/**
 * Параметры для настройки эффекта гласморфизма
 * @interface GlassmorphismOptions
 */
interface GlassmorphismOptions {
  /** Степень размытия фона в пикселях (по умолчанию: 12) */
  blur?: number;
  /** Насыщенность в процентах (по умолчанию: 180) */
  saturation?: number;
  /** Яркость (по умолчанию: 0.9 для темной темы, 1.05 для светлой) */
  brightness?: number;
  /** Непрозрачность фона (по умолчанию: 0.85 для темной темы, 0.9 для светлой) */
  opacity?: number;
  /** Добавлять ли нижнюю границу (по умолчанию: true) */
  border?: boolean;
  /** Добавлять ли тень (по умолчанию: true) */
  shadow?: boolean;
  /** Интенсивность эффекта (по умолчанию: 'medium') */
  intensity?: "light" | "medium" | "strong";
}

/**
 * Результат работы хука useGlassmorphism
 * @interface GlassmorphismReturn
 */
interface GlassmorphismReturn {
  /** CSS-стили для применения эффекта гласморфизма */
  style: React.CSSProperties;
  /** CSS-класс для дополнительной стилизации */
  className: string;
}

/**
 * Хук для создания эффекта гласморфизма с настраиваемыми параметрами
 * @param options - Объект с настройками эффекта
 * @returns Объект со стилями и CSS-классом для применения эффекта
 */
export const useGlassmorphism = (options: GlassmorphismOptions = {}): GlassmorphismReturn => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { primaryColor, secondaryColor, borderColor, shadow } = useThemeColors();

  // Применяем значения по умолчанию к опциям
  const {
    blur = isDark ? 30 : 30,
    saturation = 120, // Уменьшаем насыщенность
    brightness = isDark ? 0.95 : 1.2, // Увеличиваем яркость для светлой темы
    opacity = isDark ? 0.95 : 1, // Полная непрозрачность для светлой темы
    border = true,
    shadow: showShadow = true,
    intensity = "medium",
  } = options;

  /**
   * Определяет значения параметров в зависимости от выбранной интенсивности
   * @returns Объект с рассчитанными значениями для эффекта
   */
  const getIntensityValues = () => {
    switch (intensity) {
      case "light":
        return {
          blurValue: blur * 0.7,
          saturationValue: saturation * 0.7,
          brightnessValue: isDark ? brightness * 1.1 : brightness * 0.95,
          opacityValue: opacity * 0.7,
        };
      case "strong":
        return {
          blurValue: blur * 1.3,
          saturationValue: saturation * 1.3,
          brightnessValue: isDark ? brightness * 0.9 : brightness * 1.1,
          opacityValue: opacity * 1.3,
        };
      case "medium":
      default:
        return {
          blurValue: blur,
          saturationValue: saturation,
          brightnessValue: brightness,
          opacityValue: opacity,
        };
    }
  };

  // Получаем значения в зависимости от интенсивности
  const { blurValue, saturationValue, brightnessValue, opacityValue } = getIntensityValues();

  // Мемоизируем результат для предотвращения лишних перерендеров
  return useMemo(() => {
    // Создаем стили для эффекта гласморфизма
    const style: React.CSSProperties = {
      backdropFilter: isDark
        ? `blur(${blurValue}px) saturate(${saturationValue}%) brightness(${brightnessValue})`
        : "none",
      WebkitBackdropFilter: isDark
        ? `blur(${blurValue}px) saturate(${saturationValue}%) brightness(${brightnessValue})`
        : "none",
      background: isDark
        ? `linear-gradient(135deg, rgba(15, 23, 42, 1) 0%, rgba(30, 41, 59, 1) 100%)`
        : `linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)`,
    };

    // Всегда добавляем границы для лучшей видимости хедера
    style.borderTop = isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(59, 130, 246, 0.15)";
    style.borderBottom = isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(59, 130, 246, 0.15)";

    // Всегда добавляем улучшенную тень для лучшей видимости хедера
    style.boxShadow = isDark
      ? "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 10px rgba(0, 255, 255, 0.1)"
      : "0 4px 12px rgba(0, 0, 0, 0.05)";

    return {
      style,
      className: "glassmorphism",
    };
  }, [
    isDark,
    blurValue,
    saturationValue,
    brightnessValue,
    opacityValue,
    border,
    showShadow,
    primaryColor,
    secondaryColor,
    borderColor,
    shadow,
  ]);
};
