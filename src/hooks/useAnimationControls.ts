/**
 * @module src/hooks/useAnimationControls.ts
 * @description Расширенный хук для управления анимациями Framer Motion с дополнительными возможностями отслеживания состояния анимации. Предоставляет удобный API для запуска, остановки и сброса анимаций, а также отслеживания их текущего состояния. Построен поверх стандартного хука useAnimationControls из Framer Motion, но с дополнительной функциональностью.
 * @author Kort
 * @version 1.0.0
 * @see https://www.framer.com/motion/animation/##animation-controls - Документация по AnimationControls в Framer Motion
 * @usage
 * 1. `src/components/layout/Header.tsx`: Для управления анимациями хедера при скролле и взаимодействии.
 * 2. `src/components/ui/AnimatedIcon.tsx`: Для программного управления анимациями иконок.
 * 3. `src/components/sections/Features.tsx`: Для управления последовательностью анимаций при появлении секции.
 * 4. `src/components/effects/ParallaxEffect.tsx`: Для синхронизации анимаций с прокруткой страницы.
 * @example
 * // Базовое использование
 * const { controls, animate, isAnimating } = useAnimationControls();
 *
 * // Запуск анимации
 * const handleClick = async () => {
 *   await animate({ scale: 1.2, opacity: 1 });
 *   console.log("Анимация завершена");
 * };
 *
 * // Применение к компоненту
 * <motion.div animate={controls}>
 *   {isAnimating ? "Анимация идет..." : "Нажми для анимации"}
 * </motion.div>
 */
import { useRef } from "react";
import {
  AnimationControls,
  useAnimationControls as useFramerAnimationControls,
} from "framer-motion";

/**
 * Интерфейс возвращаемого значения хука useAnimationControls
 * @interface UseAnimationControlsReturn
 */
type StartParams = Parameters<AnimationControls["start"]>;
type StartReturn = ReturnType<AnimationControls["start"]>;

interface UseAnimationControlsReturn {
  /** Оригинальный объект AnimationControls из Framer Motion */
  controls: AnimationControls;
  /**
   * Функция для запуска анимации с отслеживанием состояния
   * @param target - Целевое состояние анимации (объект свойств или имя варианта)
   * @param options - Дополнительные опции анимации
   * @returns Promise, который разрешается по завершении анимации
   */
  animate: (...args: StartParams) => StartReturn;
  /** Функция для остановки текущей анимации */
  stop: () => void;
  /** Функция для сброса анимации в начальное состояние */
  reset: () => void;
  /** Флаг, указывающий, выполняется ли анимация в данный момент */
  isAnimating: boolean;
  /**
   * Функция для ручной установки состояния анимации
   * @param isAnimating - Новое состояние анимации
   */
  setAnimating: (isAnimating: boolean) => void;
}

/**
 * Хук для расширенного управления анимациями с отслеживанием состояния
 * @returns Объект с функциями и свойствами для управления анимациями
 */
export const useAnimationControls = (): UseAnimationControlsReturn => {
  // Используем стандартный хук из Framer Motion
  const controls = useFramerAnimationControls();
  // Храним состояние анимации в ref для избежания перерендеров
  const isAnimatingRef = useRef<boolean>(false);

  /**
   * Запускает анимацию и отслеживает её состояние
   * @param target - Целевое состояние анимации
   * @param options - Дополнительные опции анимации
   * @returns Promise с результатом анимации
   */
  const animate = async (...args: StartParams) => {
    isAnimatingRef.current = true;
    const result = await controls.start(...args);
    isAnimatingRef.current = false;
    return result;
  };

  /**
   * Останавливает текущую анимацию
   */
  const stop = () => {
    controls.stop();
    isAnimatingRef.current = false;
  };

  /**
   * Сбрасывает анимацию в начальное состояние
   */
  const reset = () => {
    controls.set({});
    isAnimatingRef.current = false;
  };

  /**
   * Вручную устанавливает состояние анимации
   * @param isAnimating - Новое состояние анимации
   */
  const setAnimating = (isAnimating: boolean) => {
    isAnimatingRef.current = isAnimating;
  };

  return {
    controls,
    animate,
    stop,
    reset,
    // Используем геттер для доступа к актуальному значению ref
    get isAnimating() {
      return isAnimatingRef.current;
    },
    setAnimating,
  };
};
