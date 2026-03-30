/**
 * @module src/animations/variants.ts
 * @description Стандартные варианты анимаций для Framer Motion - только используемые.
 * @author Kort
 * @version 2.0.0 (2026 Performance Optimized)
 */

import { Variants } from "framer-motion";

/**
 * Контейнеры с последовательной анимацией дочерних элементов
 * ИСПОЛЬЗУЕТСЯ: ProductsPage, HowToBuyPage, AboutPage, AboutMePage
 */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Отдельные элементы внутри контейнера - только opacity + translateY
 * ИСПОЛЬЗУЕТСЯ: ProductsPage, PartnershipPage, HowToBuyPage, AboutPage, AboutMePage, ContactPage
 */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 10 },
  },
};

/**
 * Заголовки с плавным появлением
 * ИСПОЛЬЗУЕТСЯ: PartnershipPage, ContactPage
 */
export const headingVariants: Variants = {
  hidden: { opacity: 0, y: -50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

/**
 * Шахматная анимация для списков
 * ИСПОЛЬЗУЕТСЯ: PartnershipPage, HowToBuyPage
 */
export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

/**
 * Функция fadeIn - ИСПОЛЬЗУЕТСЯ в ContactPage
 */
export const fadeIn = (
  direction: "up" | "down" | "left" | "right",
  type: string,
  delay: number,
  duration: number,
) => ({
  hidden: {
    x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
    y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type: type,
      delay: delay,
      duration: duration,
      ease: "easeOut",
    },
  },
});
