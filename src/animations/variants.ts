/**
 * @module src/animations/variants.ts
 * @description Определяет набор стандартных вариантов анимации для Framer Motion.
 * @author Kort
 * @version 1.1.0
 */

import { Variants } from "framer-motion";

/**
 * @description Варианты для контейнеров, управляющих последовательной анимацией дочерних элементов.
 * Запускает анимацию дочерних элементов с небольшим интервалом.
 * @usage
 * 1. `src/pages/ProductsPage.tsx` - для контейнеров категорий продуктов и фильтров.
 * 2. `src/pages/HowToBuyPage.tsx` - для основного контейнера контента и списка преимуществ.
 * @example
 * <motion.div
 *   variants={containerVariants}
 *   initial="hidden"
 *   animate="show"
 * >
 *   <motion.div variants={itemVariants}>Child 1</motion.div>
 *   <motion.div variants={itemVariants}>Child 2</motion.div>
 * </motion.div>
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
 * @description Варианты для отдельных анимируемых элементов внутри контейнера.
 * Элемент появляется с плавным сдвигом вверх. Использует пружинную анимацию.
 * @usage
 * 1. `src/pages/ProductsPage.tsx` - для кнопок фильтров.
 * 2. `src/pages/PartnershipPage.tsx` - для анимированных блоков с описанием шагов и преимуществ.
 * 3. `src/pages/HowToBuyPage.tsx` - для блоков с инструкциями и карточек преимуществ.
 * @example
 * <motion.div variants={itemVariants}>
 *   Анимированный элемент
 * </motion.div>
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
 * @description Варианты для анимации заголовков. Заголовок появляется с плавным сдвигом вниз.
 * @usage
 * 1. `src/pages/PartnershipPage.tsx` - для главного заголовка страницы.
 * @example
 * <motion.h1 variants={headingVariants} initial="hidden" animate="show">
 *   Заголовок
 * </motion.h1>
 */
export const headingVariants: Variants = {
  hidden: { opacity: 0, y: -50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

/**
 * @description Варианты для контейнеров, создающих эффект "шахматной" или последовательной анимации дочерних элементов.
 * @usage
 * 1. `src/pages/PartnershipPage.tsx` - для контейнера с перечислением преимуществ партнерства.
 * @example
 * <motion.div variants={staggerContainer} initial="hidden" animate="show">
 *   { ...дочерние анимированные элементы... }
 * </motion.div>
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
 * @description Функция-генератор вариантов для анимации плавного появления элемента с указанного направления.
 * @param {'up' | 'down' | 'left' | 'right'} direction - Направление, откуда появится элемент.
 * @param {string} type - Тип анимации (например, 'spring', 'tween').
 * @param {number} delay - Задержка перед началом анимации в секундах.
 * @param {number} duration - Продолжительность анимации в секундах.
 * @usage
 * - На данный момент не используется в проекте.
 * @example
 * <motion.div variants={fadeIn('up', 'spring', 0.5, 0.75)} />
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

/**
 * @description Варианты для интерактивных элементов, таких как кнопки. Анимирует масштаб при наведении и нажатии.
 * @usage
 * 1. `src/pages/HowToBuyPage.tsx` - для кнопок регистрации и перехода в магазин.
 * @example
 * <motion.button
 *   variants={buttonVariants}
 *   whileHover="hover"
 *   whileTap="tap"
 * >
 *   Нажми меня
 * </motion.button>
 */
export const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

/**
 * @description Варианты для карточек. Анимирует появление, а также добавляет тень и увеличение при наведении.
 * @usage
 * 1. `src/pages/ProductsPage.tsx` - для всех карточек продуктов.
 * @example
 * <motion.div
 *   variants={cardVariants}
 *   initial="hidden"
 *   animate="show"
 *   whileHover="hover"
 * >
 *   Содержимое карточки
 * </motion.div>
 */
export const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
      duration: 0.5,
    },
  },
  hover: {
    scale: 1.03,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.08)",
  },
};
