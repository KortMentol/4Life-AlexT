import { useState, useEffect, useMemo } from "react";
import { Variants } from "framer-motion";

/**
 * Результат хука usePreloadedAnimation
 */
interface PreloadedAnimationResult {
  /** Флаг загрузки компонента */
  isLoaded: boolean;
  /** Варианты для элементов, которые должны быть видны сразу */
  preloadedVariants: Variants;
  /** Варианты для элементов, которые должны появляться с анимацией */
  fadeInVariants: Variants;
  /** Классы для предотвращения моргания */
  preloadClass: string;
}

/**
 * Хук для предотвращения моргания анимаций при первой загрузке
 * @returns Объект с вариантами анимаций и состоянием загрузки
 */
export const usePreloadedAnimation = (): PreloadedAnimationResult => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Устанавливаем флаг загрузки после монтирования компонента
    setIsLoaded(true);

    // Добавляем класс к body для предотвращения моргания
    document.body.classList.add("animations-ready");

    return () => {
      document.body.classList.remove("animations-ready");
    };
  }, []);

  // Мемоизируем варианты анимаций для предотвращения ненужных ререндеров
  const variants = useMemo(
    () => ({
      // Варианты для элементов, которые должны быть видны сразу
      preloadedVariants: {
        visible: { opacity: 1, y: 0 },
      } as Variants,

      // Варианты для элементов, которые должны появляться с анимацией
      fadeInVariants: {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: "easeOut" },
        },
      } as Variants,
    }),
    [],
  );

  // Возвращаем объекты с вариантами анимаций
  return {
    isLoaded,
    ...variants,
    // Классы для предотвращения моргания
    preloadClass: isLoaded ? "" : "no-flicker",
  };
};

export default usePreloadedAnimation;
