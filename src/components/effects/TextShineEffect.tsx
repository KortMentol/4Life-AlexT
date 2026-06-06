import { useFeatureFlag, useIsMobile, usePerformanceTier, useTheme } from "@/hooks";
import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";
import React, { useRef } from "react";

interface ShineTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

/**
 * @module components/effects/TextShineEffect
 * @description Компонент для создания анимированного эффекта "блеска" на тексте.
 * Использует Framer Motion useAnimationFrame для GPU-ускоренной анимации на десктопе.
 * На мобильных устройствах эффект отключен для сохранения 60 FPS и батареи.
 *
 * @author Kort
 * @version 5.0.0 - Mobile-optimized (Awwwards 2026 best practice)
 *
 * @param {string} text - Текст, к которому применяется эффект.
 * @param {string} [className] - Дополнительные CSS-классы для контейнера.
 * @param {number} [speed=3] - Длительность одной итерации анимации в секундах (только десктоп).
 * @param {number} [delay=2.5] - Пауза между проходами в секундах (только десктоп).
 *
 * @usage
 * Используется для акцентирования внимания на важных текстовых элементах.
 *
 * 1. **В шапке сайта (`src/components/layout/Header.tsx`):**
 *    - Для имени "Александр Тощев" в десктопной версии (на мобильных - обычный текст).
 *
 * 2. **На странице "Как купить" (`src/pages/HowToBuyPage.tsx`):**
 *    - Для заголовка "Как Приобрести Продукцию 4Life".
 *
 * @example
 * <TextShineEffect text="Важный заголовок" speed={3} delay={2.5} />
 */
const TextShineEffect: React.FC<ShineTextProps> = ({ text, className = "", speed = 3, delay = 2.5 }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isMobile = useIsMobile();
  const tier = usePerformanceTier();
  const isShineEnabled = useFeatureFlag("textShineAnimation", tier !== "low");

  // Мобильные или disabled: простой текст без анимации (60 FPS + экономия батареи)
  if (isMobile || !isShineEnabled) {
    return <span className={className}>{text}</span>;
  }

  // Десктоп: shine-эффект через Framer Motion RAF
  return <DesktopShineText text={text} className={className} speed={speed} delay={delay} isDark={isDark} />;
};

// Отдельный компонент для десктопа (чтобы hooks не вызывались на мобильных)
const DesktopShineText: React.FC<{
  text: string;
  className: string;
  speed: number;
  delay: number;
  isDark: boolean;
}> = ({ text, className, speed, delay, isDark }) => {
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const animationDuration = speed * 1000;
  const delayDuration = delay * 1000;

  useAnimationFrame((time) => {
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += deltaTime;

    const cycleDuration = animationDuration + delayDuration;
    const cycleTime = elapsedRef.current % cycleDuration;

    if (cycleTime < animationDuration) {
      // Анимация: 0 → 100 (справа налево)
      const p = (cycleTime / animationDuration) * 100;
      progress.set(p);
    } else {
      // Пауза: держим shine за экраном
      progress.set(100);
    }
  });

  // Transform: p=0 → 150% (справа), p=100 → -50% (слева)
  const backgroundPosition = useTransform(progress, (p) => `${150 - p * 2}% center`);

  // Цвета как раньше:
  // Базовый текст наследуется от родителя (currentColor)
  // Темная тема: белый текст + голубой shine
  // Светлая тема: темно-серый текст + золотой shine
  const color = "currentColor";
  const shineColor = isDark ? "#00ccff" : "#ffcc00";

  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(110deg, ${color} 0%, ${color} 40%, ${shineColor} 50%, ${color} 60%, ${color} 100%)`,
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: color, // Fallback для браузеров без поддержки background-clip
  };

  return (
    <motion.span className={`inline-block ${className}`} style={{ ...gradientStyle, backgroundPosition }}>
      {text}
    </motion.span>
  );
};

export default TextShineEffect;
