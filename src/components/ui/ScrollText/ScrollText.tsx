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

import { useTheme } from "@/hooks";
import { useEffectsDebug } from "@/hooks/useEffectsDebug";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import {
  motion,
  MotionValue,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import React, { useRef } from "react";

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
  const opacity = useTransform(progress, range, [
    theme === "dark" ? 0.1 : 0.2,
    1,
  ]);

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

const ScrollText: React.FC<ScrollTextProps> = ({
  children,
  className = "",
}) => {
  const tier = usePerformanceTier();
  const efxFlags = useEffectsDebug();
  const { theme } = useTheme();
  const container = useRef<HTMLParagraphElement>(null);

  // На тач-устройствах всегда используем упрощённую анимацию
  // Пословная анимация создаёт ~30-50 MotionValue одновременно — слишком тяжело для тача
  const isTouchDevice =
    typeof window !== "undefined"
      ? "ontouchstart" in window || navigator.maxTouchPoints > 0
      : false;

  const effectiveTier = isTouchDevice && tier === "high" ? "medium" : tier;

  // DEV: флаг scrollTextWordByWord — принудительно medium-режим если выключен
  const wordByWord = import.meta.env.DEV ? efxFlags.scrollTextWordByWord : true;
  const resolvedTier =
    effectiveTier === "high" && !wordByWord ? "medium" : effectiveTier;

  // useInView с once:false — когда компонент вне viewport, не тратим CPU на анимацию
  const inView = useInView(container, { once: false, margin: "200px" });

  const { scrollYProgress } = useScroll({
    target: container,
    offset: [
      "start 0.9",
      resolvedTier === "medium" ? "start 0.4" : "start 0.25",
    ],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  if (resolvedTier === "low") {
    return <p className={`relative ${className}`}>{children}</p>;
  }

  if (resolvedTier === "medium") {
    // Когда вне viewport — статичный рендер без motion overhead
    if (!inView) {
      return <p className={`relative ${className}`}>{children}</p>;
    }
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

  // Когда вне viewport — статичный рендер (экономим ~30-50 MotionValue)
  if (!inView) {
    return (
      <p ref={container} className={`relative ${className}`}>
        {words.map((word, i) => (
          <span
            key={i}
            className="relative mr-3 mt-3 inline-block"
            style={{ color: theme === "dark" ? "#00d4ff" : "#0066ff" }}
          >
            {word}
          </span>
        ))}
      </p>
    );
  }

  return (
    <p ref={container} className={`relative ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word
            key={i}
            word={word}
            progress={scrollYProgress}
            range={[start, end]}
            theme={theme}
          />
        );
      })}
    </p>
  );
};

export default ScrollText;
