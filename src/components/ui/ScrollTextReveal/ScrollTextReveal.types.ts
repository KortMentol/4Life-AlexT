/**
 * @module src/components/ui/ScrollTextReveal/ScrollTextReveal.types.ts
 * @description TypeScript interfaces and types for ScrollTextReveal component
 * @author Kort
 * @version 1.0.0
 */

import { MotionValue } from "framer-motion";

export interface ScrollTextRevealProps {
  /** Text content to animate */
  children: string;
  /** Additional CSS classes */
  className?: string;
  /** Delay between word animations (default: 0.04) */
  staggerDelay?: number;
  /** Animation easing function (default: 'sine') */
  easingFunction?: string;
}

export interface WordRevealProps {
  /** The word to animate */
  word: string;
  /** Index of the word in the text */
  index: number;
  /** Total number of words */
  totalWords: number;
  /** Scroll progress motion value */
  scrollProgress: MotionValue<number>;
  /** Delay between word animations */
  staggerDelay: number;
  /** Animation easing function */
  easingFunction: string;
  /** Current theme mode */
  theme: "light" | "dark";
  /** Performance tier for conditional effects */
  tier?: "high" | "medium";
}

export interface TextSplitterResult {
  /** Array of individual words */
  words: string[];
  /** Boolean array indicating preserved spacing after each word */
  preservedSpacing: boolean[];
  /** Array of indices where line breaks occur */
  lineBreaks: number[];
}

export interface PerformanceTierConfig {
  /** Performance tier level */
  tier: "low" | "medium" | "high";
  /** Whether to enable word-by-word splitting */
  enableWordSplitting: boolean;
  /** Whether to enable blur effect */
  enableBlurEffect: boolean;
  /** Whether to enable skew effect */
  enableSkewEffect: boolean;
  /** Whether to enable GPU acceleration */
  enableGPUAcceleration: boolean;
}

export interface AnimationState {
  /** Whether component is in viewport */
  isInView: boolean;
  /** Current scroll progress (0-1) */
  scrollProgress: number;
  /** Animation states for each word */
  wordStates: WordAnimationState[];
  /** Current performance tier */
  performanceTier: "low" | "medium" | "high";
  /** Current theme mode */
  themeMode: "light" | "dark";
}

export interface WordAnimationState {
  /** Word index */
  index: number;
  /** The word text */
  word: string;
  /** Current opacity value */
  opacity: number;
  /** Current skewX value */
  skewX: number;
  /** Current blur value */
  blur: number;
  /** Whether word is currently animating */
  isAnimating: boolean;
}

export interface ScrollTextRevealConfig {
  animation: {
    /** Stagger delay between words */
    staggerDelay: number; // 0.04
    /** Animation easing function */
    easingFunction: string; // 'sine'
    /** Blur animation range [start, end] */
    blurRange: [number, number]; // [8, 0]
    /** Skew animation range [start, end] */
    skewRange: [number, number]; // [-20, 0]
    /** Opacity animation range [start, end] */
    opacityRange: [number, number]; // [0, 1]
  };
  scrollTrigger: {
    /** Scroll trigger start offset */
    startOffset: string; // 'top bottom-=15%'
    /** Scroll trigger end offset */
    endOffset: string; // 'bottom center+=15%'
    /** Whether scrub is enabled */
    scrubEnabled: boolean; // true
  };
  performance: {
    /** Intersection observer margin */
    inViewMargin: string; // '200px'
    /** Whether GPU acceleration is enabled */
    gpuAcceleration: boolean; // true for high tier
    /** Whether willChange optimization is enabled */
    willChangeOptimization: boolean; // true
  };
}

export type PerformanceTier = "low" | "medium" | "high";
export type ThemeMode = "light" | "dark";
