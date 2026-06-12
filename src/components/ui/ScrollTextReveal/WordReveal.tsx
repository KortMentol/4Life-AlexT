/**
 * @module src/components/ui/ScrollTextReveal/WordReveal.tsx
 * @description Individual word animation component for ScrollTextReveal
 * @author Kort
 * @version 1.0.0
 */

import { motion, useTransform } from "framer-motion";
import React from "react";
import { WordRevealProps } from "./ScrollTextReveal.types";
import { DEFAULT_CONFIG, TextSplitter } from "./ScrollTextReveal.utils";

/**
 * WordReveal component - handles animation of individual words
 */
const WordReveal: React.FC<WordRevealProps> = ({
  word,
  index,
  totalWords,
  scrollProgress,
  staggerDelay = DEFAULT_CONFIG.animation.staggerDelay,
  easingFunction = DEFAULT_CONFIG.animation.easingFunction,
  theme,
  tier = "high",
}) => {
  // Calculate timing for this specific word
  const [startProgress, endProgress] = TextSplitter.calculateWordTiming(index, totalWords, staggerDelay);

  // Create animation transforms for this word
  const opacity = useTransform(scrollProgress, [startProgress, endProgress], DEFAULT_CONFIG.animation.opacityRange);

  // Skew only for HIGH tier
  const skewX = useTransform(
    scrollProgress,
    [startProgress, endProgress],
    tier === "high" ? DEFAULT_CONFIG.animation.skewRange : [0, 0],
  );

  // Blur for both HIGH and MEDIUM tiers
  const blur = useTransform(
    scrollProgress,
    [startProgress, endProgress],
    tier === "high" || tier === "medium" ? DEFAULT_CONFIG.animation.blurRange : [0, 0],
  );

  // Create filter string from blur value
  const filter = useTransform(blur, (value) => `blur(${value}px)`);

  // Theme-based styling with consistent colors
  const getThemeStyles = () => {
    return {
      // Match block text colors from MorphingVideoSection
      color: theme === "dark" ? "#67e8f9" : "#475569", // cyan-300 for dark, slate-600 for light
    };
  };

  return (
    <motion.span
      className="typography-lead relative inline-block mr-3 mt-3"
      style={{
        opacity,
        skewX,
        filter,
        willChange: "transform, opacity",
        ...getThemeStyles(),
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
