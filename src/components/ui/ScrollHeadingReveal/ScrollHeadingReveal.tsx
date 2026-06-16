/**
 * @module src/components/ui/ScrollHeadingReveal/ScrollHeadingReveal.tsx
 * @description Упрощённый компонент для заголовков — без анимаций.
 * Просто статичный текст с правильным цветом под тему.
 * @version 5.0.0
 */

import { useTheme } from "@/hooks";
import React from "react";

interface ScrollHeadingRevealProps {
  children: string;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "h4";
  direction?: "center" | "left" | "right";
  simpleMobile?: boolean;
}

const ScrollHeadingReveal: React.FC<ScrollHeadingRevealProps> = ({
  children,
  className = "",
  tag = "h2",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const color = isDark ? "#f8fafc" : "#1e293b";
  const TagElement = tag;

  return (
    <TagElement
      className={`typography-${tag} ${className} flex flex-wrap justify-center`}
      style={{ color }}
    >
      {children}
    </TagElement>
  );
};

export default React.memo(ScrollHeadingReveal);