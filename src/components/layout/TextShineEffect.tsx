import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useTheme } from "../../context/ThemeContext";

// Простая анимация блеска - один проход слева направо
const shineEffect = keyframes`
  from {
    mask-position: -150% 0;
  }
  to {
    mask-position: 250% 0;
  }
`;

interface ShineTextProps {
  text: string;
  className?: string;
  duration?: number;
}

const ShineTextContainer = styled.span<{ isDark: boolean; duration: number }>`
  position: relative;
  color: var(--text-color);

  &::after {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 0;
    color: var(--shine-color);
    mask-image: linear-gradient(
      110deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0) 40%,
      rgba(0, 0, 0, 1) 50%,
      rgba(0, 0, 0, 0) 60%,
      rgba(0, 0, 0, 0) 100%
    );
    mask-size: 200% 100%;
    mask-repeat: no-repeat;
    animation: ${shineEffect} ${(props) => props.duration}s linear infinite;
  }
`;

const TextShineEffect: React.FC<ShineTextProps> = ({
  text,
  className = "",
  duration = 5,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Определяем цвета в зависимости от темы
  const textColor = isDark ? "#ffffff" : "#1e40af"; // белый для темной темы, синий для светлой
  const shineColor = isDark ? "#7dd3fc" : "#fcd34d"; // голубой для темной, золотой для светлой

  return (
    <ShineTextContainer
      isDark={isDark}
      duration={duration}
      className={className}
      data-text={text}
      style={
        {
          "--text-color": textColor,
          "--shine-color": shineColor,
        } as React.CSSProperties
      }
    >
      {text}
    </ShineTextContainer>
  );
};

export default TextShineEffect;
