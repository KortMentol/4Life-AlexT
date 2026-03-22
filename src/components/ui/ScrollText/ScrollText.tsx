/**
 * @module src/components/ui/ScrollText/ScrollText.tsx
 * @description Компонент для анимации текста при скролле с адаптацией под производительность устройства.
 * - LOW tier: Статичный текст без анимаций
 * - MEDIUM tier: Простая анимация прозрачности всего блока
 * - HIGH tier: Пословная анимация с эффектом окрашивания
 * @author Kort
 * @version 1.0.0
 * @param {string} children - Текст для анимации
 * @param {string} [className] - Дополнительные CSS классы
 * @usage
 * 1. src/components/sections/MorphingVideoSection/MorphingVideoSection.tsx - Для анимации описательных текстов в блоках
 * 2. src/components/sections/PartnershipSection/PartnershipSection.tsx - Для анимации текстов о партнерстве
 * @example
 * <ScrollText className="text-lg leading-relaxed">
 *   Ваш текст здесь...
 * </ScrollText>
 */

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import React, { useRef } from "react";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useTheme } from "@/hooks";

interface ScrollTextProps {
  children: string;
  className?: string;
}

interface WordProps {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  theme: string;
}

const Word: React.FC<WordProps> = ({ word, progress, range, theme }) => {
  const opacity = useTransform(progress, range, [theme === "dark" ? 0.1 : 0.2, 1]);

  return (
    <span className="relative mr-3 mt-3 inline-block">
      <span className="absolute opacity-0">{word}</span>
      <motion.span 
        style={{ opacity, color: theme === "dark" ? "#00d4ff" : "#0066ff" }}
      >
        {word}
      </motion.span>
    </span>
  );
};

const ScrollText: React.FC<ScrollTextProps> = ({ children, className = "" }) => {
  const tier = usePerformanceTier();
  const { theme } = useTheme();
  const container = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", tier === "medium" ? "start 0.4" : "start 0.25"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  if (tier === "low") {
    return <p className={`relative ${className}`}>{children}</p>;
  }

  if (tier === "medium") {
    return (
      <motion.p 
        ref={container} 
        className={`relative ${className}`}
        style={{ opacity }}
      >
        {children}
      </motion.p>
    );
  }

  const words = children.split(" ");
  return (
    <p ref={container} className={`relative ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return <Word key={i} word={word} progress={scrollYProgress} range={[start, end]} theme={theme} />;
      })}
    </p>
  );
};

export default ScrollText;
