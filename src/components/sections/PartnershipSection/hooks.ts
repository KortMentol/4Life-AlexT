/**
 * @module PartnershipSection/hooks.ts
 * Локальные хуки секции. Не экспортируются наружу.
 */

import type { PerformanceTier } from "@/hooks/usePerformanceTier";
import { animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SCRAMBLE_CHARS } from "./constants";

// Проверяем prefers-reduced-motion один раз при загрузке модуля
const prefersReducedMotion =
  typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;

// ─── useScramble ──────────────────────────────────────────────────────────────
export function useScramble(target: string, active: boolean, tier: PerformanceTier): string {
  const [display, setDisplay] = useState(tier !== "high" ? target : "");
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Отключаем scramble если reduced motion или не high tier
    if (!active || tier !== "high" || prefersReducedMotion) {
      setDisplay(target);
      return;
    }

    let iteration = 0;
    const total = 14;

    frameRef.current = setInterval(() => {
      setDisplay(
        target
          .split("")
          .map((char, idx) => {
            if (char === " ") return " ";
            if (idx < Math.floor((iteration / total) * target.length)) return char;
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join(""),
      );
      iteration++;
      if (iteration > total + target.length) {
        if (frameRef.current) clearInterval(frameRef.current);
      }
    }, 80);

    return () => {
      if (frameRef.current) clearInterval(frameRef.current);
    };
  }, [active, target, tier]);

  return display;
}

// ─── useCountUp ───────────────────────────────────────────────────────────────
export function useCountUp(target: number, active: boolean, tier: PerformanceTier, delay = 0, duration = 1.8): number {
  const [value, setValue] = useState(tier === "low" ? target : 0);

  useEffect(() => {
    // Отключаем анимацию если reduced motion — сразу показываем финальное значение
    if (!active || tier === "low" || prefersReducedMotion) {
      if (active) setValue(target);
      return;
    }

    const ctrl = animate(0, target, {
      duration,
      delay,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });

    return ctrl.stop;
  }, [active, target, tier, delay, duration]);

  return value;
}
