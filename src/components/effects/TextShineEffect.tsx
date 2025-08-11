import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { useTheme } from "../../hooks/useTheme";

// Улучшенная анимация блеска - один проход справа налево с более заметным эффектом
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
  color?: string;
}

interface ShineTextContainerProps {
  isDark: boolean;
  duration: number;
}

const ShineTextContainer = styled.span<ShineTextContainerProps>`
  position: relative;
  color: var(--text-color);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  &::after {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 0;
    color: var(--shine-color);
    mask-image: linear-gradient(
      110deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0) 30%,
      rgba(0, 0, 0, 1) 50%,
      rgba(0, 0, 0, 0) 70%,
      rgba(0, 0, 0, 0) 100%
    );
    mask-size: 200% 100%;
    mask-repeat: no-repeat;
    animation: ${shineEffect} ${(props) => props.duration}s linear infinite;
    opacity: 1;
  }
`;

/**
 * @module components/effects/TextShineEffect
 * @description Компонент для создания анимированного эффекта "блеска" на тексте.
 * Эффект достигается с помощью CSS-маски, которая движется поверх текста,
 * создавая иллюзию пробегающего блика. Компонент автоматически адаптирует
 * цвета для светлой и темной тем.
 *
 * @author Kort
 * @version 1.0.0
 *
 * @param {string} text - Текст, к которому применяется эффект.
 * @param {string} [className] - Дополнительные CSS-классы для контейнера.
 * @param {number} [duration=5] - Длительность одной итерации анимации в секундах.
 *
 * @see shineEffect - Анимация keyframes, отвечающая за движение маски.
 *
 * @usage
 * Используется для акцентирования внимания на важных текстовых элементах.
 *
 * 1. **В шапке сайта (`src/components/layout/Header.tsx`):**
 *    - Для имени "Александр Тощев" в десктопной и мобильной версиях.
 *
 * 2. **На странице "Как купить" (`src/pages/HowToBuyPage.tsx`):**
 *    - Для заголовка "Как Приобрести Продукцию 4Life".
 *
 * @example
 * <TextShineEffect text="Важный заголовок" duration={3} />
 */
const TextShineEffect: React.FC<ShineTextProps> = ({
  text,
  className = "",
  duration = 3,
  color,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Используем CSS-переменные для цветов
  // Если цвет передан через props, используем его. Иначе, определяем по теме.
  const textColor = color || "currentColor";
  // Цвет блеска - золотистый в светлой теме, синий в темной
  const shineColor = isDark ? "#00ccff" : "#ffcc00";

  return (
    <ShineTextContainer
      isDark={isDark}
      duration={duration}
      data-text={text}
      className={className}
      style={{
        color: textColor,
        // @ts-expect-error CSS переменные не типизированы в React
        "--shine-color": shineColor,
        "--text-color": textColor,
      }}
    >
      {text}
    </ShineTextContainer>
  );
};

export default TextShineEffect;
