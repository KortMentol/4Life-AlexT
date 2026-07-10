/**
 * @module ScrollNumber
 * @description Анимированное заполнение больших чисел цветом при прокрутке.
 * Оптимизировано для темного интерфейса Clinical Obsidian с цветами в спектре Cyan-400.
 * Все следы светлой темы полностью деактивированы.
 * @version 2.2.0
 */

import { useFeatureFlag, usePerformanceTier } from "@/hooks";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

interface ScrollNumberProps {
  number: string;
  className?: string;
}

const ScrollNumber: React.FC<ScrollNumberProps> = ({ number, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = usePerformanceTier();

  const isTouchDevice =
    typeof window !== "undefined" ? "ontouchstart" in window || navigator.maxTouchPoints > 0 : false;
  const isAnimEnabled = !isTouchDevice && useFeatureFlag("scrollNumberAnimation", tier !== "low");

  const inView = useInView(containerRef, { once: false, margin: "200px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 1", "end 0.6"],
  });

  // Математическая маска: контейнер-маска съезжает вниз (от 100% до 0%)
  const maskY = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);
  // Компенсация: текст внутри маски съезжает вверх на такое же расстояние (от -100% до 0%)
  const textY = useTransform(scrollYProgress, [0, 1], ["-100%", "0%"]);

  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 0.9]);

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {/* 1. Фоновый слой: бледная циановая цифра (задает физический размер контейнеру) */}
      <div className="text-cyan-400/10">{number}</div>

      {isAnimEnabled && inView ? (
        /* 2. Слой-маска: двигается вниз по оси Y, скрывая лишнее через overflow-hidden */
        <motion.div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            y: maskY,
            willChange: "transform",
          }}
        >
          {/* 3. Активный слой: двигается в противоположную сторону, компенсируя сдвиг маски */}
          <motion.div
            className="absolute inset-0"
            style={{
              y: textY,
              opacity,
              color: "#22d3ee", // Фиксированный неоновый Cyan-400 для Clinical Obsidian
              willChange: "transform, opacity",
            }}
          >
            {number}
          </motion.div>
        </motion.div>
      ) : (
        /* Свечение по умолчанию при выключенной анимации */
        <div
          className="absolute inset-0"
          style={{
            color: "#22d3ee",
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
