/**
 * @module src/animations/headerAnimations.ts
 * @description Минимальные анимации для хедера - только используемые.
 * @author Kort
 * @version 2.0.0 (2026 Performance Optimized)
 * @usage Только в Header.tsx
 */

import { Variants } from "framer-motion";

/**
 * Оптимизированные анимации для хедера - только transform свойства
 */
export const headerVariants: Variants = {
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25,
      mass: 0.6,
    },
  },
  hidden: {
    y: "-100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 250,
      damping: 28,
      mass: 0.6,
    },
  },
};

/**
 * Оптимизированные анимации для логотипа - без scale
 */
export const logoVariants: Variants = {
  initial: {
    opacity: 1,
    y: 0,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: 0.1,
    },
  },
  hover: {
    y: -2,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  },
};
