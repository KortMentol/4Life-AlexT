import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { useTheme } from "../../hooks/useTheme";

// Анимация свечения для темной темы в неоновом бирюзовом цвете.
const glowDark = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 3px rgba(0, 255, 255, 0.4)) drop-shadow(0 0 5px rgba(0, 255, 255, 0.2));
  }
  50% {
    filter: drop-shadow(0 0 5px rgba(0, 255, 255, 0.6)) drop-shadow(0 0 15px rgba(0, 255, 255, 0.4));
  }
`;

// Анимация свечения для светлой темы в энергичном пурпурном цвете.
const glowLight = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 3px rgba(220, 38, 147, 0.4)) drop-shadow(0 0 5px rgba(220, 38, 147, 0.2));
  }
  50% {
    filter: drop-shadow(0 0 5px rgba(220, 38, 147, 0.6)) drop-shadow(0 0 10px rgba(220, 38, 147, 0.4));
  }
`;

// Стилизованный контейнер, который применяет анимацию в зависимости от темы.
const GlowContainer = styled.div<{ isDark: boolean }>`
  position: relative;
  display: inline-block;
  animation: ${({ isDark }) => (isDark ? glowDark : glowLight)}
    var(--animation-duration, 3s) ease-in-out var(--animation-delay, 0s)
    infinite;
`;

interface GlowEffectProps {
  children: React.ReactNode;
  /** Длительность одного цикла анимации в секундах. */
  duration?: number;
  /** Задержка перед началом анимации в секундах. */
  delay?: number;
}

/**
 * @module components/layout/GlowEffect
 * @description Компонент для создания анимированного эффекта свечения вокруг дочерних элементов.
 * Эффект реализован с помощью CSS `filter: drop-shadow` для оптимальной производительности и автоматически
 * адаптируется к светлой и темной теме, используя разные keyframes-анимации.
 *
 * @author Kort
 * @version 1.0.0
 *
 * @param {React.ReactNode} children - Дочерние элементы, которые будут обернуты эффектом.
 * @param {number} [duration=3] - Длительность одного цикла анимации в секундах.
 * @param {number} [delay=0] - Задержка перед началом анимации в секундах.
 *
 * @see glowDark - Анимация keyframes для темной темы.
 * @see glowLight - Анимация keyframes для светлой темы.
 *
 * @usage
 * Используется для акцентирования внимания на ключевых заголовках или элементах интерфейса.
 *
 * 1. **На странице "Продукты" (`src/pages/ProductsPage.tsx`):**
 *    - Для главного заголовка "Каталог Продукции 4Life".
 *
 * @example
 * <GlowEffect duration={4}>
 *   <h1>Важный заголовок</h1>
 * </GlowEffect>
 */
export const GlowEffect: React.FC<GlowEffectProps> = ({
  children,
  duration = 3,
  delay = 0,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <GlowContainer
      isDark={isDark}
      style={
        {
          "--animation-duration": `${duration}s`,
          "--animation-delay": `${delay}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </GlowContainer>
  );
};
