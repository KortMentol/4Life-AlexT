/**
 * @module src/components/ui/ScrollNumber/ScrollNumber.tsx
 * @description Оптимизированный компонент для анимации цифр при скролле с точным закрашиванием по контуру
 * @author Kort
 * @version 2.1.0
 * @usage
 * 1. src/components/sections/MorphingVideoSection/MorphingVideoSection.tsx - В блоках 01, 02, 03 для анимации цифр при скролле
 * @example
 * <ScrollNumber number="01" className="text-[8rem] font-thin" />
 */

import { useFeatureFlag, usePerformanceTier, useTheme } from "@/hooks";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

interface ScrollNumberProps {
  number: string;
  className?: string;
}

const ScrollNumber: React.FC<ScrollNumberProps> = ({ number, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = usePerformanceTier();
  const isAnimEnabled = useFeatureFlag("scrollNumberAnimation", tier !== "low");
  const { theme } = useTheme();

  // useInView с once:false — когда вне viewport, не тратим CPU на clipPath анимацию
  const inView = useInView(containerRef, { once: false, margin: "200px" });

  // Все хуки вызываются безусловно (Rules of Hooks)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 1", "end 0.6"],
  });

  const clipPath = useTransform(scrollYProgress, [0, 1], ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]);

  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 0.9]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Базовый текст */}
      <div className="text-blue-500/10 dark:text-cyan-400/10 select-none">{number}</div>

      {/* Анимированный текст — только если enabled AND в viewport */}
      {isAnimEnabled && inView ? (
        <motion.div
          className="absolute inset-0 select-none will-change-transform"
          style={{
            clipPath,
            opacity,
            color: theme === "dark" ? "#22d3ee" : "#0ea5e9",
          }}
        >
          {number}
        </motion.div>
      ) : (
        <div
          className="absolute inset-0 select-none"
          style={{
            color: theme === "dark" ? "#22d3ee" : "#0ea5e9",
            opacity: 0.9,
          }}
        >
          {number}
        </div>
      )}
    </div>
  );
};

export default ScrollNumber;