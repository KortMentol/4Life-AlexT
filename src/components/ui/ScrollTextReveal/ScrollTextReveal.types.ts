/**
 * @module src/components/ui/ScrollTextReveal/ScrollTextReveal.types.ts
 * @description Настройки типов для пословной анимации появления текста при прокрутке.
 * Полностью исключены любые рудименты управления светлой темой и ThemeMode.
 * @author Kort
 * @version 1.1.0
 */

import { MotionValue } from "framer-motion";

export interface ScrollTextRevealProps {
  /** Текст для анимации */
  children: string;
  /** Дополнительные CSS классы */
  className?: string;
  /** Задержка между появлением слов (по умолчанию: 0.04) */
  staggerDelay?: number;
  /** Функция плавности анимации (по умолчанию: 'sine') */
  easingFunction?: string;
}

export interface WordRevealProps {
  /** Слово для анимации */
  word: string;
  /** Индекс текущего слова */
  index: number;
  /** Общее количество слов */
  totalWords: number;
  /** MotionValue прогресса скролла */
  scrollProgress: MotionValue<number>;
  /** Задержка анимации */
  staggerDelay: number;
  /** Функция плавности */
  easingFunction: string;
  /** Текущий тир производительности */
  tier?: "high" | "medium";
}

export interface TextSplitterResult {
  /** Массив разделенных слов */
  words: string[];
  /** Булевый массив сохранения пробелов после слов */
  preservedSpacing: boolean[];
  /** Индексы переноса строк */
  lineBreaks: number[];
}

export interface PerformanceTierConfig {
  /** Уровень тира */
  tier: "low" | "medium" | "high";
  /** Флаг пословного разделения */
  enableWordSplitting: boolean;
  /** Флаг эффекта размытия */
  enableBlurEffect: boolean;
  /** Флаг эффекта наклона */
  enableSkewEffect: boolean;
  /** Флаг аппаратного ускорения */
  enableGPUAcceleration: boolean;
}

export interface AnimationState {
  /** Видим ли блок в вьюпорте */
  isInView: boolean;
  /** Прогресс скролла (0-1) */
  scrollProgress: number;
  /** Массив состояний для каждого слова */
  wordStates: WordAnimationState[];
  /** Текущий тир производительности */
  performanceTier: "low" | "medium" | "high";
}

export interface WordAnimationState {
  index: number;
  word: string;
  opacity: number;
  skewX: number;
  blur: number;
  isAnimating: boolean;
}

export interface ScrollTextRevealConfig {
  animation: {
    staggerDelay: number;
    easingFunction: string;
    blurRange: [number, number];
    skewRange: [number, number];
    opacityRange: [number, number];
  };
  scrollTrigger: {
    startOffset: string;
    endOffset: string;
    scrubEnabled: boolean;
  };
  performance: {
    inViewMargin: string;
    gpuAcceleration: boolean;
    willChangeOptimization: boolean;
  };
}

export type PerformanceTier = "low" | "medium" | "high";
