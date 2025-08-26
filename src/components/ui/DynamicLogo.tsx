import React from "react";
import { useTheme } from "@/hooks";

interface DynamicLogoProps {
  alt?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * Принудительная тема для подбора варианта логотипа.
   * "dark" отдаёт белый логотип, "light" — синий брендовый.
   * Если не задано, используется текущая тема приложения.
   */
  themeOverride?: "light" | "dark";
}

/**
 * @module components/ui/DynamicLogo
 * @description Компонент для отображения логотипа, который автоматически адаптируется к текущей теме (светлой или темной).
 * Он загружает соответствующий SVG-файл логотипа (светлый для темной темы, темный для светлой) и позволяет настраивать размер.
 *
 * @author Kort
 * @version 1.0.0
 *
 * @param {string} [alt='4Life Logo'] - Альтернативный текст для тега `<img>`.
 * @param {string} [className] - Дополнительные CSS-классы для стилизации.
 * @param {'sm' | 'md' | 'lg' | 'xl'} [size='md'] - Предустановленный размер логотипа.
 * @param {'light' | 'dark'} [themeOverride] - Принудительная тема для выбора варианта логотипа.
 *
 * @see useTheme - Хук для получения текущей темы приложения.
 *
 * @usage
 * Используется как основной элемент брендинга в ключевых частях интерфейса.
 *
 * 1. **В шапке сайта (`src/components/layout/Header.tsx`):**
 *    - Для отображения логотипа в навигационной панели.
 * 2. **В подвале сайта (`src/components/layout/Footer.tsx`):**
 *    - Для брендирования нижней части страницы.
 *
 * @example
 * // Использование логотипа среднего размера
 * <DynamicLogo size="md" />
 *
 * // Использование большого логотипа с дополнительным классом
 * <DynamicLogo size="lg" className="mx-auto" />
 */
const DynamicLogo: React.FC<DynamicLogoProps> = ({
  alt = "4Life Logo",
  className = "",
  size = "md",
  themeOverride,
}) => {
  const { theme } = useTheme();

  // Определяем размеры в зависимости от пропа size
  const sizeClasses = {
    sm: "h-6 w-auto",
    md: "h-9 w-auto",
    lg: "h-12 w-auto",
    xl: "h-16 w-auto",
  };

  // Выбираем логотип в зависимости от темы (c возможностью принудительного выбора)
  const effectiveTheme = themeOverride ?? theme;
  const logoSrc =
    effectiveTheme === "dark"
      ? "/src/assets/images/brand/4life-logo-light.svg" // Белый логотип
      : "/src/assets/images/brand/4life-logo.svg"; // Синий логотип

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={`${sizeClasses[size]} ${className} transition-opacity duration-300`}
      loading="lazy"
    />
  );
};

export default DynamicLogo;
