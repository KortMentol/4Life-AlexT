import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useEffect, useRef } from "react";
import { useTheme } from "../../context/useTheme";

// Голографический эффект с градиентом
const holographicShimmer = keyframes`
  0% {
    background-position: 0% 50%;
    opacity: 0.7;
  }
  50% {
    background-position: 100% 50%;
    opacity: 1;
  }
  100% {
    background-position: 0% 50%;
    opacity: 0.7;
  }
`;

// Контейнер с голографическим эффектом
const HolographicContainer = styled.div<{ isDark: boolean }>`
  position: relative;
  display: inline-block;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) =>
      props.isDark
        ? "linear-gradient(135deg, transparent 0%, var(--color-end) 50%, transparent 100%)"
        : "linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.05) 50%, transparent 100%)"};
    background-size: 400% 400%;
    mix-blend-mode: ${(props) => (props.isDark ? "overlay" : "multiply")};
    pointer-events: none;
    z-index: 10;
    animation: ${holographicShimmer} var(--duration) ease-in-out infinite;
    opacity: ${(props) => (props.isDark ? "0.7" : "0.3")};
    border-radius: inherit;
  }
`;

interface HolographicEffectProps {
  children: React.ReactNode;
  duration?: number;
  intensity?: number;
  colorStart?: string;
  colorEnd?: string;
}

export const HolographicEffect: React.FC<HolographicEffectProps> = ({
  children,
  duration = 6,
  intensity = 1,
  colorStart = "rgba(0, 183, 255, 0.2)",
  colorEnd = "rgba(255, 215, 0, 0.2)",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.style.setProperty("--duration", `${duration}s`);
    // Используем intensity в CSS переменной
    container.style.setProperty("--intensity", intensity.toString());
    container.style.setProperty("--color-start", colorStart);
    container.style.setProperty("--color-end", colorEnd);
  }, [duration, intensity, colorStart, colorEnd]);

  return (
    <HolographicContainer ref={containerRef} isDark={isDark}>
      {children}
    </HolographicContainer>
  );
};

// 3D эффект с отслеживанием движения мыши
export const MouseTrackingEffect: React.FC<{
  children: React.ReactNode;
  intensity?: number;
}> = ({ children, intensity = 15 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = container.getBoundingClientRect();

      // Вычисляем положение мыши относительно центра элемента
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      // Применяем трансформацию в зависимости от положения мыши
      const rotateX = -y * intensity;
      const rotateY = x * intensity;
      const brightness = 1 + Math.sqrt(x * x + y * y) * 0.3;

      container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      container.style.filter = `brightness(${brightness})`;
    };

    const handleMouseLeave = () => {
      // Возвращаем элемент в исходное положение
      container.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      container.style.filter = "brightness(1)";
    };

    // Добавляем обработчики событий
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      // Удаляем обработчики при размонтировании
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      style={{
        display: "inline-block",
        transition: "transform 0.1s ease-out, filter 0.1s ease-out",
      }}
    >
      {children}
    </div>
  );
};
