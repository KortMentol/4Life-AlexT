import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { useTheme } from "../../hooks/useTheme";

// Простая анимация блеска - один проход справа налево
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

interface ShineTextContainerProps {
  isDark: boolean;
  duration: number;
}

const ShineTextContainer = styled.span<ShineTextContainerProps>`
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
const TextShineEffect: React.FC<ShineTextProps> = ({ text, className = "", duration = 5 }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Определяем цвета в зависимости от темы
  const textColor = isDark ? "#ffffff" : "#1e40af"; // белый для темной темы, синий для светлой
  const shineColor = isDark ? "#7dd3fc" : "#fcd34d"; // голубой для темной, золотой для светлой

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
