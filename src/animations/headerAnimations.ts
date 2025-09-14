/**
 * @module src/animations/headerAnimations.ts
 * @description Набор предопределенных анимаций для хедера и мобильного меню сайта. Содержит варианты анимаций для появления/исчезновения хедера, навигационных элементов, логотипа, иконок и мобильного меню. Использует Framer Motion для создания плавных, отзывчивых анимаций с настраиваемыми параметрами пружины.
 * @author Kort
 * @version 1.0.0
 * @see framerUtils - Базовые утилиты для создания анимаций
 * @usage
 * 1. `src/components/layout/Header.tsx`: Для анимации появления/исчезновения хедера, навигационных элементов и логотипа.
 * 2. `src/components/layout/MobileMenu.tsx`: Для анимации появления/исчезновения мобильного меню и его оверлея.
 * 3. `src/components/ui/NavItem.tsx`: Для анимации подчеркивания активного пункта меню.
 * @example
 * // Использование в компоненте с Framer Motion
 * import { headerVariants } from "../../animations/headerAnimations";
 *
 * <motion.header
 *   variants={headerVariants}
 *   initial="hidden"
 *   animate="visible"
 * >
 *   { Содержимое хедера }
 * </motion.header>
 */

import { Variants } from "framer-motion";
import {
  fadeInVariants,
  scaleVariants,
  hoverVariants,
  overlayVariants as createOverlayVariants,
} from "@/utils/framerUtils";

/**
 * Awwwards 2025 оптимизированные анимации для хедера
 * Максимальная производительность с GPU-ускорением
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
 * Анимации для элементов навигации - плавное появление сверху вниз
 * с эффектом при наведении
 */
export const navItemVariants: Variants = {
  ...fadeInVariants("up", 0.5),
  ...hoverVariants(1.05, 0.3),
};

/**
 * Анимации для подчеркивания активного пункта меню
 * Плавно расширяется от 0 до 100% ширины
 */
export const underlineVariants: Variants = {
  initial: {
    width: 0,
    opacity: 0,
  },
  animate: {
    width: "100%",
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

/**
 * Анимации для иконок в хедере
 * Комбинирует эффекты масштабирования при появлении и наведении
 */
export const iconVariants: Variants = {
  ...scaleVariants(0.5),
  ...hoverVariants(1.1, 0.3),
};

/**
 * Оптимизированные анимации для логотипа с GPU-ускорением
 */
export const logoVariants: Variants = {
  ...scaleVariants(0.5, 0.1),
  hover: {
    scale: 1.03,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  },
};

/**
 * Оптимизированные анимации для мобильного меню
 * Максимальная производительность с уменьшенными значениями stiffness
 */
export const mobileMenuVariants: Variants = {
  hidden: {
    x: "-100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25,
    },
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25,
    },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 250,
      damping: 30,
    },
  },
};

/**
 * Анимации для затемняющего оверлея мобильного меню
 * Создается с помощью утилиты createOverlayVariants с указанной длительностью
 */
export const overlayVariants = createOverlayVariants(0.3);
