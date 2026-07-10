/**
 * @module components/effects/TextShineEffect
 * @description Компонент для создания анимированного эффекта "блеска" на тексте.
 * Использует Framer Motion useAnimationFrame для GPU-ускоренной анимации на десктопе.
 * На мобильных устройствах эффект отключен для сохранения 60 FPS и батареи.
 * Полностью переведен на темную тему Clinical Obsidian (серебряный базовый текст с неоновым циановым блеском).
 *
 * @author Kort
 * @version 5.1.0
 */

import { useFeatureFlag, useIsMobile, usePerformanceTier } from "@/hooks";
import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";
import React, { useRef } from "react";

interface ShineTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

const TextShineEffect: React.FC<ShineTextProps> = ({ text, className = "", speed = 3, delay = 2.5 }) => {
  const isMobile = useIsMobile();
  const tier = usePerformanceTier();
  const isShineEnabled = useFeatureFlag("textShineAnimation", tier !== "low");

  // Мобильные или слабые устройства: простой текст без анимации для экономии батареи и кадров
  if (isMobile || !isShineEnabled) {
    return <span className={className}>{text}</span>;
  }

  // Десктоп: shine-эффект через Framer Motion RAF
  return <DesktopShineText text={text} className={className} speed={speed} delay={delay} />;
};

const DesktopShineText: React.FC<{
  text: string;
  className: string;
  speed: number;
  delay: number;
}> = ({ text, className, speed, delay }) => {
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
      // Пауза: держим shine за пределами видимости
      progress.set(100);
    }
  });

  // Transform: p=0 → 150% (справа), p=100 → -50% (слева)
  const backgroundPosition = useTransform(progress, (p) => `${150 - p * 2}% center`);

  // Премиальная Clinical Obsidian палитра:
  // Базовый цвет текста наследуется от родителя (currentColor — серебряный / slate-400),
  // а пробегающий блеск окрашен в яркий неоновый циан (#00ccff).
  const color = "currentColor";
  const shineColor = "#00ccff";

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