/**
 * @module src/utils/animationUtils.ts
 * @description Набор утилит для создания и настройки анимаций в React-компонентах с использованием Framer Motion. Предоставляет готовые функции для создания распространенных типов анимаций (появление, исчезновение, масштабирование), настройки временных параметров (задержки, длительности) и физических свойств (пружинные анимации). Позволяет легко создавать согласованные и профессиональные анимации во всем приложении.
 * @author Kort
 * @version 1.0.0
 * @see https://www.framer.com/motion/animation/ - Документация по анимациям в Framer Motion
 * @usage
 * 1. `src/components/layout/MobileMenu.tsx`: Для создания последовательного появления пунктов меню.
 * 2. `src/components/sections/Features.tsx`: Для анимации появления карточек с функциями.
 * 3. `src/components/ui/Button.tsx`: Для анимации нажатия и наведения на кнопки.
 * 4. `src/components/effects/ParallaxSection.tsx`: Для создания эффекта параллакса с плавными переходами.
 * 5. `src/animations/headerAnimations.ts`: Для создания базовых анимаций хедера.
 * @example
 * // Использование задержки для элементов списка
 * {items.map((item, index) => (
 *   <motion.div
 *     key={item.id}
 *     initial={{ opacity: 0, y: 20 }}
 *     animate={{ opacity: 1, y: 0 }}
 *     transition={{ delay: getStaggerDelay(index) }}
 *   >
 *     {item.content}
 *   </motion.div>
 * ))}
 * 
 * // Использование готовой анимации
 * <motion.div {...fadeInAnimation(0.2)}>
 *   Контент с анимацией появления
 * </motion.div>
 */

/**
 * Создает задержку для последовательной анимации элементов списка (эффект "стаггера")
 * @param index Индекс элемента в списке (начиная с 0)
 * @param baseDelay Базовая задержка между элементами в секундах (по умолчанию: 0.05)
 * @returns Задержка в секундах для конкретного элемента
 */
export const getStaggerDelay = (index: number, baseDelay: number = 0.05): number => {
  return baseDelay * index;
};

/**
 * Создает конфигурацию для пружинной анимации с физически корректным поведением
 * @param stiffness Жесткость пружины - чем выше, тем быстрее анимация (по умолчанию: 300)
 * @param damping Затухание - чем выше, тем меньше колебаний (по умолчанию: 30)
 * @param mass Масса объекта - чем выше, тем медленнее и тяжелее движение (по умолчанию: 1)
 * @returns Объект конфигурации для пружинной анимации
 */
export const springTransition = (stiffness: number = 300, damping: number = 30, mass: number = 1) => {
  return {
    type: "spring",
    stiffness,
    damping,
    mass
  };
};

/**
 * Создает конфигурацию для плавной анимации с заданной длительностью и функцией плавности
 * @param duration Длительность анимации в секундах (по умолчанию: 0.3)
 * @param ease Функция плавности ("linear", "easeIn", "easeOut", "easeInOut" или массив кубических точек Безье)
 * @returns Объект конфигурации для плавной анимации
 */
export const easeTransition = (duration: number = 0.3, ease: string = "easeInOut") => {
  return {
    type: "tween",
    duration,
    ease
  };
};

/**
 * Создает готовую анимацию появления снизу вверх с плавным изменением прозрачности
 * @param delay Задержка перед началом анимации в секундах (по умолчанию: 0)
 * @returns Объект с вариантами анимации для Framer Motion (initial, animate, exit)
 */
export const fadeInAnimation = (delay: number = 0) => {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        ...springTransition(),
        delay
      }
    },
    exit: { 
      opacity: 0, 
      y: 20,
      transition: easeTransition(0.2)
    }
  };
};

/**
 * Создает готовую анимацию появления слева направо с плавным изменением прозрачности
 * @param delay Задержка перед началом анимации в секундах (по умолчанию: 0)
 * @returns Объект с вариантами анимации для Framer Motion (initial, animate, exit)
 */
export const fadeInLeftAnimation = (delay: number = 0) => {
  return {
    initial: { opacity: 0, x: -50 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        ...springTransition(),
        delay
      }
    },
    exit: { 
      opacity: 0, 
      x: -50,
      transition: easeTransition(0.2)
    }
  };
};

/**
 * Создает готовую анимацию появления справа налево с плавным изменением прозрачности
 * @param delay Задержка перед началом анимации в секундах (по умолчанию: 0)
 * @returns Объект с вариантами анимации для Framer Motion (initial, animate, exit)
 */
export const fadeInRightAnimation = (delay: number = 0) => {
  return {
    initial: { opacity: 0, x: 50 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        ...springTransition(),
        delay
      }
    },
    exit: { 
      opacity: 0, 
      x: 50,
      transition: easeTransition(0.2)
    }
  };
};

/**
 * Создает готовую анимацию масштабирования с плавным изменением прозрачности
 * @param delay Задержка перед началом анимации в секундах (по умолчанию: 0)
 * @returns Объект с вариантами анимации для Framer Motion (initial, animate, exit)
 */
export const scaleAnimation = (delay: number = 0) => {
  return {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        ...springTransition(),
        delay
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: easeTransition(0.2)
    }
  };
};