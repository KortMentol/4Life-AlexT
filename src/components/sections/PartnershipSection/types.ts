import type { MotionValue } from "framer-motion";
import type React from "react";

export type PerformanceTier = "low" | "medium" | "high";

export interface FeatureCardData {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  image: string;
  accent: string;
}

export interface SharedProps {
  scrollYProgress: MotionValue<number>;
  tier: PerformanceTier;
  isDark: boolean;
}

export const springConfigs = {
  low: { stiffness: 50, damping: 35, mass: 1 },
  medium: { stiffness: 80, damping: 28, mass: 0.8 },
  high: { stiffness: 120, damping: 22, mass: 0.5 },
  // Жёсткий конфиг для touch — меньше вычислений на main thread
  touch: { stiffness: 60, damping: 40, mass: 1 },
} as const;

export const IS_TOUCH =
  typeof window !== "undefined" ? "ontouchstart" in window || navigator.maxTouchPoints > 0 : false;
