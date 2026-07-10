/**
 * @module src/components/ui/ScrollTextReveal/WordReveal.tsx
 * @description Индивидуальный компонент анимации слова для ScrollTextReveal.
 * Оптимизирован под палитру Clinical Obsidian (Neon Cyan-300: #67e8f9) без проверки условий темы.
 * @author Kort
 * @version 1.1.0
 */

import { motion, useTransform } from "framer-motion";
import React from "react";
import { WordRevealProps } from "./ScrollTextReveal.types";
import { DEFAULT_CONFIG, TextSplitter } from "./ScrollTextReveal.utils";

/**
 * WordReveal component - управляет рендерингом и анимацией отдельных слов
 */
const WordReveal: React.FC<WordRevealProps> = ({
  word,
  index,
  totalWords,
  scrollProgress,
  staggerDelay = DEFAULT_CONFIG.animation.staggerDelay,
  easingFunction = DEFAULT_CONFIG.animation.easingFunction,
  tier = "high",
}) => {
  // Вычисляем тайминг вхождения конкретного слова в общий скролл-диапазон
  const [startProgress, endProgress] = TextSplitter.calculateWordTiming(index, totalWords, staggerDelay);

  // Вычисляем непрозрачность слова на основе скролла
  const opacity = useTransform(scrollProgress, [startProgress, endProgress], DEFAULT_CONFIG.animation.opacityRange);

  // Эффект наклона применяется исключительно для High-типа устройств
  const skewX = useTransform(
    scrollProgress,
    [startProgress, endProgress],
    tier === "high" ? DEFAULT_CONFIG.animation.skewRange : [0, 0],
  );

  // Эффект мягкого размытия для High и Medium типов устройств
  const blur = useTransform(
    scrollProgress,
    [startProgress, endProgress],
    tier === "high" || tier === "medium" ? DEFAULT_CONFIG.animation.blurRange : [0, 0],
  );

  // Преобразуем числовое значение блюра в CSS-свойство filter
  const filter = useTransform(blur, (value) => `blur(${value}px)`);

  return (
    <motion.span
      className="typography-lead relative inline-block mr-3 mt-3"
      style={{
        opacity,
        skewX,
        filter,
        willChange: "transform, opacity",
        color: "#67e8f9", // Строго зафиксированный неоновый Cyan-300 цвет для Clinical Obsidian
      }}
      transition={{
        ease: easingFunction === "sine" ? [0.445, 0.05, 0.55, 0.95] : "easeOut",
      }}
    >
      {word}
    </motion.span>
  );
};

export default WordReveal;
