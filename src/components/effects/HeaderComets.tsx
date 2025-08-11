/**
 * @module src/components/effects/HeaderComets.tsx
 * @description Компонент, создающий эффект двух зеркальных комет с затухающими следами, движущихся по контуру хедера.
 * @author Kort
 * @version 1.0.0
 * @usage
 * 1. `src/components/layout/Header.tsx`: Добавляется в хедер для создания футуристического эффекта неоновых комет.
 * @example
 * <motion.header>
 *   <HeaderComets />
 *   { Остальное содержимое хедера }
 * </motion.header>
 */
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";

const HeaderComets: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const headerRef = useRef<SVGSVGElement>(null);

  // Цвета для разных тем
  const cometColor = isDark
    ? "rgba(0, 255, 255, 0.9)" // Голубой неон для темной темы
    : "rgba(59, 130, 246, 0.9)"; // Синий для светлой темы

  const cometGlowColor = isDark
    ? "rgba(0, 255, 255, 0.3)" // Голубой неон для темной темы
    : "rgba(59, 130, 246, 0.3)"; // Синий для светлой темы

  // Длительность анимации задается в CSS (30 секунд)

  return (
    <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
      {/* SVG для определения пути движения комет */}
      <svg
        ref={headerRef}
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        style={{ opacity: 0 }}
      >
        <defs>
          <path
            id="cometPath1"
            d="M 50,2 A 48,48 0 1 1 49.9999,2"
            fill="none"
          />
          <path
            id="cometPath2"
            d="M 50,2 A 48,48 0 1 0 49.9999,2"
            fill="none"
          />
        </defs>
      </svg>

      {/* Первая комета (движется по часовой стрелке) */}
      <div className="comet comet-1">
        {/* Голова кометы */}
        <motion.div
          className="comet-head"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: `radial-gradient(circle, ${cometColor} 0%, ${cometGlowColor} 70%, transparent 100%)`,
            boxShadow: `0 0 10px 2px ${cometGlowColor}, 0 0 20px 4px ${cometGlowColor}`,
          }}
        />

        {/* След кометы */}
        <motion.div
          className="comet-tail"
          style={{
            width: "24px",
            background: `linear-gradient(90deg, ${cometColor} 0%, transparent 100%)`,
            filter: `blur(1px) drop-shadow(0 0 4px ${cometGlowColor})`,
            transform: "rotate(180deg) translateX(-3px)",
          }}
        />
      </div>

      {/* Вторая комета (движется против часовой стрелки) */}
      <div className="comet comet-2">
        {/* Голова кометы */}
        <motion.div
          className="comet-head"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5, // Небольшая задержка для асинхронности
          }}
          style={{
            background: `radial-gradient(circle, ${cometColor} 0%, ${cometGlowColor} 70%, transparent 100%)`,
            boxShadow: `0 0 10px 2px ${cometGlowColor}, 0 0 20px 4px ${cometGlowColor}`,
          }}
        />

        {/* След кометы */}
        <motion.div
          className="comet-tail"
          style={{
            width: "24px",
            background: `linear-gradient(90deg, ${cometColor} 0%, transparent 100%)`,
            filter: `blur(1px) drop-shadow(0 0 4px ${cometGlowColor})`,
            transform: "rotate(180deg) translateX(-3px)",
          }}
        />
      </div>
    </div>
  );
};

export default HeaderComets;
