/**
 * @module components/ui/DynamicLogo
 * @description Компонент для отображения логотипа бренда 4Life.
 * Оптимизирован под палитру Clinical Obsidian и всегда отображает светлый (белый) логотип
 * для обеспечения идеального контраста и швейцарской точности в дизайне.
 * @author Kort
 * @version 1.1.0
 */

import logoLight from "@/assets/images/brand/4life-logo-light.svg";
import React from "react";

interface DynamicLogoProps {
  /** Альтернативный текст для логотипа */
  alt?: string;
  /** Дополнительные CSS-классы для стилизации */
  className?: string;
  /** Предустановленные размеры логотипа */
  size?: "sm" | "md" | "lg" | "xl";
}

const DynamicLogo: React.FC<DynamicLogoProps> = ({ alt = "4Life Logo", className = "", size = "md" }) => {
  // Определяем размеры на основе переданного пропа size
  const sizeClasses = {
    sm: "h-6 w-auto",
    md: "h-9 w-auto",
    lg: "h-12 w-auto",
    xl: "h-16 w-auto",
  };

  return (
    <img
      src={logoLight}
      alt={alt}
      className={`${sizeClasses[size]} ${className} transition-opacity duration-300`}
      loading="lazy"
      decoding="async"
    />
  );
};

export default DynamicLogo;
