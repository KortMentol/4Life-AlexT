import { Variants } from "framer-motion";

// Предзагруженные варианты для предотвращения моргания
export const preloadedVariants: Variants = {
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

// Варианты для элементов, которые должны быть видны сразу
export const noFlickerVariants: Variants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
};

// Оптимизированные варианты для карточек
export const optimizedCardVariants: Variants = {
  initial: { opacity: 1, y: 0, scale: 1 },
  whileInView: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3 },
  },
  whileHover: {
    y: -5,
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

// Оптимизированные варианты для контейнеров
export const optimizedContainerVariants: Variants = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
};
