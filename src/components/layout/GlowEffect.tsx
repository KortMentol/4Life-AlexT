import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useTheme } from "../../context/ThemeContext";

// Продвинутая анимация свечения для темной темы
const glowDark = keyframes`
  0% {
    filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 5px rgba(255, 215, 0, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 15px rgba(255, 215, 0, 0.5));
  }
  100% {
    filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 5px rgba(255, 215, 0, 0.3));
  }
`;

// Продвинутая анимация свечения для светлой темы
const glowLight = keyframes`
  0% {
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.1)) drop-shadow(0 0 3px rgba(0, 0, 0, 0.1));
  }
  50% {
    filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.15)) drop-shadow(0 0 5px rgba(0, 0, 0, 0.15));
  }
  100% {
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.1)) drop-shadow(0 0 3px rgba(0, 0, 0, 0.1));
  }
`;

// Контейнер с эффектом свечения
const GlowContainer = styled.div<{ isDark: boolean }>`
  position: relative;
  display: inline-block;
  animation: ${(props) => (props.isDark ? glowDark : glowLight)} 3s ease-in-out
    infinite;
`;

interface GlowEffectProps {
  children: React.ReactNode;
  color?: string;
  intensity?: number; // Оставляем в интерфейсе для GlowEffect
  duration?: number;
  delay?: number;
}

export const GlowEffect: React.FC<GlowEffectProps> = ({
  children,
  color = "rgba(255, 215, 0, 0.7)",
  intensity = 1,
  duration = 3,
  delay = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Адаптируем цвет в зависимости от темы
  const adaptedColor = isDark
    ? color
    : color.includes("rgba")
      ? color.replace(
          /rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/,
          "rgba($1, $2, $3, 0.3)",
        )
      : "rgba(0, 0, 0, 0.3)";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Настраиваем анимацию с помощью CSS переменных
    container.style.setProperty("--glow-color", adaptedColor);
    // Используем intensity в CSS переменной
    container.style.setProperty("--glow-intensity", intensity.toString());
    container.style.setProperty("--animation-duration", `${duration}s`);
    container.style.setProperty("--animation-delay", `${delay}s`);
  }, [adaptedColor, intensity, duration, delay]);

  return (
    <GlowContainer
      ref={containerRef}
      isDark={isDark}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
    >
      {children}
    </GlowContainer>
  );
};

// Продвинутый эффект свечения с частицами
export const ParticleGlowEffect: React.FC<
  Omit<GlowEffectProps, "intensity"> & { particleCount?: number }
> = ({
  children,
  color = "rgba(255, 215, 0, 0.7)",
  duration = 3,
  delay = 0,
  particleCount = 5,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Адаптируем цвет в зависимости от темы
  const adaptedColor = isDark
    ? color
    : color.includes("rgba")
      ? color.replace(
          /rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/,
          "rgba($1, $2, $3, 0.2)",
        )
      : "rgba(0, 0, 0, 0.2)";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Создаем и добавляем частицы
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "glow-particle";

      // Случайное позиционирование частиц
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = adaptedColor;
      particle.style.borderRadius = "50%";
      particle.style.position = "absolute";
      particle.style.filter = `blur(${size / 2}px)`;
      particle.style.opacity = "0";

      // Анимация частиц
      const animDuration = Math.random() * 3 + 2;
      const animDelay = Math.random() * 2;

      particle.style.animation = `particle-glow ${animDuration}s ease-in-out ${animDelay}s infinite`;

      // Добавляем стиль для анимации
      if (!document.getElementById("particle-glow-keyframes")) {
        const style = document.createElement("style");
        style.id = "particle-glow-keyframes";
        style.innerHTML = `
          @keyframes particle-glow {
            0% { 
              opacity: 0;
              transform: translate(0, 0);
            }
            50% { 
              opacity: 0.8;
              transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px);
            }
            100% { 
              opacity: 0;
              transform: translate(0, 0);
            }
          }
        `;
        document.head.appendChild(style);
      }

      // Случайное позиционирование
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;

      container.appendChild(particle);
    }

    return () => {
      // Очистка частиц при размонтировании
      const particles = container.querySelectorAll(".glow-particle");
      particles.forEach((particle) => particle.remove());
    };
  }, [particleCount, adaptedColor]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "inline-block",
        animation: `${isDark ? glowDark : glowLight} ${duration}s ease-in-out ${delay}s infinite`,
      }}
    >
      {children}
    </div>
  );
};
