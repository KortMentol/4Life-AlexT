/**
 * @module src/components/ui/ScrollTextReveal/WordReveal.tsx
 * @description Индивидуальный компонент анимации слова для ScrollTextReveal.
 *
 * @author Senior Staff Frontend Engineer
 * @version 1.2.0
 */

import { motion, useTransform } from "framer-motion";
import React from "react";
import { WordRevealProps } from "./ScrollTextReveal.types";
import { DEFAULT_CONFIG, TextSplitter } from "./ScrollTextReveal.utils";

const WordReveal: React.FC<WordRevealProps> = ({
  word,
  index,
  totalWords,
  scrollProgress,
  staggerDelay = DEFAULT_CONFIG.animation.staggerDelay,
  easingFunction = DEFAULT_CONFIG.animation.easingFunction,
  tier = "high",
}) => {
  const [startProgress, endProgress] = TextSplitter.calculateWordTiming(index, totalWords, staggerDelay);

  const opacity = useTransform(scrollProgress, [startProgress, endProgress], DEFAULT_CONFIG.animation.opacityRange);

  const skewX = useTransform(
    scrollProgress,
    [startProgress, endProgress],
    tier === "high" ? DEFAULT_CONFIG.animation.skewRange : [0, 0],
  );

  const blur = useTransform(
    scrollProgress,
    [startProgress, endProgress],
    tier === "high" || tier === "medium" ? DEFAULT_CONFIG.animation.blurRange : [0, 0],
  );

  const filter = useTransform(blur, (value) => `blur(${value}px)`);

  // Умный динамический расчет will-change (спасает VRAM на мобильных устройствах)
  const willChange = useTransform(scrollProgress, (p) => {
    const isAnimating = p > startProgress - 0.05 && p < endProgress + 0.05;
    return isAnimating ? "transform, opacity" : "auto";
  });

  return (
    <motion.span
      className="typography-lead relative inline-block mr-3 mt-3"
      style={{
        opacity,
        skewX,
        filter,
        willChange,
        color: "#67e8f9",
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
