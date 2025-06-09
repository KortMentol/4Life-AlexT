import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Свойства компонента DynamicLogo
 */
interface DynamicLogoProps {
  /** Альтернативный текст для изображения */
  alt?: string;
  /** CSS классы для стилизации */
  className?: string;
  /** Размер логотипа (высота) */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Компонент динамического логотипа, который автоматически переключается
 * между светлой и темной версией в зависимости от текущей темы
 */
const DynamicLogo: React.FC<DynamicLogoProps> = ({ 
  alt = "4Life Logo", 
  className = "",
  size = "md"
}) => {
  const { theme } = useTheme();
  
  // Определяем размеры в зависимости от пропа size
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-9 w-auto', 
    lg: 'h-12 w-auto',
    xl: 'h-16 w-auto'
  };
  
  // Выбираем логотип в зависимости от темы
  const logoSrc = theme === 'dark' 
    ? '/assets/images/brand/4life-logo-light.svg'  // Белый логотип для темной темы
    : '/assets/images/brand/4life-logo.svg';       // Синий логотип для светлой темы
  
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
