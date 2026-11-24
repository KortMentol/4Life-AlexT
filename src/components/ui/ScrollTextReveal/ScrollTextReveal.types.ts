import { MotionValue } from "framer-motion";

export interface ScrollTextRevealProps {
  children: string;
  className?: string;
  staggerDelay?: number;
  easingFunction?: string;
}

export interface WordRevealProps {
  word: string;
  index: number;
  totalWords: number;
  scrollProgress: MotionValue<number>;
  staggerDelay: number;
  easingFunction: string;
  tier?: "high" | "medium";
}

export interface TextSplitterResult {
  words: string[];
  preservedSpacing: boolean[];
  lineBreaks: number[];
}

export interface PerformanceTierConfig {
  tier: "low" | "medium" | "high";
  enableWordSplitting: boolean;
  enableBlurEffect: boolean;
  enableSkewEffect: boolean;
  enableGPUAcceleration: boolean;
}

export interface AnimationState {
  isInView: boolean;
  scrollProgress: number;
  wordStates: WordAnimationState[];
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
