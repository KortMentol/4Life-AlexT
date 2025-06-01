import { Variants } from 'framer-motion';

// Варианты для контейнера (появление секций целиком)
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Задержка между появлением дочерних элементов
      duration: 0.5,
    },
  },
};

// Варианты для отдельных дочерних элементов (текст, изображения, кнопки)
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 }, // Элемент появляется снизу
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring", // Пружинистая анимация
      damping: 12,    // Затухание
      stiffness: 100, // Жесткость
      duration: 0.6,
    },
  },
};

// Варианты для интерактивных кнопок (наведение, нажатие)
export const buttonVariants: Variants = {
  rest: { scale: 1 },         // Состояние покоя: обычный размер
  hover: { scale: 1.05 },     // Состояние наведения: чуть увеличенный размер
  tap: { scale: 0.95 },       // Состояние нажатия: чуть уменьшенный размер
};

// Варианты для карточек (товаров, отзывов, фич)
export const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
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
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.08)", // Более выраженная тень
  },
};
