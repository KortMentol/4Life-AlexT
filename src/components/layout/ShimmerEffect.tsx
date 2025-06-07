import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useTheme } from '../../context/ThemeContext';

// Продвинутая анимация блеска для SVG элементов
const shimmerEffect = keyframes`
  0% {
    transform: translateX(-100%) skewX(-15deg);
  }
  50% {
    transform: translateX(0%) skewX(-15deg);
  }
  100% {
    transform: translateX(100%) skewX(-15deg);
  }
`;

// Контейнер с эффектом блеска
const ShimmerContainer = styled.div<{ isDark: boolean }>`
  position: relative;
  overflow: hidden;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.isDark 
      ? 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 100%)'
      : 'linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0) 100%)'
    };
    transform: translateX(-100%) skewX(-15deg);
    animation: ${shimmerEffect} 6s ease-in-out infinite;
    border-radius: inherit;
    pointer-events: none;
    mix-blend-mode: overlay;
    opacity: 0.7;
  }
`;

// Компонент для обертывания элементов с эффектом блеска
interface ShimmerEffectProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export const ShimmerEffect: React.FC<ShimmerEffectProps> = ({ 
  children, 
  delay = 0,
  duration = 6
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <ShimmerContainer
      isDark={isDark}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      {children}
    </ShimmerContainer>
  );
};

// Компонент для текста с эффектом блеска
const shimmerTextEffect = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const ShimmerTextContainer = styled.span<{ isDark: boolean }>`
  background: linear-gradient(
    90deg, 
    var(--text-color) 0%, 
    var(--text-color) 42%, 
    var(--highlight-color) 50%,
    var(--text-color) 58%, 
    var(--text-color) 100%
  );
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  color: var(--text-color);
  -webkit-text-fill-color: transparent;
  animation: ${shimmerTextEffect} 4s linear infinite;
  display: inline-block;
  opacity: 1 !important;
  visibility: visible !important;
  position: relative;
  z-index: 1;
  white-space: nowrap;
`;

interface ShimmerTextProps {
  children: React.ReactNode;
  textColor?: string;
  highlightColor?: string;
  delay?: number;
  duration?: number;
}

export const ShimmerText: React.FC<ShimmerTextProps> = ({ 
  children, 
  textColor = '#000000', 
  highlightColor = '#ffffff',
  delay = 0,
  duration = 4
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Адаптируем цвета в зависимости от темы
  const actualTextColor = isDark && textColor === '#000000' ? '#ffffff' : textColor;
  // Для темной темы используем контрастный цвет для блеска, но с меньшей интенсивностью
  const actualHighlightColor = isDark 
    ? (actualTextColor === '#ffffff' ? 'rgba(0, 191, 255, 0.8)' : 'rgba(255, 255, 255, 0.8)') 
    : (highlightColor === '#ffffff' ? '#3b82f6' : highlightColor);
  
  return (
    <ShimmerTextContainer
      isDark={isDark}
      style={{ 
        '--text-color': actualTextColor, 
        '--highlight-color': actualHighlightColor,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      } as React.CSSProperties}
    >
      {children}
    </ShimmerTextContainer>
  );
};