/**
 * @module src/components/ui/ScrollNumber/ScrollNumber.tsx
 * @description Оптимизированный компонент для анимации цифр при скролле с точным закрашиванием по контуру
 * @author Kort
 * @version 2.0.0
 * @usage
 * 1. src/components/sections/MorphingVideoSection/MorphingVideoSection.tsx - В блоках 01, 02, 03 для анимации цифр при скролле
 * @example
 * <ScrollNumber number="01" className="text-[8rem] font-thin" />
 */

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { useTheme } from "@/hooks";

interface ScrollNumberProps {
  number: string;
  className?: string;
}

const ScrollNumber: React.FC<ScrollNumberProps> = ({ number, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 1", "end 0.6"],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]
  );

  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 0.9]);
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.8, 0.6]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Базовый текст */}
      <div className="text-blue-500/10 dark:text-cyan-400/10 select-none">
        {number}
      </div>
      
      {/* Анимированный текст */}
      <motion.div
        className="absolute inset-0 select-none will-change-transform"
        style={{
          clipPath,
          opacity,
          color: theme === 'dark' ? '#22d3ee' : '#0ea5e9',
          filter: `drop-shadow(0 0 ${glow.get() * 12}px rgba(14, 165, 233, ${glow.get() * 0.4}))`,
          textShadow: `0 0 ${glow.get() * 8}px rgba(14, 165, 233, ${glow.get() * 0.3})`
        }}
      >
        {number}
      </motion.div>
    </div>
  );
};

export default ScrollNumber;