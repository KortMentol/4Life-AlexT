/**
 * @module src/utils/framerUtils.ts
 * @description Набор утилит для работы с библиотекой Framer Motion. Предоставляет готовые функции для создания различных типов анимаций: появление/исчезновение, масштабирование, стаггер-эффекты, анимации при наведении и другие. Каждая функция возвращает объект Variants, который можно напрямую использовать в компонентах motion.
 * @author Kort
 * @version 1.0.0
 * @see https://www.framer.com/motion/ - Официальная документация Framer Motion
 * @usage
 * 1. `src/animations/headerAnimations.ts`: Для создания базовых анимаций хедера и мобильного меню.
 * 2. `src/components/ui/*`: В UI-компонентах для создания интерактивных анимаций.
 * 3. `src/components/layout/PageTransition.tsx`: Для анимации переходов между страницами.
 * 4. `src/components/modals/*`: Для анимации появления/исчезновения модальных окон.
 * 5. `src/components/sections/*`: Для анимации появления секций при скролле.
 * @example
 * // Использование fadeInVariants для анимации появления элемента снизу вверх
 * import { fadeInVariants } from "@/utils/framerUtils";
 * 
 * <motion.div
 *   variants={fadeInVariants("up", 0.5, 0.2)}
 *   initial="hidden"
 *   animate="visible"
 * >
 *   Контент с анимацией
 * </motion.div>
 */

import { Variants } from "framer-motion";

/**
 * Создает варианты анимации появления элемента с указанным направлением движения
 * @param direction Направление появления элемента (вверх, вниз, влево, вправо или без смещения)
 * @param duration Длительность анимации в секундах
 * @param delay Задержка перед началом анимации в секундах
 * @returns Объект Variants с состояниями hidden и visible
 */
export const fadeInVariants = (
  direction: "up" | "down" | "left" | "right" | "none" = "none",
  duration: number = 0.5,
  delay: number = 0
): Variants => {
  const directionOffset = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    none: {}
  };

  return {
    hidden: {
      opacity: 0,
      ...directionOffset[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
};

/**
 * Создает варианты анимации масштабирования элемента от меньшего к нормальному размеру
 * @param duration Длительность анимации в секундах
 * @param delay Задержка перед началом анимации в секундах
 * @returns Объект Variants с состояниями hidden и visible
 */
export const scaleVariants = (
  duration: number = 0.5,
  delay: number = 0
): Variants => {
  return {
    hidden: {
      opacity: 0,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
};

/**
 * Создает варианты анимации для контейнера с эффектом стаггера (последовательного появления дочерних элементов)
 * @param staggerChildren Интервал между анимациями дочерних элементов в секундах
 * @param delayChildren Общая задержка перед началом анимации всех дочерних элементов в секундах
 * @returns Объект Variants с состояниями hidden и visible и настройками для дочерних элементов
 */
export const staggerVariants = (
  staggerChildren: number = 0.1,
  delayChildren: number = 0
): Variants => {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren
      }
    }
  };
};

/**
 * Создает варианты анимации для интерактивных элементов с эффектами при наведении и нажатии
 * @param scale Коэффициент увеличения при наведении (1.05 = увеличение на 5%)
 * @param duration Длительность анимации в секундах
 * @returns Объект Variants с состояниями initial, hover и tap
 */
export const hoverVariants = (
  scale: number = 1.05,
  duration: number = 0.3
): Variants => {
  return {
    initial: { scale: 1 },
    hover: {
      scale,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
};

/**
 * Создает варианты анимации для списков с последовательным появлением элементов
 * @param staggerChildren Интервал между анимациями элементов списка в секундах
 * @param delayChildren Общая задержка перед началом анимации всех элементов списка в секундах
 * @returns Объект Variants с настройками для контейнера списка
 */
export const listVariants = (
  staggerChildren: number = 0.1,
  delayChildren: number = 0
): Variants => {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren,
        delayChildren
      }
    }
  };
};

/**
 * Создает варианты анимации для отдельных элементов списка
 * @param direction Направление появления элемента (вверх, вниз, влево, вправо или без смещения)
 * @param duration Длительность анимации в секундах
 * @returns Объект Variants для элемента списка
 */
export const listItemVariants = (
  direction: "up" | "down" | "left" | "right" | "none" = "up",
  duration: number = 0.5
): Variants => {
  const directionOffset = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    none: {}
  };

  return {
    hidden: {
      opacity: 0,
      ...directionOffset[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
};

/**
 * Создает варианты анимации для переходов между страницами
 * @param duration Длительность анимации в секундах
 * @returns Объект Variants с состояниями initial, animate и exit для анимации страниц
 */
export const pageVariants = (duration: number = 0.5): Variants => {
  return {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
};

/**
 * Создает варианты анимации для модальных окон с эффектом масштабирования
 * @param duration Длительность анимации в секундах
 * @returns Объект Variants с состояниями hidden, visible и exit для модальных окон
 */
export const modalVariants = (duration: number = 0.5): Variants => {
  return {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
};

/**
 * Создает варианты анимации для затемняющего оверлея (фона модальных окон, мобильного меню)
 * @param duration Длительность анимации в секундах
 * @returns Объект Variants с состояниями hidden, visible и exit для оверлея
 */
export const overlayVariants = (duration: number = 0.3): Variants => {
  return {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };
};