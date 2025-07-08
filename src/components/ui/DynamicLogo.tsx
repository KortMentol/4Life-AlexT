import React from "react";
import { useTheme } from "../../hooks/useTheme";

interface DynamicLogoProps {
  alt?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
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
 * 3. **В мобильном меню (`src/components/layout/MobileMenu.tsx`):**
 *    - Для консистентности бренда на мобильных устройствах.
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
}) => {
  const { theme } = useTheme();

  // Определяем размеры в зависимости от пропа size
  const sizeClasses = {
    sm: "h-6 w-auto",
    md: "h-9 w-auto",
    lg: "h-12 w-auto",
    xl: "h-16 w-auto",
  };

  // Выбираем логотип в зависимости от темы
  const logoSrc =
    theme === "dark"
      ? "/src/assets/images/brand/4life-logo-light.svg" // Белый логотип для темной темы
      : "/src/assets/images/brand/4life-logo.svg"; // Синий логотип для светлой темы

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
