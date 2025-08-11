/**
 * @module src/hooks/useThemeColors.ts
 * @description Хук для получения и управления цветовой палитрой в зависимости от текущей темы (светлой или темной). Предоставляет набор основных цветов, вспомогательных оттенков, градиентов и теней, а также утилитарные функции для работы с прозрачностью. Все цвета автоматически адаптируются при переключении темы, обеспечивая согласованный визуальный стиль во всем приложении.
 * @author Kort
 * @version 1.0.0
 * @see useTheme - Хук для управления текущей темой
 * @see colorUtils - Утилиты для работы с цветами
 * @usage
 * 1. `src/components/layout/Header.tsx`: Для получения цветов темы для хедера и его элементов.
 * 2. `src/components/ui/Button.tsx`: Для стилизации кнопок в соответствии с текущей темой.
 * 3. `src/components/ui/Card.tsx`: Для определения цветов фона, текста и границ карточек.
 * 4. `src/hooks/useGlassmorphism.ts`: Для создания эффекта гласморфизма с учетом текущей темы.
 * 5. `src/components/effects/GradientBackground.tsx`: Для создания градиентных фонов.
 * @example
 * // Базовое использование
 * const { primaryColor, textColor, backgroundColor } = useThemeColors();
 *
 * // Использование с прозрачностью
 * const { getPrimaryWithAlpha } = useThemeColors();
 * const buttonHoverBg = getPrimaryWithAlpha(0.2);
 *
 * // Применение в компоненте
 * <div
 *   style={{
 *     color: textColor,
 *     backgroundColor,
 *     borderColor: getPrimaryWithAlpha(0.3),
 *     boxShadow: shadow
 *   }}
 * >
 *   Контент с цветами текущей темы
 * </div>
 */
import { useMemo } from "react";
import { hexToRgba } from "../utils/colorUtils";
import { useTheme } from "./useTheme";

/**
 * Интерфейс цветовой палитры темы
 * @interface ThemeColors
 */
interface ThemeColors {
  /** Основной цвет (синий для светлой темы, голубой для темной) */
  primaryColor: string;
  /** Вторичный цвет (фиолетовый для светлой темы, розовый для темной) */
  secondaryColor: string;
  /** Акцентный цвет (зеленый для светлой темы, мятный для темной) */
  accentColor: string;
  /** Основной цвет текста */
  textColor: string;
  /** Приглушенный цвет текста для второстепенной информации */
  textMutedColor: string;
  /** Основной цвет фона */
  backgroundColor: string;
  /** Приглушенный цвет фона для карточек, панелей и т.д. */
  backgroundMutedColor: string;
  /** Цвет границ элементов */
  borderColor: string;
  /** CSS-значение для эффекта свечения */
  glowColor: string;
  /** CSS-значение для градиентного фона */
  gradient: string;
  /** CSS-значение для тени элементов */
  shadow: string;
  /** CSS-значение для тени текста в хедере */
  headerTextShadow: string;

  /** Функция для получения основного цвета с указанной прозрачностью */
  getPrimaryWithAlpha: (alpha: number) => string;
  /** Функция для получения вторичного цвета с указанной прозрачностью */
  getSecondaryWithAlpha: (alpha: number) => string;
  /** Функция для получения цвета текста с указанной прозрачностью */
  getTextWithAlpha: (alpha: number) => string;
  /** Функция для получения цвета фона с указанной прозрачностью */
  getBackgroundWithAlpha: (alpha: number) => string;
}

/**
 * Хук для получения цветовой палитры в зависимости от текущей темы
 * @returns Объект с цветами и функциями для работы с ними
 */
export const useThemeColors = (): ThemeColors => {
  // Получаем текущую тему из контекста
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Мемоизируем результат для предотвращения лишних перерендеров
  return useMemo(() => {
    // Определяем цвета в зависимости от темы
    const primaryColor = isDark ? "#00ffff" : "#3b82f6"; // Голубой / Синий
    const secondaryColor = isDark ? "#ff00ff" : "#a855f7"; // Розовый / Фиолетовый
    const accentColor = isDark ? "#00ff7f" : "#22c55e"; // Мятный / Зеленый
    const textColor = isDark ? "#f8fafc" : "#1e293b"; // Светлый / Темный
    const textMutedColor = isDark ? "#94a3b8" : "#64748b"; // Серый светлый / Серый темный
    const backgroundColor = isDark ? "#0f172a" : "#ffffff"; // Темно-синий / Белый
    const backgroundMutedColor = isDark ? "#1e293b" : "#f1f5f9"; // Синий / Светло-серый

    // Составные стили
    const borderColor = isDark
      ? "rgba(0, 255, 255, 0.2)"
      : "rgba(59, 130, 246, 0.2)";
    const glowColor = isDark
      ? "0 0 20px rgba(0, 255, 255, 0.4)"
      : "0 0 20px rgba(59, 130, 246, 0.4)";
    const gradient = isDark
      ? "linear-gradient(135deg, rgba(0, 255, 255, 0.2) 0%, rgba(255, 0, 255, 0.2) 100%)"
      : "linear-gradient(135deg, rgba(59, 130, 246, 0.5) 0%, rgba(168, 85, 247, 0.5) 100%)";
    const shadow = isDark
      ? "0 4px 12px rgba(0, 0, 0, 0.2)"
      : "0 4px 12px rgba(59, 130, 246, 0.15)";

    // Новые переменные для тени текста в хедере
    const headerTextShadow = "0px 1px 3px rgba(0, 0, 0, 0.4)";

    // Функции для работы с прозрачностью цветов
    const getPrimaryWithAlpha = (alpha: number) =>
      hexToRgba(primaryColor, alpha);
    const getSecondaryWithAlpha = (alpha: number) =>
      hexToRgba(secondaryColor, alpha);
    const getTextWithAlpha = (alpha: number) => hexToRgba(textColor, alpha);
    const getBackgroundWithAlpha = (alpha: number) =>
      hexToRgba(backgroundColor, alpha);

    return {
      primaryColor,
      secondaryColor,
      accentColor,
      textColor,
      textMutedColor,
      backgroundColor,
      backgroundMutedColor,
      borderColor,
      glowColor,
      gradient,
      shadow,
      headerTextShadow, // Добавили новую переменную

      getPrimaryWithAlpha,
      getSecondaryWithAlpha,
      getTextWithAlpha,
      getBackgroundWithAlpha,
    };
  }, [isDark]);
};
